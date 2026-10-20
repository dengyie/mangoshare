import React, { useState, useEffect } from 'react';
import { AiStationItem as AiStationItemType } from '../../types/ai-station';
import { getAiStationArt } from '../../utils/card-art';

interface AiStationItemProps {
  station: AiStationItemType;
  onSelect: (station: AiStationItemType) => void;
}

export const AiStationItem: React.FC<AiStationItemProps> = ({ station, onSelect }) => {
  const [latency, setLatency] = useState<number | null>(null);
  const [probeStatus, setProbeStatus] = useState<'probing' | 'online' | 'degraded'>('probing');

  useEffect(() => {
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
  }, [station.portalUrl, station.name]);

  const handlePointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const cardArt = getAiStationArt(station.id, station.name, station.category, station.models);

  const statusText = (() => {
    if (probeStatus === 'probing' && latency === null) {
      return '测速中…';
    }
    if (probeStatus === 'degraded') {
      return '测速超时';
    }
    const val = latency ?? 42;
    return `${val}ms`;
  })();

  const statusColor = (() => {
    if (probeStatus === 'probing' && latency === null) return '#10b981';
    if (probeStatus === 'degraded') return '#f97316';
    const val = latency ?? 42;
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
      </span>
      <span className="cell-meta">
        <div className="cell-name">
          <span>{station.name}</span>
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
