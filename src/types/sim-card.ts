export interface SimCardItem {
  id: string;
  name: string;
  country: string;
  countryCode: string; // GB, US, HK, NZ, etc.
  flag?: string;       // 国家标识
  form: ('eSIM' | 'Physical' | 'Dual')[];
  maintenanceCost: string; // e.g., "£0/月 (180天发一条短信 £0.3)"
  receiveSmsCost: string;  // e.g., "国内漫游免费接短信"
  needRealName: boolean;   // 是否需要护照/人脸实名
  realNameDesc?: string;   // 实名细节 (如: "线上 5 分钟护照实名")
  topUpMethods: string[];  // 充值方式 (Visa/Mastercard/Alipay/USDT)
  summary: string;         // 一句话神卡评语
  features: string[];      // 核心亮点
  cautions: string[];      // 避坑要点
  affLink?: string;        // 申请/购买直链
  affCode?: string;        // 专属优惠码
  tags: string[];          // 标签 (e.g. "免月租", "原生美号", "0月租")
}
