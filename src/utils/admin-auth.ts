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
    require_verification?: boolean;
    flow_token?: string;
    methods?: { method: string; available: boolean }[];
  };
}

/**
 * First login step result: either a full admin session (no 2FA on the
 * account) or a two-factor challenge holding the backend flow_token that
 * completeAdminLogin consumes.
 */
export type AdminLoginAttempt =
  | { kind: 'session'; session: AdminSession }
  | { kind: '2fa'; flowToken: string };

interface RawLoginArgs {
  base: string;
  path: string;
  payload: Record<string, string>;
  fallbackUsername: string;
  timeoutMs: number;
}

async function postLogin(
  base: string,
  path: string,
  payload: Record<string, string>,
  timeoutMs: number
): Promise<LoginResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch {
    throw new Error('无法连接到 API 站点，请检查网络与站点地址');
  } finally {
    clearTimeout(timer);
  }
  try {
    return (await res.json()) as LoginResponse;
  } catch {
    throw new Error('登录响应解析失败，请稍后重试');
  }
}

function parseLoginData(
  base: string,
  body: LoginResponse,
  fallbackUsername: string
): AdminLoginAttempt {
  if (!body.success || !body.data) {
    throw new Error(body.message || '登录失败，请检查用户名与密码');
  }
  const data = body.data;
  // Two-factor-enabled accounts answer with a challenge instead of a token.
  if (data.require_verification && data.flow_token) {
    const twoFAOffered = (data.methods || []).some(
      (m) => m.method === '2fa' && m.available !== false
    );
    if (twoFAOffered || (data.methods || []).length === 0) {
      return { kind: '2fa', flowToken: data.flow_token };
    }
    throw new Error('该账号需要额外验证，但暂无可用验证方式');
  }
  const { access_token, access_expires_at, user } = data;
  if (!access_token || !user || typeof user.role !== 'number') {
    throw new Error('登录响应缺少必要字段，请稍后重试');
  }
  if (!isAdminRole(user.role)) {
    throw new Error('该账号不是管理员，无法进入管理模式');
  }
  return {
    kind: 'session',
    session: {
      baseUrl: base,
      username: user.username || fallbackUsername,
      displayName: user.display_name || user.username || fallbackUsername,
      role: user.role,
      token: access_token,
      // Backend sends unix seconds; fall back to a conservative short window
      // if the field is missing so the session never outlives its token.
      expiresAt: access_expires_at ? access_expires_at * 1000 : Date.now() + 14 * 60 * 1000,
    },
  };
}

/**
 * Logs into the API station with username + password. Accounts without 2FA
 * resolve straight to a session; accounts with 2FA return a challenge that
 * must be finished via completeAdminLogin.
 */
export async function startAdminLogin(
  baseUrl: string,
  username: string,
  password: string,
  timeoutMs = 10000
): Promise<AdminLoginAttempt> {
  const base = normalizeAdminBase(baseUrl);
  const body = await postLogin(base, '/api/user/login', { username, password }, timeoutMs);
  return parseLoginData(base, body, username);
}

/**
 * Second login step for 2FA accounts: exchanges the flow_token from
 * startAdminLogin plus a TOTP/backup code for a full admin session.
 */
export async function completeAdminLogin(
  baseUrl: string,
  flowToken: string,
  code: string,
  fallbackUsername = '',
  timeoutMs = 10000
): Promise<AdminSession> {
  const base = normalizeAdminBase(baseUrl);
  const body = await postLogin(
    base,
    '/api/user/login/2fa',
    { flow_token: flowToken, code: code.trim() },
    timeoutMs
  );
  const attempt = parseLoginData(base, body, fallbackUsername);
  if (attempt.kind !== 'session') {
    throw new Error('验证响应缺少必要字段，请稍后重试');
  }
  return attempt.session;
}

/**
 * Re-validates a restored session against the backend (GET /api/user/self).
 * Tri-state so callers never conflate "bad token" with "backend unreachable":
 * - 'valid'      token works and the role is still admin;
 * - 'invalid'    the server actively rejected the token (401/403/success=false
 *                or role downgrade) → caller must drop the session;
 * - 'unreachable' network error, 5xx or malformed response → keep the session
 *                and retry later; a flaky network must not log admins out.
 */
export type AdminSessionVerifyResult = 'valid' | 'invalid' | 'unreachable';

export async function verifyAdminSession(session: AdminSession): Promise<AdminSessionVerifyResult> {
  try {
    const res = await fetch(`${session.baseUrl}/api/user/self`, {
      headers: { Authorization: `Bearer ${session.token}` },
    });
    if (res.status === 401 || res.status === 403) return 'invalid';
    let body: { success?: boolean; data?: { role?: number } } | null = null;
    try {
      body = await res.json();
    } catch {
      return 'unreachable';
    }
    if (body && body.success === false) return 'invalid';
    if (res.ok && body?.success) {
      return isAdminRole(Number(body?.data?.role)) ? 'valid' : 'invalid';
    }
    return 'unreachable';
  } catch {
    return 'unreachable';
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
