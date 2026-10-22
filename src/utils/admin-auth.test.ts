/**
 * Regression tests for the two-step admin login contract against the
 * MangoApi backend (POST /api/user/login → optional 2FA challenge →
 * POST /api/user/login/2fa). The fetch layer is stubbed; everything else
 * (response routing, role gating, TTL fallback) runs for real.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { completeAdminLogin, startAdminLogin } from './admin-auth';

const BASE = 'https://api.example.com';

function jsonResponse(payload: unknown, status = 200): Response {
  return {
    ok: status < 400,
    status,
    json: () => Promise.resolve(payload),
  } as unknown as Response;
}

function sessionData(role = 100) {
  return {
    access_token: 'tok-1',
    access_expires_at: 1900000000,
    user: { username: 'mango', display_name: 'Mango', role },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('startAdminLogin', () => {
  it('resolves straight to a session when no 2FA is enabled', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ success: true, data: sessionData() }));
    vi.stubGlobal('fetch', fetchMock);

    const attempt = await startAdminLogin(BASE, 'mango', 'pw');

    expect(attempt).toEqual({
      kind: 'session',
      session: expect.objectContaining({
        baseUrl: BASE,
        username: 'mango',
        role: 100,
        token: 'tok-1',
        expiresAt: 1900000000000,
      }),
    });
    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE}/api/user/login`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('returns a 2FA challenge when the backend answers require_verification', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          require_verification: true,
          flow_token: 'flow-1',
          methods: [{ method: '2fa', available: true }],
        },
      })
    ));

    const attempt = await startAdminLogin(BASE, 'mango', 'pw');

    expect(attempt).toEqual({ kind: '2fa', flowToken: 'flow-1' });
  });

  it('treats a challenge without a methods list as 2FA (fork compatibility)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      jsonResponse({ success: true, data: { require_verification: true, flow_token: 'flow-2' } })
    ));

    await expect(startAdminLogin(BASE, 'mango', 'pw')).resolves.toEqual({
      kind: '2fa',
      flowToken: 'flow-2',
    });
  });

  it('rejects challenges that only offer unsupported verification methods', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          require_verification: true,
          flow_token: 'flow-3',
          methods: [{ method: 'passkey', available: true }],
        },
      })
    ));

    await expect(startAdminLogin(BASE, 'mango', 'pw')).rejects.toThrow('本站暂不支持');
  });

  it('rejects a malformed challenge that carries no flow_token', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: { require_verification: true, methods: [{ method: '2fa', available: true }] },
      })
    ));

    await expect(startAdminLogin(BASE, 'mango', 'pw')).rejects.toThrow('挑战响应不完整');
  });

  it('surfaces backend rejection messages for bad credentials', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      jsonResponse({ success: false, message: '用户名或密码错误' })
    ));

    await expect(startAdminLogin(BASE, 'mango', 'bad')).rejects.toThrow('用户名或密码错误');
  });

  it('rejects non-admin sessions before a session is built', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      jsonResponse({ success: true, data: sessionData(1) })
    ));

    await expect(startAdminLogin(BASE, 'mango', 'pw')).rejects.toThrow('该账号不是管理员');
  });

  it('reports missing fields when the response carries neither token nor challenge', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      jsonResponse({ success: true, data: { user: { role: 100 } } })
    ));

    await expect(startAdminLogin(BASE, 'mango', 'pw')).rejects.toThrow('登录响应缺少必要字段');
  });

  it('falls back to a conservative TTL when access_expires_at is absent', async () => {
    const data = sessionData();
    delete (data as { access_expires_at?: number }).access_expires_at;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ success: true, data })));

    const attempt = await startAdminLogin(BASE, 'mango', 'pw');

    expect(attempt.kind).toBe('session');
    if (attempt.kind !== 'session') throw new Error('unreachable');
    const expectedCeiling = Date.now() + 14 * 60 * 1000;
    expect(attempt.session.expiresAt).toBeLessThanOrEqual(expectedCeiling);
    expect(attempt.session.expiresAt).toBeGreaterThan(Date.now() + 13 * 60 * 1000);
  });

  it('maps network failures to a connection error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(startAdminLogin(BASE, 'mango', 'pw')).rejects.toThrow('无法连接到 API 站点');
  });
});

describe('completeAdminLogin', () => {
  it('exchanges the flow token and code for a session via /api/user/login/2fa', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ success: true, data: sessionData() }));
    vi.stubGlobal('fetch', fetchMock);

    const session = await completeAdminLogin(BASE, 'flow-9', ' 123456 ', 'mango');

    expect(session.token).toBe('tok-1');
    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE}/api/user/login/2fa`,
      expect.objectContaining({
        body: JSON.stringify({ flow_token: 'flow-9', code: '123456' }),
      })
    );
  });

  it('surfaces backend messages for wrong or expired codes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      jsonResponse({
        success: false,
        message: 'Verification failed. Please try again.',
      })
    ));

    await expect(completeAdminLogin(BASE, 'flow-9', '000000')).rejects.toThrow(
      'Verification failed'
    );
  });

  it('rejects an unexpected second challenge in the 2FA response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: { require_verification: true, flow_token: 'flow-again' },
      })
    ));

    await expect(completeAdminLogin(BASE, 'flow-9', '123456')).rejects.toThrow('两步验证响应异常');
  });
});
