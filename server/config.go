package main

import (
	"os"
	"strings"
	"time"
)

// Config is sourced entirely from environment variables so prod secrets
// live in the systemd EnvironmentFile, never in code.
type Config struct {
	Addr         string   // listen address, loopback in prod
	DBPath       string   // sqlite file path
	ResendAPIKey string   // direct-Resend fallback; empty unless ONE_MAIL_* unset
	MailFrom     string   // Resend "from" header / one-mail from_name
	SiteURL      string   // public site origin, used in mail copy
	AdminEmails  []string // local accounts that unlock the admin console UI; empty = nobody
	OneMailAPI   string   // one-mail Worker base URL, e.g. https://mail-api.mangoqwq.com
	OneMailToken string   // one-mail address JWT (from bound to this address)
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
		AdminEmails:  parseAdminEmails(os.Getenv("ADMIN_EMAIL")),
		OneMailAPI:   strings.TrimRight(env("ONE_MAIL_API_BASE", ""), "/"),
		OneMailToken: os.Getenv("ONE_MAIL_SEND_TOKEN"),
		TokenTTL:     dur("TOKEN_TTL", 30*24*time.Hour),
		CodeTTL:      dur("CODE_TTL", 10*time.Minute),
	}
}

// parseAdminEmails accepts ADMIN_EMAIL as a comma-separated list so several
// local accounts can hold the admin role. Entries are lowercased, trimmed
// and deduplicated; the singular env name is kept for continuity.
func parseAdminEmails(v string) []string {
	seen := map[string]bool{}
	out := []string{}
	for _, part := range strings.Split(v, ",") {
		e := strings.ToLower(strings.TrimSpace(part))
		if e != "" && !seen[e] {
			seen[e] = true
			out = append(out, e)
		}
	}
	return out
}
