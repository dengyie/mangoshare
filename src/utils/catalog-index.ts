/**
 * Catalog anchors for the "my items" checklist: turns stored
 * (itemType, itemId) pairs back into displayable catalog entries and
 * deep-link hashes. Static catalog plus the user's custom AI stations.
 */
import { U_CARDS } from '../data/u-cards';
import { SIM_CARDS } from '../data/sim-cards';
import { CREDIT_CARDS } from '../data/credit-cards';
import { PERKS } from '../data/perks';
import { AI_STATIONS } from '../data/ai-stations';
import type { AiStationItem } from '../types/ai-station';
import type { CreditCardItem } from '../types/credit-card';
import type { PerkItem } from '../types/perk';
import type { SimCardItem } from '../types/sim-card';
import type { MyItemType } from '../types/account';
import type { UCardItem } from '../types/u-card';

export interface CatalogEntry {
  itemType: MyItemType;
  /** Deep-link anchor: slug/id as used in #/<tab>?card=<anchor> */
  anchor: string;
  /** Tab segment for the deep link. */
  tab: string;
  /** Display name. */
  name: string;
  /** Short category label for grouping UI. */
  categoryLabel: string;
}

function uCardEntry(c: UCardItem): CatalogEntry {
  return { itemType: 'u-card', anchor: c.slug, tab: 'u-cards', name: c.detail?.name || c.brand, categoryLabel: '加密货币卡' };
}

function simEntry(c: SimCardItem): CatalogEntry {
  return { itemType: 'sim-card', anchor: c.id, tab: 'sim-cards', name: c.name, categoryLabel: '电话卡 / eSIM' };
}

function creditEntry(c: CreditCardItem): CatalogEntry {
  return { itemType: 'credit-card', anchor: c.id, tab: 'credit-cards', name: c.name, categoryLabel: '全球信用卡' };
}

function perkEntry(p: PerkItem): CatalogEntry {
  return { itemType: 'perk', anchor: p.id, tab: 'perks', name: p.name, categoryLabel: '羊毛福利' };
}

function stationEntry(s: AiStationItem): CatalogEntry {
  return { itemType: 'ai-station', anchor: s.id, tab: 'ai-hub', name: s.name, categoryLabel: 'AI 公益站' };
}

// 预设站 + localStorage 自定义站参与勾选；upstream-* 动态卡 id 不稳定，
// 不进入目录（自然无法被标记）。自定义站在会话中途可能增删，因此目录按
// localStorage 快照缓存：原始串变了才重建，避免每次查询重复解析。
const STATIC_CATALOG: CatalogEntry[] = [
  ...U_CARDS.map(uCardEntry),
  ...SIM_CARDS.map(simEntry),
  ...CREDIT_CARDS.map(creditEntry),
  ...PERKS.map(perkEntry),
  ...AI_STATIONS.map(stationEntry),
];

function loadManagedStationEntries(): CatalogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem('mangoshare_custom_ai_stations_v2');
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AiStationItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s) => s && typeof s.id === 'string' && !s.id.startsWith('upstream-'))
      .map(stationEntry);
  } catch {
    return [];
  }
}

let snapshotKey: string | null = null;
let snapshotCatalog: CatalogEntry[] = [];
let snapshotIndex: Map<string, CatalogEntry> = new Map();

function getCatalog(): { entries: CatalogEntry[]; index: Map<string, CatalogEntry> } {
  const raw =
    typeof window === 'undefined' ? null : window.localStorage.getItem('mangoshare_custom_ai_stations_v2');
  if (snapshotKey !== raw) {
    snapshotKey = raw;
    snapshotCatalog = [...STATIC_CATALOG, ...loadManagedStationEntries()];
    snapshotIndex = new Map(
      snapshotCatalog.map((entry) => [`${entry.itemType}:${entry.anchor}`, entry])
    );
  }
  return { entries: snapshotCatalog, index: snapshotIndex };
}

export function findCatalogEntry(itemType: MyItemType, itemId: string): CatalogEntry | null {
  return getCatalog().index.get(`${itemType}:${itemId}`) ?? null;
}

export function deepLinkFor(entry: CatalogEntry): string {
  return `#/${entry.tab}?card=${encodeURIComponent(entry.anchor)}`;
}

export const CATEGORY_ORDER: MyItemType[] = ['u-card', 'sim-card', 'credit-card', 'perk', 'ai-station'];

export function categoryLabelOf(itemType: MyItemType): string {
  const entry = getCatalog().entries.find((e) => e.itemType === itemType);
  return entry?.categoryLabel ?? itemType;
}
