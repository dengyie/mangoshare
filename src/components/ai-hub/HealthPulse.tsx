import React from 'react';
import { AiHealthState } from '../../types/ai-station';

interface HealthPulseProps {
  state: AiHealthState;
  latencyMs?: number;
}

export const HealthPulse: React.FC<HealthPulseProps> = ({ state, latencyMs }) => {
  const isOnline = state === 'online';
  const isDegraded = state === 'degraded';

  return (
    <div className="flex items-center gap-1.5 text-[11px] font-medium">
      <span className="relative flex h-2 w-2">
        {isOnline && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOnline
              ? 'bg-emerald-500'
              : isDegraded
              ? 'bg-amber-500'
              : 'bg-rose-500'
          }`}
        />
      </span>
      <span
        className={
          isOnline
            ? 'text-emerald-500'
            : isDegraded
            ? 'text-amber-500'
            : 'text-rose-500'
        }
      >
        {isOnline
          ? latencyMs !== undefined
            ? `在线 (${latencyMs}ms)`
            : '在线正常'
          : isDegraded
          ? '偶尔延迟'
          : '维护中'}
      </span>
    </div>
  );
};
