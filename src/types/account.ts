/**
 * User account types for the standalone mangoshare account backend
 * (served same-origin under /account-api/).
 */

/** Catalog sections that support the opened/wanted checklist. */
export type MyItemType = 'u-card' | 'sim-card' | 'credit-card' | 'perk' | 'ai-station';

export const MY_ITEM_TYPES: MyItemType[] = [
  'u-card',
  'sim-card',
  'credit-card',
  'perk',
  'ai-station',
];

export function isMyItemType(v: unknown): v is MyItemType {
  return typeof v === 'string' && (MY_ITEM_TYPES as string[]).includes(v);
}

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
