package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

// Mailer sends verification-code emails.
type Mailer interface {
	SendCode(ctx context.Context, to, code, purpose string) error
}

const (
	purposeRegister = "register"
	purposeReset    = "reset"
)

func mailSubject(purpose string) string {
	if purpose == purposeReset {
		return "MangoShare 重置密码验证码"
	}
	return "MangoShare 注册验证码"
}

func mailHTML(purpose, code string) string {
	action := "注册"
	if purpose == purposeReset {
		action = "重置密码"
	}
	return fmt.Sprintf(`<!doctype html>
<html><body style="margin:0;padding:24px;background:#fafafa;font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;color:#222;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:12px;padding:32px;">
    <h2 style="margin:0 0 16px;font-size:18px;">MangoShare %s验证码</h2>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#555;">
      你正在 %s MangoShare 账号。请在 10 分钟内输入以下验证码：
    </p>
    <div style="font-size:32px;font-weight:700;letter-spacing:8px;font-family:Menlo,Consolas,monospace;background:#f5f5f4;border-radius:8px;padding:16px;text-align:center;">%s</div>
    <p style="margin:20px 0 0;font-size:12px;line-height:1.7;color:#999;">
      如果这不是你的操作，请忽略本邮件。验证码泄露给他人可能导致账号被盗。
    </p>
  </div>
</body></html>`, action, action, code)
}

// resendMailer sends via the Resend HTTPS API — no SMTP, works behind the
// VPS's NAT egress. The sending domain must be verified in Resend.
type resendMailer struct {
	apiKey string
	from   string
	hc     *http.Client
}

func newResendMailer(apiKey, from string) *resendMailer {
	return &resendMailer{
		apiKey: apiKey,
		from:   from,
		hc:     &http.Client{Timeout: 10 * time.Second},
	}
}

func (m *resendMailer) SendCode(ctx context.Context, to, code, purpose string) error {
	body := map[string]any{
		"from":    m.from,
		"to":      []string{to},
		"subject": mailSubject(purpose),
		"html":    mailHTML(purpose, code),
	}
	buf, err := json.Marshal(body)
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://api.resend.com/emails", bytes.NewReader(buf))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+m.apiKey)
	req.Header.Set("Content-Type", "application/json")
	resp, err := m.hc.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		return fmt.Errorf("resend api status %d", resp.StatusCode)
	}
	return nil
}

// devMailer logs codes instead of sending — for local dev without a
// Resend key. Never used in production (RESEND_API_KEY set).
type devMailer struct{ logger *log.Logger }

func (devMailer) String() string { return "dev" }

func (m devMailer) SendCode(_ context.Context, to, code, purpose string) error {
	m.logger.Printf("DEV MAIL to=%s purpose=%s code=%s", to, purpose, code)
	return nil
}
