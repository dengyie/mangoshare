package main

import (
	"sync"
	"time"
)

// rateLimiter is an in-memory fixed-window counter, keyed freely
// ("sc:ip:1.2.3.4", "login:acct:a@b.c", ...). Sufficient for a
// single-instance service of this scale.
type rateLimiter struct {
	mu      sync.Mutex
	buckets map[string]*rlBucket
}

type rlBucket struct {
	count  int
	window time.Time
}

func newRateLimiter() *rateLimiter {
	return &rateLimiter{buckets: make(map[string]*rlBucket)}
}

func (rl *rateLimiter) allow(key string, limit int, window time.Duration) bool {
	now := time.Now()
	rl.mu.Lock()
	defer rl.mu.Unlock()
	b, ok := rl.buckets[key]
	if !ok || now.Sub(b.window) >= window {
		rl.buckets[key] = &rlBucket{count: 1, window: now}
		return true
	}
	if b.count >= limit {
		return false
	}
	b.count++
	return true
}

// reset clears failure counters (e.g. after a successful login).
func (rl *rateLimiter) reset(prefix string) {
	rl.mu.Lock()
	defer rl.mu.Unlock()
	for k := range rl.buckets {
		if len(k) >= len(prefix) && k[:len(prefix)] == prefix {
			delete(rl.buckets, k)
		}
	}
}
