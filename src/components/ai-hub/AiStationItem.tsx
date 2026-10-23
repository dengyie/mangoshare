import React, { useState, useEffect } from 'react';
import { AiStationItem as AiStationItemType } from '../../types/ai-station';
import { getAiStationArt, getStationHost, AiStationCardHealth } from '../../utils/card-art';
import { ItemStatusBadge } from '../account/ItemMarkControl';

interface AiStationItemProps {
  station: AiStationItemType;
  onSelect: (station: AiStationItemType) => void;
}

const AiStationItemInner: React.FC<AiStationItemProps> = ({ station, onSelect }) => {
  // Cards carrying a backend-measured latency (fed by GET /api/public_stations)
  // skip the client probe entirely: the backend already tests the upstream, and
  // fanning out a no-cors fetch per card on every page load is wasted traffic.
  const backendLatency =
    typeof station.responseTime === 'number' && station.responseTime > 0
      ? station.responseTime
      : null;
  const [latency, setLatency] = useState<number | null>(null);
  const [probeStatus, setProbeStatus] = useState<'probing' | 'online' | 'degraded'>('probing');

  useEffect(() => {
    if (backendLatency !== null) return;
    let active = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const probeNode = async () => {
      const startTime = performance.now();
      try {
        await fetch(station.portalUrl, {
          method: 'GET',
          mode: 'no-cors',
          cache: 'no-store',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!active) return;
        const elapsed = Math.round(performance.now() - startTime);
        setLatency(elapsed);
        setProbeStatus(elapsed < 450 ? 'online' : 'degraded');
      } catch {
        if (!active) return;
        // Probe failed or timed out: report honestly instead of fabricating
        // a latency value — an unreachable site must not display as online.
        setLatency(null);
        setProbeStatus('degraded');
      }
    };

    probeNode();
    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [station.portalUrl, backendLatency]);

  const handlePointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  // The card face and the name row share one status derivation so the SVG
  // badge can never disagree with the textual probe result beneath it.
  // no-cors probes resolve even for unreachable hosts (opaque responses still
  // "succeed"), so a resolved-but-slow probe is NOT proof of health: only an
  // actual latency figure earns ONLINE, and once the probe settles without
  // one the badge must flip to UNREACHABLE instead of staying green forever.
  const cardHealth: AiStationCardHealth =
    backendLatency !== null
      ? 'online'
      : probeStatus === 'probing'
      ? 'unknown'
      : latency !== null && latency < 450
      ? 'online'
      : 'degraded';

  const cardArt = getAiStationArt(station.id, station.name, station.category, station.models, station.portalUrl, cardHealth);

  const hostLabel = getStationHost(station);

  const statusText = (() => {
    if (backendLatency !== null) {
      return `${backendLatency}ms`;
    }
    if (probeStatus === 'probing' && latency === null) {
      return '测速中…';
    }
    if (probeStatus === 'degraded') {
      return '测速超时';
    }
    return `${latency}ms`;
  })();

  const statusColor = (() => {
    if (backendLatency !== null) {
      if (backendLatency < 200) return '#10b981';
      if (backendLatency < 500) return '#f59e0b';
      return '#f97316';
    }
    if (probeStatus === 'probing' && latency === null) return '#10b981';
    if (probeStatus === 'degraded') return '#f97316';
    const val = latency ?? 9999;
    if (val < 200) return '#10b981';
    if (val < 500) return '#f59e0b';
    return '#f97316';
  })();

  return (
    <div
      className="cell"
      onClick={() => onSelect(station)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(station);
        }
      }}
    >
      <span className="cell-img" onPointerMove={handlePointerMove}>
        <img src={cardArt} alt={`${station.name} 卡面`} loading="lazy" />
        {!station.id.startsWith('upstream-') && (
          <ItemStatusBadge itemType="ai-station" itemId={station.id} />
        )}
      </span>
      <span className="cell-meta">
        <div className="cell-name">
          <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.9rem' }}>{hostLabel}</span>
        </div>
        <div className="cell-sub" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColor, display: 'inline-block' }} />
            <span>{statusText}</span>
          </span>
          <span>·</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {station.quotaDesc.split('(')[0].trim()}
          </span>
        </div>
      </span>
    </div>
  );
};

// Memo boundary: the grid renders ~170 cards, and every probe resolution or
// search keystroke would otherwise re-render (and re-generate the base64 SVG
// card art of) every surviving card. Props are the station object (stable
// reference from the grid's useMemo) plus the select callback.
export const AiStationItem = React.memo(AiStationItemInner);
