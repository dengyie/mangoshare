export type AiStationCategory = 'NewAPI' | 'Gateway' | 'ImageGen' | 'DirectKey';
export type AiHealthState = 'online' | 'degraded' | 'offline';

export interface AiStationItem {
  id: string;
  name: string;
  category: AiStationCategory;
  portalUrl: string;
  apiBaseUrl: string;
  models: string[];
  authType: 'LinuxDO' | 'GitHub' | 'Password' | 'DirectKey' | 'Session';
  quotaDesc: string;
  statusEndpoint?: string;
  healthState: AiHealthState;
  turnstile: boolean;
  tags: string[];
  tutorial?: string;
  balance?: string;
  rpmLimit?: string;
}
