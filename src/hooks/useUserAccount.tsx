/**
 * useUserAccount — App-level user session + checklist state.
 *
 * Owns:
 * - the account session (localStorage, verified once at startup against
 *   /account-api/api/me — only an explicit server rejection clears it,
 *   a flaky network must not log users out);
 * - the per-item opened/wanted checklist. Guests get a local map persisted
 *   to localStorage; logged-in users get server sync with last-writer-wins
 *   merge on login plus per-change pushes. A failed push leaves the local
 *   entry in place — the next successful sync reconciles it.
 *
 * Server responses are always merged into the latest local state, never
 * substituted for it: concurrent pushes can resolve out of order, and a
 * wholesale replace would visibly drop marks made after the request left.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { AccountSession, AccountUser, MyItemStatus, MyItemType } from '../types/account';
import {
  AccountApiError,
  fetchMyItems,
  loginAccount,
  logoutAccount,
  putMyItems,
  registerAccount,
  resetPassword,
  sendVerificationCode,
  verifyAccountSession,
} from '../utils/account-api';
import {
  clearLocalItems,
  diffForUpload,
  itemKey,
  loadLocalItems,
  mergeItems,
  saveLocalItems,
  upsertItem,
  type MyItemsMap,
} from '../utils/my-items';

const USER_SESSION_STORAGE_KEY = 'mangoshare_user_session';

function loadStoredSession(): AccountSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(USER_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AccountSession;
    if (!session || typeof session.token !== 'string' || !session.user || typeof session.user.email !== 'string') {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function saveStoredSession(session: AccountSession | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (session) {
      window.localStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(USER_SESSION_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Failed to persist user session:', e);
  }
}

export interface UserAccountState {
  /** null = guest */
  user: AccountUser | null;
  /** false until the startup session verification has settled */
  sessionReady: boolean;
  items: MyItemsMap;
  counts: { opened: number; wanted: number };
  getItemStatus: (itemType: MyItemType, itemId: string) => MyItemStatus | null;
  /** Mark/unmark an item; guests stay local, users sync to the server. */
  setItemStatus: (itemType: MyItemType, itemId: string, status: MyItemStatus | null) => void;
  /** Authenticates and merges the guest checklist into the server list. */
  login: (email: string, password: string) => Promise<AccountUser>;
  register: (email: string, code: string, password: string, displayName: string) => Promise<AccountUser>;
  resetPassword: (email: string, code: string, password: string) => Promise<AccountUser>;
  logout: () => Promise<void>;
  sendCode: (email: string, purpose: 'register' | 'reset') => Promise<void>;
}

const UserAccountContext = createContext<UserAccountState | null>(null);

export function useUserAccount(): UserAccountState {
  const ctx = useContext(UserAccountContext);
  if (!ctx) {
    throw new Error('useUserAccount must be used within <UserAccountProvider>');
  }
  return ctx;
}

export function accountApiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof AccountApiError) return err.message;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export function UserAccountProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AccountSession | null>(() => loadStoredSession());
  const [sessionReady, setSessionReady] = useState(false);
  const [items, setItems] = useState<MyItemsMap>(() => loadLocalItems());
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // Startup verification: adopt the server checklist when a stored session
  // is still valid; drop the session only when the server rejects it.
  useEffect(() => {
    let cancelled = false;
    const stored = sessionRef.current;
    if (!stored) {
      setSessionReady(true);
      return;
    }
    (async () => {
      const result = await verifyAccountSession(stored.token);
      if (cancelled) return;
      if (result === 'invalid') {
        setSession(null);
        saveStoredSession(null);
        // Mirror logout: an expired session must not leave the account's
        // checklist behind as guest marks for the next browser user.
        setItems(new Map());
        clearLocalItems();
      } else if (result === 'valid') {
        try {
          const serverItems = await fetchMyItems(stored.token);
          if (cancelled) return;
          const merged = mergeItems(itemsRef.current, serverItems);
          setItems(merged);
          // Guest marks made before this visit win over the server and are
          // pushed so every device converges.
          const upload = diffForUpload(merged, serverItems);
          if (upload.length > 0) {
            putMyItems(stored.token, upload)
              .then((authoritative) => {
                if (!cancelled) setItems((prev) => mergeItems(prev, authoritative));
              })
              .catch(() => {
                /* keep merged local state; next sync reconciles */
              });
          }
        } catch {
          /* unreachable — keep local state */
        }
      }
      if (!cancelled) setSessionReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const applySession = useCallback((next: AccountSession | null) => {
    setSession(next);
    saveStoredSession(next);
    sessionRef.current = next;
  }, []);

  const setItemStatus = useCallback(
    (itemType: MyItemType, itemId: string, status: MyItemStatus | null) => {
      // All state work happens in the event handler (run once), never in a
      // setState updater — updaters must stay pure and can be re-invoked.
      const next = upsertItem(itemsRef.current, itemType, itemId, status);
      itemsRef.current = next;
      setItems(next);
      saveLocalItems(next);
      const current = sessionRef.current;
      if (current) {
        const entry = status === null ? null : next.get(itemKey(itemType, itemId));
        // Fire-and-forget single-entry push; on failure the local state
        // already reflects the change and the next full sync reconciles.
        putMyItems(current.token, entry ? [entry] : [{ itemType, itemId, status: '', updatedAt: Date.now() }])
          .then((authoritative) => {
            setItems((prev) => mergeItems(prev, authoritative));
          })
          .catch(() => {
            /* offline — reconciled on next sync */
          });
      }
    },
    []
  );

  /** Shared tail of login/register/reset: adopt session, merge checklist. */
  const adoptAuthSession = useCallback(
    async (next: AccountSession) => {
      applySession(next);
      const local = loadLocalItems();
      try {
        const serverItems = await fetchMyItems(next.token);
        const merged = mergeItems(local, serverItems);
        setItems(merged);
        const upload = diffForUpload(merged, serverItems);
        if (upload.length > 0) {
          const authoritative = await putMyItems(next.token, upload);
          setItems((prev) => mergeItems(prev, authoritative));
        }
        clearLocalItems();
      } catch (err) {
        // Checklist merge is best-effort; never fail the login itself.
        console.warn('checklist merge after login failed:', err);
      }
      return next.user;
    },
    [applySession]
  );

  const login = useCallback(
    async (email: string, password: string) =>
      adoptAuthSession(await loginAccount(email, password)),
    [adoptAuthSession]
  );

  const register = useCallback(
    async (email: string, code: string, password: string, displayName: string) =>
      adoptAuthSession(await registerAccount(email, code, password, displayName)),
    [adoptAuthSession]
  );

  const resetPasswordAndLogin = useCallback(
    async (email: string, code: string, password: string) =>
      adoptAuthSession(await resetPassword(email, code, password)),
    [adoptAuthSession]
  );

  const logout = useCallback(async () => {
    const current = sessionRef.current;
    if (current) {
      await logoutAccount(current.token);
    }
    applySession(null);
    // Server list is authoritative and safe in the DB; guests start from an
    // empty local checklist.
    setItems(new Map());
    clearLocalItems();
  }, [applySession]);

  const sendCode = useCallback(async (email: string, purpose: 'register' | 'reset') => {
    await sendVerificationCode(email, purpose);
  }, []);

  const getItemStatus = useCallback(
    (itemType: MyItemType, itemId: string): MyItemStatus | null =>
      items.get(`${itemType}:${itemId}`)?.status ?? null,
    [items]
  );

  const counts = useMemo(() => {
    let opened = 0;
    let wanted = 0;
    for (const entry of items.values()) {
      if (entry.status === 'opened') opened++;
      else if (entry.status === 'wanted') wanted++;
    }
    return { opened, wanted };
  }, [items]);

  const value = useMemo<UserAccountState>(
    () => ({
      user: session?.user ?? null,
      sessionReady,
      items,
      counts,
      getItemStatus,
      setItemStatus,
      login,
      register,
      resetPassword: resetPasswordAndLogin,
      logout,
      sendCode,
    }),
    [session, sessionReady, items, counts, getItemStatus, setItemStatus, login, register, resetPasswordAndLogin, logout, sendCode]
  );

  return <UserAccountContext.Provider value={value}>{children}</UserAccountContext.Provider>;
}
