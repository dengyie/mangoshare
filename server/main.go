// Command account-server is the standalone user-account backend for
// mangoshare: open email-code registration, password login and per-user
// item checklists (opened / wanted). It binds loopback only — nginx
// terminates TLS and proxies /account-api/ to it.
package main

import (
	"context"
	"errors"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	cfg := LoadConfig()
	logger := log.New(os.Stdout, "account-server ", log.LstdFlags|log.LUTC)

	st, err := openStore(cfg.DBPath)
	if err != nil {
		logger.Fatalf("open store %s: %v", cfg.DBPath, err)
	}
	defer st.close()

	var mailer Mailer
	if cfg.ResendAPIKey == "" {
		logger.Print("WARNING: RESEND_API_KEY not set — verification codes go to the log only (dev mode)")
		mailer = devMailer{logger: logger}
	} else {
		mailer = newResendMailer(cfg.ResendAPIKey, cfg.MailFrom)
	}

	srv := NewServer(cfg, st, mailer, logger)

	httpSrv := &http.Server{
		Addr:              cfg.Addr,
		Handler:           srv.Handler(),
		ReadHeaderTimeout: 10 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	ln, err := net.Listen("tcp", cfg.Addr)
	if err != nil {
		logger.Fatalf("listen %s: %v", cfg.Addr, err)
	}

	done := make(chan struct{})
	go func() {
		sig := make(chan os.Signal, 1)
		signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
		<-sig
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_ = httpSrv.Shutdown(ctx)
		close(done)
	}()

	logger.Printf("listening on %s (db=%s mailer=%T)", cfg.Addr, cfg.DBPath, mailer)
	if err := httpSrv.Serve(ln); err != nil && !errors.Is(err, http.ErrServerClosed) {
		logger.Fatalf("serve: %v", err)
	}
	<-done
	logger.Print("stopped")
}
