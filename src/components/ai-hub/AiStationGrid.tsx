import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { AiStationItem as AiStationItemType } from '../../types/ai-station';
import { ApiStationStatus, PublicStationChannel } from '../../types/api-sync';
import {
  DEFAULT_API_STATION_URL,
  STORAGE_KEY_API_URL,
  STORAGE_KEY_CUSTOM_STATIONS,
  fetchApiStationConfig,
  fetchPublicStationChannels,
  analyzeTopology,
  loadManagedStations,
  mergePublicStations,
} from '../../utils/api-station-sync';
import {
  AdminSession,
  clearAdminSession,
  isSessionActive,
  loadAdminSession,
  logoutAdmin,
  normalizeAdminBase,
  saveAdminSession,
  verifyAdminSession,
} from '../../utils/admin-auth';
import { AiStationItem } from './AiStationItem';
import { AiStationModal } from './AiStationModal';
import { AdminLoginModal } from './AdminLoginModal';
import { ApiSyncPanel } from './ApiSyncPanel';
import { BestConfigModal } from './BestConfigModal';
import { StationImportModal } from './StationImportModal';
import { UiIcon } from '../awesome-ui/UiIcon';

interface AiStationGridProps {
  stations: AiStationItemType[];
  searchQuery: string;
  onSearchChange?: (q: string) => void;
  onSelectStation?: (station: AiStationItemType) => void;
}

export const AiStationGrid: React.FC<AiStationGridProps> = ({
  stations: initialStations,
  searchQuery,
  onSearchChange,
  onSelectStation,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [selectedStation, setSelectedStation] = useState<AiStationItemType | null>(null);
  const [isBestConfigOpen, setIsBestConfigOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Managed Station List (supporting local modifications & imports)
  const [managedStations, setManagedStations] = useState<AiStationItemType[]>(() =>
    loadManagedStations(initialStations)
  );

  // Live channel topology published by the API station (GET /api/public_stations).
  // null = backend predates the endpoint → preset/local-only rendering.
  const [liveChannels, setLiveChannels] = useState<PublicStationChannel[] | null>(null);

  // Merged grid data: presets upgraded with real backend state + dynamic
  // upstream cards appended. Recomputed only when either side changes.
  const merged = useMemo(
    () => mergePublicStations(managedStations, liveChannels),
    [managedStations, liveChannels]
  );
  const activeStations = merged.stations;

  // Linkage state with our API station
  const [endpoint, setEndpoint] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_API_URL) || DEFAULT_API_STATION_URL;
    }
    return DEFAULT_API_STATION_URL;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<ApiStationStatus | null>(null);
  const [models, setModels] = useState<string[]>([]);

  // Admin mode: a real login against the API station unlocks management
  // controls. Visitors only see the display surface. Session lives in
  // sessionStorage and expires with the backend access token (15 min TTL);
  // restored sessions are re-validated against /api/user/self once.
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // Ticks every 30s so an expired token flips the UI back to visitor mode
  // without waiting for the next state change.
  const [nowTick, setNowTick] = useState(() => Date.now());

  const isAdmin =
    !!adminSession &&
    isAdminVerified &&
    normalizeAdminBase(adminSession.baseUrl) === normalizeAdminBase(endpoint) &&
    isSessionActive(adminSession) &&
    nowTick > 0;

  useEffect(() => {
    const session = loadAdminSession(endpoint);
    if (!session || !isSessionActive(session)) {
      if (session) clearAdminSession();
      setAdminSession(null);
      setIsAdminVerified(false);
      return;
    }
    setAdminSession(session);
    let cancelled = false;
    verifyAdminSession(session).then((ok) => {
      if (cancelled) return;
      if (!ok) {
        clearAdminSession();
        setAdminSession(null);
      }
      setIsAdminVerified(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  useEffect(() => {
    if (!adminSession) return;
    const timer = setInterval(() => setNowTick(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, [adminSession]);

  const handleAdminLogin = useCallback((session: AdminSession) => {
    saveAdminSession(session);
    setAdminSession(session);
    setIsAdminVerified(true);
    setNowTick(Date.now());
  }, []);

  const handleAdminLogout = useCallback(() => {
    if (adminSession) logoutAdmin(adminSession);
    clearAdminSession();
    setAdminSession(null);
    setIsAdminVerified(false);
    setIsImportModalOpen(false);
    setIsBestConfigOpen(false);
  }, [adminSession]);

  // Sync with API station (guarded against races: only the latest request may
  // setState or persist the endpoint, otherwise a slow stale response from a
  // previously selected station can overwrite fresh state and localStorage).
  const syncSeqRef = useRef(0);
  const syncWithApi = useCallback(async (targetUrl: string) => {
    const seq = ++syncSeqRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const [data, channels] = await Promise.all([
        fetchApiStationConfig(targetUrl),
        fetchPublicStationChannels(targetUrl).catch(() => null),
      ]);
      if (seq !== syncSeqRef.current) return; // superseded by a newer request
      setStatusData(data.status);
      setModels(data.models);
      setLiveChannels(channels);
      if (data.models.length === 0) {
        setError('已连接但未拉取到任何模型，请确认站点地址与接口可用性');
      }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_API_URL, targetUrl);
        } catch (e) {
          console.warn('Failed to persist API URL:', e);
        }
      }
    } catch (err: unknown) {
      if (seq !== syncSeqRef.current) return;
      console.warn('API Station Sync Error:', err);
      setError(err instanceof Error ? err.message : '同步连接失败');
      setStatusData(null);
      setModels([]);
      setLiveChannels(null);
    } finally {
      if (seq === syncSeqRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    syncWithApi(endpoint);
  }, [endpoint, syncWithApi]);

  const handleEndpointChange = (newUrl: string) => {
    setEndpoint(newUrl);
  };

  // Station update & reset handlers (localStorage stores the managed list;
  // live backend channels are merged on top at render time)
  const handleUpdateStations = (newStations: AiStationItemType[]) => {
    setManagedStations(newStations);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_STATIONS, JSON.stringify(newStations));
      } catch (e) {
        console.error('Failed to save stations to localStorage:', e);
      }
    }
  };

  const handleResetDefaults = () => {
    setManagedStations(initialStations);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_STATIONS);
    }
  };

  // Cross-reference topology analysis
  const topologyAnalysis = useMemo(() => {
    return analyzeTopology(models, activeStations);
  }, [models, activeStations]);

  const filteredStations = useMemo(() => {
    let result = activeStations;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q) ||
          s.models?.some((m) => m.toLowerCase().includes(q)) ||
          s.tags?.some((t) => t.toLowerCase().includes(q)) ||
          s.quotaDesc?.toLowerCase().includes(q)
      );
    }

    if (selectedTag === 'NewAPI') {
      result = result.filter((s) => s.category === 'NewAPI');
    } else if (selectedTag === '网关') {
      result = result.filter((s) => s.category === 'Gateway');
    } else if (selectedTag === 'Linux.do') {
      result = result.filter((s) => s.authType === 'LinuxDO');
    } else if (selectedTag === 'Claude') {
      result = result.filter((s) => s.models?.some((m) => m.toLowerCase().includes('claude')));
    } else if (selectedTag === 'DeepSeek') {
      result = result.filter((s) => s.models?.some((m) => m.toLowerCase().includes('deepseek')));
    } else if (selectedTag === 'GPT') {
      result = result.filter((s) => s.models?.some((m) => m.toLowerCase().startsWith('gpt')));
    } else if (selectedTag === '免费Key') {
      result = result.filter((s) => s.category === 'DirectKey');
    } else if (selectedTag === '推荐主力') {
      result = result.filter((s) => s.id === 'yiming' || s.id === 'amnew' || s.id === 'emrank');
    }

    return result;
  }, [activeStations, searchQuery, selectedTag]);

  return (
    <div>
      {/* Real-time Linkage Panel with API Station */}
      <ApiSyncPanel
        endpoint={endpoint}
        onEndpointChange={handleEndpointChange}
        isLoading={isLoading}
        error={error}
        statusData={statusData}
        modelCount={models.length}
        onRefresh={() => syncWithApi(endpoint)}
        onOpenBestConfig={() => setIsBestConfigOpen(true)}
        onOpenImport={() => setIsImportModalOpen(true)}
        isAdmin={isAdmin}
        adminDisplayName={isAdmin ? adminSession?.displayName : undefined}
        onRequestLogin={() => setIsLoginModalOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* Controls Bar */}
      <div className="controls">
        <label className="search">
          <UiIcon name="search" size={15} strokeWidth={2} aria-hidden="true" />
          <input
            type="search"
            placeholder="搜索 AI 站点名称、支持模型、协议…"
            aria-label="搜索 AI 站点"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </label>

        {(['全部', '推荐主力', 'NewAPI', '网关', 'Linux.do', 'Claude', 'DeepSeek', 'GPT', '免费Key'] as const).map((tag) => (
          <button
            key={tag}
            type="button"
            className={`pill ${selectedTag === tag ? 'active' : ''}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag === '推荐主力' && <UiIcon name="star" size={11} className="mr-1 inline text-amber-500" />}
            {tag}
          </button>
        ))}

        {/* Admin-only quick actions; visitors get the login entry instead */}
        {isAdmin ? (
          <>
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="pill ml-auto inline-flex items-center gap-1.5 text-xs text-[var(--ink)] hover:bg-[var(--paper-soft)]"
              title="导入 New API 渠道或同步更新最新模型"
            >
              <UiIcon name="download" size={12} />
              <span>导入/更新</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBestConfigOpen(true)}
              className="pill active !bg-[var(--ink)] !border-[var(--ink)] text-[var(--paper)] hover:opacity-90 inline-flex items-center gap-1.5 text-xs"
              title="根据当前 API 站点配置生成最佳公益站拓扑方案"
            >
              <UiIcon name="sparkles" size={12} className="text-amber-300" />
              <span>最佳拓扑方案</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className="pill ml-auto inline-flex items-center gap-1.5 text-xs text-[var(--ink-soft)] hover:bg-[var(--paper-soft)]"
            title="管理员登录后可进行站点管理与配置更新"
          >
            <UiIcon name="shield" size={12} />
            <span>管理员登录</span>
          </button>
        )}
      </div>

      {/* Card Count & Match Info */}
      <div className="count flex flex-wrap items-center justify-between gap-2">
        <span>
          共 {filteredStations.length} 个活跃公益站 / 自建中转节点
          {merged.channelCount > 0 && (
            <span className="ml-2 inline-flex items-center gap-1 rounded border border-[var(--line)] bg-[var(--paper-soft)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--ink-soft)]">
              实时下发 {merged.channelCount} 渠道 · {merged.upstreamCount} 上游
            </span>
          )}
        </span>
        {models.length > 0 && (
          <span className="text-xs text-[var(--ink-soft)]">
            已与 <strong className="text-[var(--ink)]">{endpoint}</strong> ({models.length} 款模型) 形成拓扑匹配
          </span>
        )}
      </div>

      {/* Card Grid */}
      <div className="grid">
        {filteredStations.map((station) => (
          <AiStationItem
            key={station.id}
            station={station}
            onSelect={(s) => (onSelectStation ? onSelectStation(s) : setSelectedStation(s))}
          />
        ))}
      </div>

      {/* Empty State Tip */}
      <p className="empty" style={{ display: filteredStations.length ? 'none' : 'block' }}>
        没有符合条件的 AI 公益站节点，换个关键词或筛选标签试试
      </p>

      {/* Detail Modal (fallback if not handled by parent) */}
      {!onSelectStation && (
        <AiStationModal
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          apiEndpoint={endpoint}
        />
      )}

      {/* Best Public Station Config Modal */}
      <BestConfigModal
        isOpen={isBestConfigOpen}
        onClose={() => setIsBestConfigOpen(false)}
        analysis={topologyAnalysis}
        apiEndpoint={endpoint}
      />

      {/* Station Import & Update Management Modal */}
      <StationImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        currentStations={activeStations}
        apiModels={models}
        apiEndpoint={endpoint}
        onUpdateStations={handleUpdateStations}
        onResetDefaults={handleResetDefaults}
      />

      {/* Admin Login Modal (management operations require a verified admin) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        endpoint={endpoint}
        onLogin={handleAdminLogin}
      />
    </div>
  );
};
