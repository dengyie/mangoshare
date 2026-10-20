import type { UiIconName } from '../components/awesome-ui/UiIcon';

export type PerkCategory = 'Cloud' | 'Dev' | 'Domain' | 'Finance' | 'AI';

export interface PerkItem {
  id: string;
  name: string;
  category: PerkCategory;
  categoryName: string;          // 永久云资源、开发利器、免费网络/域名、出海金融福利、AI 工具
  provider: string;              // Oracle, Google Cloud, Cloudflare, GitHub, JetBrains, Tailscale, etc.
  rewardValue: string;           // 福利估值 / 额度: "永久免费 (价值 $300+/年)", "$1,000+ 开发者礼包", "终身免佣金"
  difficulty: '极简' | '简单' | '中等' | '较高'; // 获取难度
  validity: string;              // 有效期限: "永久有效", "在读期间有效", "首次入金即赠"
  requirement: string;           // 领取门槛: "双币信用卡", "edu 邮箱或学籍证明", "仅需邮箱", "香港卡入金 1 万港币"
  summary: string;               // 一句话提炼
  highlights: string[];          // 核心权益清单
  steps: string[];               // 领取与避坑实操步骤
  targetUrl: string;             // 直达链接
  tags: string[];                // 标签: 永久免费, 免实名, 薅羊毛, 开发者, 无需信用卡
  iconName?: UiIconName;         // Awesome-UI 矢量图标名称
}
