import React, { useState } from 'react';
import { ApiStationStatus } from '../../types/api-sync';
import { DEFAULT_API_STATION_URL } from '../../utils/api-station-sync';
import { UiIcon } from '../awesome-ui/UiIcon';

interface ApiSyncPanelProps {
  endpoint: string;
  onEndpointChange: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  statusData: ApiStationStatus | null;
  modelCount: number;
  onRefresh: () => void;
  onOpenBestConfig: () => void;
  onOpenImport: () => void;
  /** Admin mode unlocks the management controls; visitors see display only. */
  isAdmin: boolean;
  adminDisplayName?: string;
  onRequestLogin: () => void;
  onAdminLogout: () => void;
}

export const ApiSyncPanel: React.FC<ApiSyncPanelProps> = ({
  endpoint,
  onEndpointChange,
  isLoading,
  error,
  statusData,
  modelCount,
  onRefresh,
  onOpenBestConfig,
  onOpenImport,
  isAdmin,
  adminDisplayName,
  onRequestLogin,
  onAdminLogout,
}) => {
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(endpoint);

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUrl.trim()) {
      onEndpointChange(tempUrl.trim());
      setIsEditingUrl(false);
    }
  };

  const handleResetDefault = () => {
    setTempUrl(DEFAULT_API_STATION_URL);
    onEndpointChange(DEFAULT_API_STATION_URL);
    setIsEditingUrl(false);
  };

  const domainDisplay = (() => {
    try {
      const u = new URL(endpoint.startsWith('http') ? endpoint : `https://${endpoint}`);
      return u.hostname;
    } catch {
      return endpoint;
    }
  })();

  return (
    <div className="mb-6 rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-4 shadow-sm transition-all duration-300">
      {/* Main Row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left: Station Status & Live Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Indicator Pulse */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isLoading ? (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              ) : error ? (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              ) : (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  isLoading
                    ? 'bg-amber-500'
                    : error
                    ? 'bg-rose-500'
                    : 'bg-emerald-500'
                }`}
              />
            </span>

            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">
              API 联动中枢
            </span>
          </div>

          {/* System Name & Version */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--paper)] px-2.5 py-1 text-xs font-medium text-[var(--ink)]">
            <UiIcon name="server" size={12} className="text-emerald-600" />
            <span>{statusData?.system_name || 'MangoApi'}</span>
            {statusData?.version ? (
              <span className="rounded bg-black/5 px-1 py-0.5 font-mono text-[10px] text-[var(--ink-soft)]">
                {statusData.version}
              </span>
            ) : null}
          </div>

          {/* Domain Pill */}
          <a
            href={endpoint}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--paper)] px-2.5 py-1 text-xs font-mono text-[var(--ink-soft)] hover:text-[var(--ink)]"
            title="新窗口打开 API 站点"
          >
            <UiIcon name="globe" size={11} />
            <span>{domainDisplay}</span>
            <UiIcon name="external-link" size={10} className="opacity-50" />
          </a>

          {/* Model Count Badge */}
          {modelCount > 0 && (
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50/70 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              <UiIcon name="cpu" size={12} />
              <span>{modelCount} 款模型已同步</span>
            </div>
          )}

          {error && (
            <span className="text-xs text-rose-500" title={error}>
              (同步受阻，可点击重试)
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin ? (
            <>
              {/* Station Import & Update Button (admin only) */}
              <button
                type="button"
                onClick={onOpenImport}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] shadow-sm hover:bg-[var(--paper-soft)] active:scale-95 transition-all"
                title="导入渠道配置、更新 API 模型映射或管理备份"
              >
                <UiIcon name="download" size={12} />
                <span>导入 / 更新中心</span>
              </button>

              {/* Best Config Master Button (admin only) */}
              <button
                type="button"
                onClick={onOpenBestConfig}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3.5 py-1.5 text-xs font-medium text-[var(--paper)] shadow-sm hover:opacity-90 active:scale-95 transition-all"
                title="根据当前 API 站点配置生成最佳公益站分层拓扑与一键导入 JSON"
              >
                <UiIcon name="sparkles" size={12} className="text-amber-300" />
                <span>最佳公益站配置</span>
              </button>
            </>
          ) : (
            /* Visitors get a single discreet login entry */
            <button
              type="button"
              onClick={onRequestLogin}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-xs font-medium text-[var(--ink-soft)] shadow-sm hover:text-[var(--ink)] hover:bg-[var(--paper)] active:scale-95 transition-all"
              title="管理员登录后可进行站点管理与配置更新"
            >
              <UiIcon name="shield" size={12} />
              <span>管理员登录</span>
            </button>
          )}

          {/* Refresh Button (public, read-only) */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className={`inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper)] p-1.5 text-[var(--ink-soft)] hover:bg-[var(--paper-soft)] hover:text-[var(--ink)] active:scale-95 transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="刷新拉取最新配置"
            aria-label="刷新配置"
          >
            <UiIcon
              name="refresh"
              size={13}
              className={isLoading ? 'animate-spin' : ''}
            />
          </button>

          {/* Custom Station Toggle (admin only) */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setTempUrl(endpoint);
                setIsEditingUrl(!isEditingUrl);
              }}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs text-[var(--ink-soft)] transition-all ${
                isEditingUrl
                  ? 'border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)]'
                  : 'border-[var(--line)] bg-[var(--paper)] hover:text-[var(--ink)]'
              }`}
              title="更换或关联其他 API 站点"
            >
              <UiIcon name="tool" size={12} />
              <span>{isEditingUrl ? '收起' : '切换站点'}</span>
            </button>
          )}

          {/* Admin identity & logout */}
          {isAdmin && (
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50/70 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              <UiIcon name="shield" size={12} />
              <span>{adminDisplayName || '管理员'}</span>
              <button
                type="button"
                onClick={onAdminLogout}
                className="ml-0.5 rounded-full p-0.5 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                title="退出管理员模式"
                aria-label="退出管理员模式"
              >
                <UiIcon name="x" size={11} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Edit Station Form */}
      {isEditingUrl && isAdmin && (
        <form
          onSubmit={handleApplyUrl}
          className="mt-3.5 flex flex-col gap-2 rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3 text-xs md:flex-row md:items-center"
        >
          <label htmlFor="custom-api-endpoint" className="font-medium text-[var(--ink-soft)] whitespace-nowrap">
            API 站点 Base URL:
          </label>
          <input
            id="custom-api-endpoint"
            type="url"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="https://api.mangoqwq.com"
            className="flex-1 rounded-lg border border-[var(--line)] bg-transparent px-2.5 py-1.5 font-mono text-[var(--ink)] outline-none focus:border-[var(--ink)]"
            required
          />
          <div className="flex items-center gap-1.5 self-end md:self-auto">
            <button
              type="submit"
              className="rounded-lg bg-[var(--ink)] px-3 py-1.5 font-medium text-[var(--paper)] hover:opacity-90"
            >
              连接此站
            </button>
            <button
              type="button"
              onClick={handleResetDefault}
              className="rounded-lg border border-[var(--line)] px-2.5 py-1.5 text-[var(--ink-soft)] hover:bg-[var(--paper-soft)]"
            >
              重置为默认
            </button>
          </div>
        </form>
      )}

      {/* Quick Tactical Insights Badges (Pure Minimalist, Zero Emojis) */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--line)]/60 pt-2.5 text-[11px] text-[var(--ink-soft)]">
        <span className="inline-flex items-center gap-1 font-medium text-[var(--ink)]">
          <UiIcon name="layers" size={12} />
          <span>智能拓扑就绪:</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded bg-[var(--paper)] px-2 py-0.5 border border-[var(--line)]/50">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span>旗舰双活: Claude Sonnet 5 / DeepSeek-V4 Pro / GPT-5.5</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded bg-[var(--paper)] px-2 py-0.5 border border-[var(--line)]/50">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>向量专精: EMRank 100万Token/天</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded bg-[var(--paper)] px-2 py-0.5 border border-[var(--line)]/50">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span>开源保底: OpenRouter 15+款全球开放模型</span>
        </span>
      </div>
    </div>
  );
};
