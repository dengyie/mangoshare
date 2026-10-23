/**
 * Tests for the "my items" catalog index: static entries resolve without
 * any custom stations, custom AI stations participate, and the localStorage
 * snapshot cache rebuilds when stations are added mid-session (the
 * undefined-sentinel regression — a null snapshotKey used to compare equal
 * to an absent localStorage value and the catalog stayed empty forever).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AiStationItem } from '../types/ai-station';
import { findCatalogEntry, deepLinkFor, categoryLabelOf } from './catalog-index';
import { U_CARDS } from '../data/u-cards';
import { SIM_CARDS } from '../data/sim-cards';

const CUSTOM_KEY = 'mangoshare_custom_ai_stations_v2';

function fakeStorage(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    getItem: (k: string) => (store.has(k) ? (store.get(k) as string) : null),
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  };
}

function customStation(id: string): AiStationItem {
  return {
    id,
    name: `站点 ${id}`,
    category: 'NewAPI',
    portalUrl: `https://${id}.example.com`,
    apiBaseUrl: `https://${id}.example.com/v1`,
    models: ['gpt-4o'],
    authType: 'Password',
    quotaDesc: '免费',
    healthState: 'online',
    turnstile: false,
    tags: [],
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('static catalog (no custom stations, localStorage key absent)', () => {
  it('resolves static entries — snapshot sentinel must not swallow the build', () => {
    vi.stubGlobal('window', { localStorage: fakeStorage() });
    const uCard = U_CARDS[0];
    expect(findCatalogEntry('u-card', uCard.slug)).toMatchObject({
      itemType: 'u-card',
      anchor: uCard.slug,
      categoryLabel: '加密货币卡',
    });
    const sim = SIM_CARDS[0];
    expect(findCatalogEntry('sim-card', sim.id)).toMatchObject({
      itemType: 'sim-card',
      anchor: sim.id,
      categoryLabel: '电话卡 / eSIM',
    });
  });

  it('builds deep links and category labels', () => {
    vi.stubGlobal('window', { localStorage: fakeStorage() });
    const entry = findCatalogEntry('sim-card', SIM_CARDS[0].id);
    expect(entry).not.toBeNull();
    expect(deepLinkFor(entry!)).toBe(`#/sim-cards?card=${encodeURIComponent(SIM_CARDS[0].id)}`);
    expect(categoryLabelOf('perk')).toBe('羊毛福利');
    expect(categoryLabelOf('ai-station')).toBe('AI 公益站');
  });
});

describe('custom AI stations', () => {
  it('resolves managed custom stations from localStorage', () => {
    vi.stubGlobal('window', {
      localStorage: fakeStorage({ [CUSTOM_KEY]: JSON.stringify([customStation('my-station')]) }),
    });
    expect(findCatalogEntry('ai-station', 'my-station')).toMatchObject({
      itemType: 'ai-station',
      anchor: 'my-station',
      tab: 'ai-hub',
      name: '站点 my-station',
    });
  });

  it('excludes upstream-* dynamic stations', () => {
    vi.stubGlobal('window', {
      localStorage: fakeStorage({ [CUSTOM_KEY]: JSON.stringify([customStation('upstream-dyn')]) }),
    });
    expect(findCatalogEntry('ai-station', 'upstream-dyn')).toBeNull();
  });

  it('rebuilds the snapshot when a station is added mid-session (no reload)', () => {
    const storage = fakeStorage();
    vi.stubGlobal('window', { localStorage: storage });

    expect(findCatalogEntry('ai-station', 'late-station')).toBeNull();

    storage.setItem(CUSTOM_KEY, JSON.stringify([customStation('late-station')]));
    expect(findCatalogEntry('ai-station', 'late-station')).toMatchObject({ anchor: 'late-station' });

    storage.removeItem(CUSTOM_KEY);
    expect(findCatalogEntry('ai-station', 'late-station')).toBeNull();
  });
});
