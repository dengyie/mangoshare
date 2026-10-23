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

export interface AccountUser {
  id: number;
  email: string;
  displayName: string;
  createdAt: number;
}

export interface AccountSession {
  token: string;
  user: AccountUser;
}
