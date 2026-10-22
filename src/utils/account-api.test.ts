/**
 * Tests for the account backend client: request error mapping (network vs
 * HTTP vs non-JSON), auth helpers, the tri-state session verification, and
 * the checklist sync endpoints. fetch is stubbed like admin-auth.test.ts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AccountApiError,
  fetchMyItems,
  loginAccount,
  logoutAccount,
  putMyItems,
  registerAccount,
  sendVerificationCode,
  verifyAccountSession,
} from './account-api';

const TOKEN = 'tok-1';
const USER = { id: 1, email: 'a@b.c', displayName: 'A', createdAt: '2026-01-01T00:00:00Z' };

function jsonResponse(payload: unknown, status = 200): Response {
  return {
    ok: status < 400,
    status,
    json: () => Promise.resolve(payload),
  } as unknown as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('auth endpoints', () => {
  it('sendVerificationCode posts email + purpose', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    await sendVerificationCode('a@b.c', 'register');

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/account-api/api/auth/send-code');
    expect(JSON.parse(init.body)).toEqual({ email: 'a@b.c', purpose: 'register' });
  });

  it('registerAccount returns the session', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ token: TOKEN, user: USER })));

    const session = await registerAccount('a@b.c', '123456', 'password123', 'A');
    expect(session).toEqual({ token: TOKEN, user: USER });
  });

  it('loginAccount returns the session', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ token: TOKEN, user: USER }));
    vi.stubGlobal('fetch', fetchMock);

    const session = await loginAccount('a@b.c', 'password123');
    expect(session.token).toBe(TOKEN);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBeUndefined();
  });

  it('logoutAccount swallows network failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network down')));
    await expect(logoutAccount(TOKEN)).resolves.toBeUndefined();
  });
});

describe('error mapping', () => {
  it('propagates the server error message and status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ error: '验证码错误' }, 400)));

    const err = await loginAccount('a@b.c', 'bad').catch((e) => e);
    expect(err).toBeInstanceOf(AccountApiError);
    expect(err.status).toBe(400);
    expect(err.message).toBe('验证码错误');
  });

  it('falls back to a generic message for non-JSON error bodies', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: () => Promise.reject(new SyntaxError('not json')),
    } as unknown as Response));

    const err = await loginAccount('a@b.c', 'x').catch((e) => e);
    expect(err).toBeInstanceOf(AccountApiError);
    expect(err.status).toBe(502);
    expect(err.message).toBe('服务暂时不可用，请稍后重试');
  });

  it('maps network failures to a network error with status 0', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));

    const err = await sendVerificationCode('a@b.c', 'reset').catch((e) => e);
    expect(err).toBeInstanceOf(AccountApiError);
    expect(err.status).toBe(0);
    expect(err.message).toBe('网络异常，请检查网络后重试');
  });
});

describe('verifyAccountSession', () => {
  it.each([401, 403])('reports invalid on %i', async (status) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, status)));
    expect(await verifyAccountSession(TOKEN)).toBe('invalid');
  });

  it('reports unreachable on 5xx and network errors, valid on 200', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, 500)));
    expect(await verifyAccountSession(TOKEN)).toBe('unreachable');

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    expect(await verifyAccountSession(TOKEN)).toBe('unreachable');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, 200)));
    expect(await verifyAccountSession(TOKEN)).toBe('valid');
  });
});

describe('checklist sync', () => {
  it('fetchMyItems returns the items array (empty when absent)', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ items: [
      { itemType: 'u-card', itemId: 'a', status: 'opened', updatedAt: 1 },
    ] }));
    vi.stubGlobal('fetch', fetchMock);

    const items = await fetchMyItems(TOKEN);
    expect(items).toHaveLength(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/account-api/api/my/items');
    expect(init.headers.Authorization).toBe(`Bearer ${TOKEN}`);

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({})));
    expect(await fetchMyItems(TOKEN)).toEqual([]);
  });

  it('putMyItems PUTs the payload with the bearer token', async () => {
    const authoritative = [{ itemType: 'perk', itemId: 'p1', status: 'wanted', updatedAt: 5 }];
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ items: authoritative }));
    vi.stubGlobal('fetch', fetchMock);

    const items = await putMyItems(TOKEN, [
      { itemType: 'perk', itemId: 'p1', status: 'wanted', updatedAt: 5 },
    ]);
    expect(items).toEqual(authoritative);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe('PUT');
    expect(init.headers.Authorization).toBe(`Bearer ${TOKEN}`);
    expect(JSON.parse(init.body).items[0].status).toBe('wanted');
  });
});
