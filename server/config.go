package main

import (
	"os"
	"strings"
	"time"
)

// Config is sourced entirely from environment variables so prod secrets
// live in the systemd EnvironmentFile, never in code.
type Config struct {
	Addr         string // listen address, loopback in prod
	DBPath       string // sqlite file path
	ResendAPIKey string // empty => dev mailer that logs codes
	MailFrom     string // Resend "from" header
	SiteURL      string // public site origin, used in mail copy
	TokenTTL     time.Duration
	CodeTTL      time.Duration
}

func LoadConfig() Config {
	env := func(key, def string) string {
		if v := os.Getenv(key); v != "" {
			return v
		}
		return def
	}
	dur := func(key string, def time.Duration) time.Duration {
		if v := os.Getenv(key); v != "" {
			if d, err := time.ParseDuration(v); err == nil && d > 0 {
				return d
			}
		}
		return def
	}
	return Config{
		Addr:         env("ADDR", "127.0.0.1:8090"),
		DBPath:       env("DB_PATH", "account.db"),
		ResendAPIKey: os.Getenv("RESEND_API_KEY"),
		MailFrom:     env("MAIL_FROM", "MangoShare <noreply@otp.mangoqwq.com>"),
		SiteURL:      strings.TrimRight(env("SITE_URL", "https://share.mangoqwq.com"), "/"),
		TokenTTL:     dur("TOKEN_TTL", 30*24*time.Hour),
		CodeTTL:      dur("CODE_TTL", 10*time.Minute),
	}
}
