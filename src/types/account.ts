/**
 * User account types for the standalone mangoshare account backend
 * (served same-origin under /account-api/).
 */

/** Catalog sections that support the opened/wanted checklist. */
export type MyItemType = 'u-card' | 'sim-card' | 'credit-card' | 'perk' | 'ai-station';

/**
 * Per-item marking state. 'opened' = 已开通, 'wanted' = 待开通.
 */
export type MyItemStatus = 'opened' | 'wanted';

export interface MyItemEntry {
  itemType: MyItemType;
  itemId: string;
  status: MyItemStatus;
  /** Unix ms, last-writer-wins key for guest/server merges. */
  updatedAt: number;
}

/** UI role derived by the backend from the configured admin email. */
export type AccountRole = 'user' | 'admin';

export interface AccountUser {
  id: number;
  email: string;
  displayName: string;
  createdAt: number;
  role: AccountRole;
}

export interface AccountSession {
  token: string;
  user: AccountUser;
}
