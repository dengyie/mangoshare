import { AiStationItem } from './ai-station';

export interface ApiStationStatus {
  system_name: string;
  version: string;
  server_address?: string;
  start_time?: number;
  uptime_kuma_enabled?: boolean;
  checkin_enabled?: boolean;
  register_enabled?: boolean;
  quota_display_type?: string;
  usd_exchange_rate?: number;
}

export interface PricingModelItem {
  model_name: string;
  vendor_id?: number;
  quota_type?: number;
  model_ratio?: number;
  model_price?: number;
  enable_groups?: string[];
  supported_endpoint_types?: string[];
}

export interface ApiSyncState {
  endpoint: string;
  isLoading: boolean;
  error: string | null;
  lastSyncTime: number | null;
  statusData: ApiStationStatus | null;
  models: string[];
}

export type RecommendedTier = 'primary_ha' | 'vector_rag' | 'free_fallback' | 'bonus_lottery';

export interface StationRecommendation {
  station: AiStationItem;
  tier: RecommendedTier;
  tierBadge: string;
  tierName: string;
  reason: string;
  recommendedPriority: number;
  recommendedWeight: number;
  recommendedModels: string[];
  testModel: string;
  matchedExistingModels: string[];
  expandedNewModels: string[];
}

export interface TopologyAnalysisResult {
  existingModelCount: number;
  coveredByPublicStations: string[];
  gapModelsCount: number;
  recommendations: StationRecommendation[];
  summary: string;
}

export interface NewApiChannelPayload {
  mode: 'single' | 'batch' | 'multi_to_single';
  channel: {
    name: string;
    type: number;
    key: string;
    base_url: string;
    models: string;
    group: string;
    priority: number;
    weight: number;
    status: number;
    auto_ban: number;
    test_model: string | null;
    tag?: string;
    remark?: string;
    setting?: string;
    settings?: string;
  };
}
