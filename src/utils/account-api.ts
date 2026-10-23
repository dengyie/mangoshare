/**
 * Client for the mangoshare account backend.
 *
 * The backend is a same-origin reverse proxy (nginx: /account-api/ →
 * 127.0.0.1:8090), so no CORS and no base URL configuration are needed;
 * in local dev the vite dev server proxies the same path. Sessions are
 * opaque bearer tokens held in localStorage (30-day sliding TTL server
 * side, logout revokes).
 */
import type { AccountSession, AccountUser, MyItemEntry, MyItemStatus, MyItemType } from '../types/account';

export const ACCOUNT_API_BASE = '/account-api';

const TIMEOUT_MS = 10000;

/** fetch with a hard timeout; callers own the error mapping. */
async function fetchWithTimeout(path: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(`${ACCOUNT_API_BASE}${path}`, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export class AccountApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  method: string,
  path: string,
  body: unknown,
  token: string | null
): Promise<T> {
  let res: Response;
  try {
    res = await fetchWithTimeout(path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === null ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new AccountApiError(0, '网络异常，请检查网络后重试');
  }
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON body — fall through to the status check */
  }
  if (!res.ok) {
    const message =
      (data && typeof data.error === 'string' && data.error) || '服务暂时不可用，请稍后重试';
    throw new AccountApiError(res.status, message);
  }
  return data as T;
}

// ---- auth ---------------------------------------------------------------

export async function sendVerificationCode(email: string, purpose: 'register' | 'reset'): Promise<void> {
  await request<{ ok: boolean }>('POST', '/api/auth/send-code', { email, purpose }, null);
}

export async function registerAccount(
  email: string,
  code: string,
  password: string,
  displayName: string
): Promise<AccountSession> {
  const data = await request<{ token: string; user: AccountUser }>(
    'POST',
    '/api/auth/register',
    { email, code, password, displayName },
    null
  );
  return { token: data.token, user: data.user };
}

export async function loginAccount(email: string, password: string): Promise<AccountSession> {
  const data = await request<{ token: string; user: AccountUser }>(
    'POST',
    '/api/auth/login',
    { email, password },
    null
  );
  return { token: data.token, user: data.user };
}

export async function resetPassword(
  email: string,
  code: string,
  password: string
): Promise<AccountSession> {
  const data = await request<{ token: string; user: AccountUser }>(
    'POST',
    '/api/auth/reset-password',
    { email, code, password },
    null
  );
  return { token: data.token, user: data.user };
}

/** Best-effort server-side logout; network failures are ignored. */
export async function logoutAccount(token: string): Promise<void> {
  try {
    await request('POST', '/api/auth/logout', null, token);
  } catch {
    /* the local session is dropped regardless */
  }
}

export type AccountVerifyResult = 'valid' | 'invalid' | 'unreachable';

/**
 * Re-validates a restored session (GET /api/me). Tri-state, mirroring
 * admin-auth: only an explicit 401 means "logged out"; flaky networks keep
 * the local session.
 */
export async function verifyAccountSession(token: string): Promise<AccountVerifyResult> {
  let res: Response;
  try {
    res = await fetchWithTimeout('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return 'unreachable';
  }
  if (res.status === 401 || res.status === 403) return 'invalid';
  if (!res.ok) return 'unreachable';
  return 'valid';
}

// ---- items --------------------------------------------------------------

export async function fetchMyItems(token: string): Promise<MyItemEntry[]> {
  const data = await request<{ items: MyItemEntry[] }>('GET', '/api/my/items', null, token);
  return Array.isArray(data.items) ? data.items : [];
}

/**
 * Bulk upsert (delete via status ""). Returns the authoritative list
 * after the merge, so callers can replace local state without an extra GET.
 */
export async function putMyItems(
  token: string,
  items: Array<{ itemType: MyItemType; itemId: string; status: MyItemStatus | ''; updatedAt: number }>
): Promise<MyItemEntry[]> {
  const data = await request<{ items: MyItemEntry[] }>('PUT', '/api/my/items', { items }, token);
  return Array.isArray(data.items) ? data.items : [];
}
