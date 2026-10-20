export type CreditCardRegion = 'US' | 'HK' | 'SG' | 'EU' | 'GLOBAL';

export interface CreditCardItem {
  id: string;
  name: string;
  issuer: string;                // 发卡行: American Express, Chase, Capital One, HSBC, BOC HK, OCBC, etc.
  region: CreditCardRegion;      // 地区
  regionName: string;            // 地区中文名: 美国、香港、新加坡、欧洲
  currency: string;              // 结算币种: USD, HKD, SGD, EUR
  network: 'Visa' | 'Mastercard' | 'American Express' | 'UnionPay';
  annualFee: string;             // 年费: "$0", "$95", "$250 (等效 $10)", "HK$0 (永久免年费)"
  foreignTxFee: string;          // 外币交易费 (FTF): "0%", "1.95%"
  welcomeBonus: string;          // 开卡礼 / Welcome Bonus
  cashbackRewards: string;       // 消费返现与返点机制
  requirement: string;           // 申请门槛: "ITIN / SSN", "香港身份证或内地护照+地址证明", "护照远程在线开户"
  creditScoreLevel: 'Low' | 'Medium' | 'High' | 'None'; // 信用历史要求
  features: string[];            // 核心权益亮点
  cautions: string[];            // 避坑要点
  applyUrl?: string;             // 申请 / 官方详情直链
  affCode?: string;              // 推荐奖励代码
  summary: string;               // 一句话神卡评语
  cardBgColor?: string;          // 卡面背景色主题 (渐变或纯色)
  cardTextColor?: string;        // 卡面文字色
}
