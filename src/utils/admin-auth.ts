/**
 * Admin mode authentication against the MangoApi backend.
 *
 * mangoshare is a static site — it cannot issue credentials of its own, so
 * admin mode is proven by a real login against the API station
 * (POST /api/user/login). The returned dashboard access token (15 min TTL)
 * plus the server-authoritative role are kept in sessionStorage; any future
 * backend operation must present a live token, so gating here is presentation
 * only and never grants server-side power by itself.
 */
const ADMIN_ROLE_MIN = 10; // common.RoleAdminUser in MangoApi
export const ADMIN_SESSION_STORAGE_KEY = 'mangoshare-admin-session';

export interface AdminSession {
  /** Backend base URL this session authenticated against. */
  baseUrl: string;
  username: string;
  displayName: string;
  role: number;
  token: string;
  /** Unix ms when the access token expires (login TTL is 15 minutes). */
  expiresAt: number;
}

export function normalizeAdminBase(baseUrl: string): string {
  return (baseUrl || '').trim().replace(/\/+$/, '');
}

export function isAdminRole(role: number): boolean {
  return Number.isFinite(role) && role >= ADMIN_ROLE_MIN;
}

export function isSessionActive(session: AdminSession | null): boolean {
  return !!session && Date.now() < session.expiresAt;
}

export function loadAdminSession(baseUrl: string): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (
      !session ||
      typeof session.token !== 'string' ||
      typeof session.expiresAt !== 'number' ||
      typeof session.role !== 'number' ||
      normalizeAdminBase(session.baseUrl) !== normalizeAdminBase(baseUrl)
    ) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveAdminSession(session: AdminSession): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.warn('Failed to persist admin session:', e);
  }
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear admin session:', e);
  }
}

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    access_token?: string;
    access_expires_at?: number;
    user?: { username?: string; display_name?: string; role?: number };
  };
}

/**
 * Logs into the API station and returns an admin session.
 * Throws with a user-facing message when credentials are wrong, the account
 * is not an admin, or the backend is unreachable.
 */
export async function loginAdmin(
  baseUrl: string,
  username: string,
  password: string,
  timeoutMs = 10000
): Promise<AdminSession> {
  const base = normalizeAdminBase(baseUrl);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(`${base}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      signal: controller.signal,
    });
  } catch {
    throw new Error('无法连接到 API 站点，请检查网络与站点地址');
  } finally {
    clearTimeout(timer);
  }

  let body: LoginResponse;
  try {
    body = await res.json();
  } catch {
    throw new Error('登录响应解析失败，请稍后重试');
  }
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || `登录失败（HTTP ${res.status}）`);
  }
  const { access_token, access_expires_at, user } = body.data;
  if (!access_token || !user || typeof user.role !== 'number') {
    throw new Error('登录响应缺少必要字段');
  }
  if (!isAdminRole(user.role)) {
    throw new Error('该账号不是管理员，无法进入管理模式');
  }
  return {
    baseUrl: base,
    username: user.username || username,
    displayName: user.display_name || user.username || username,
    role: user.role,
    token: access_token,
    // Backend sends unix seconds; fall back to a conservative short window
    // if the field is missing so the session never outlives its token.
    expiresAt: access_expires_at ? access_expires_at * 1000 : Date.now() + 14 * 60 * 1000,
  };
}

/**
 * Re-validates a restored session against the backend (GET /api/user/self).
 * Returns fresh user data, or null when the token is expired/revoked or the
 * backend is unreachable — callers treat null as "downgrade to visitor mode".
 */
export async function verifyAdminSession(session: AdminSession): Promise<boolean> {
  try {
    const res = await fetch(`${session.baseUrl}/api/user/self`, {
      headers: { Authorization: `Bearer ${session.token}` },
    });
    if (!res.ok) return false;
    const body = await res.json();
    return !!body?.success && isAdminRole(body?.data?.role);
  } catch {
    return false;
  }
}

/** Best-effort server-side logout; ignores every failure. */
export async function logoutAdmin(session: AdminSession): Promise<void> {
  try {
    await fetch(`${session.baseUrl}/api/user/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.token}` },
    });
  } catch {
    /* session will be dropped locally regardless */
  }
}
