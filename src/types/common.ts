export type TabType = 'u-cards' | 'sim-cards' | 'ai-hub' | 'credit-cards' | 'perks';

export interface TabConfig {
  id: TabType;
  label: string;
  badge?: string;
  iconName: string;
  description: string;
  count?: number;
  available: boolean;
}
