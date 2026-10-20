import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { AiStationItem as AiStationItemType } from '../../types/ai-station';
import { ApiStationStatus } from '../../types/api-sync';
import {
  DEFAULT_API_STATION_URL,
  STORAGE_KEY_API_URL,
  STORAGE_KEY_CUSTOM_STATIONS,
  fetchApiStationConfig,
  analyzeTopology,
  loadManagedStations,
} from '../../utils/api-station-sync';
import { AiStationItem } from './AiStationItem';
import { AiStationModal } from './AiStationModal';
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
  const [activeStations, setActiveStations] = useState<AiStationItemType[]>(() =>
    loadManagedStations(initialStations)
  );

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

  // Sync with API station (guarded against races: only the latest request may
  // setState or persist the endpoint, otherwise a slow stale response from a
  // previously selected station can overwrite fresh state and localStorage).
  const syncSeqRef = useRef(0);
  const syncWithApi = useCallback(async (targetUrl: string) => {
    const seq = ++syncSeqRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchApiStationConfig(targetUrl);
      if (seq !== syncSeqRef.current) return; // superseded by a newer request
      setStatusData(data.status);
      setModels(data.models);
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

  // Station update & reset handlers
  const handleUpdateStations = (newStations: AiStationItemType[]) => {
    setActiveStations(newStations);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_STATIONS, JSON.stringify(newStations));
      } catch (e) {
        console.error('Failed to save stations to localStorage:', e);
      }
    }
  };

  const handleResetDefaults = () => {
    setActiveStations(initialStations);
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

        {/* Import & Update Quick Button */}
        <button
          type="button"
          onClick={() => setIsImportModalOpen(true)}
          className="pill ml-auto inline-flex items-center gap-1.5 text-xs text-[var(--ink)] hover:bg-[var(--paper-soft)]"
          title="导入 New API 渠道或同步更新最新模型"
        >
          <UiIcon name="download" size={12} />
          <span>导入/更新</span>
        </button>

        {/* Best Config Master Button */}
        <button
          type="button"
          onClick={() => setIsBestConfigOpen(true)}
          className="pill active !bg-[var(--ink)] !border-[var(--ink)] text-[var(--paper)] hover:opacity-90 inline-flex items-center gap-1.5 text-xs"
          title="根据当前 API 站点配置生成最佳公益站拓扑方案"
        >
          <UiIcon name="sparkles" size={12} className="text-amber-300" />
          <span>最佳拓扑方案</span>
        </button>
      </div>

      {/* Card Count & Match Info */}
      <div className="count flex flex-wrap items-center justify-between gap-2">
        <span>共 {filteredStations.length} 个活跃公益站 / 自建中转节点</span>
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
    </div>
  );
};
