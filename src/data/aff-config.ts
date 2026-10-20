/**
 * MangoShare Global Affiliate / Referral Configuration
 * Easily update and manage invite codes and direct links across the portal.
 */

export interface AffEntry {
  code?: string;
  url: string;
  bonusText?: string;
}

export const AFF_MAP: Record<string, AffEntry> = {
  // U-Cards
  "redotpay": {
    code: "",
    url: "https://www.redotpay.com/",
    bonusText: "充值加密货币支持全球消费与 Apple Pay"
  },
  "pokepay": {
    code: "",
    url: "https://pokepay.io/",
    bonusText: "免月租、即开即用支持微信支付宝"
  },
  "bybit": {
    code: "",
    url: "https://www.bybit.com/fiat/cards",
    bonusText: "顶级合规交易所直发 Mastercard"
  },
  "bitget-wallet": {
    code: "",
    url: "https://web3.bitget.com/",
    bonusText: "去中心化 Web3 钱包直绑卡"
  },

  // SIM Cards
  "giffgaff": {
    code: "",
    url: "https://www.giffgaff.com/",
    bonusText: "免月租保号神卡，国内免费接收短信，首充送 £5"
  },
  "clubsim": {
    code: "",
    url: "https://www.clubsim.com.hk/",
    bonusText: "香港免月租保号卡，6港币年成本，支持线上快速护照实名"
  },
  "ultra-paygo": {
    code: "",
    url: "https://www.ultramobile.com/paygo/",
    bonusText: "3美元/月原生美国实体卡号，全功能支持各大银行与券商"
  },
  "5ber": {
    code: "",
    url: "https://esim.5ber.com/",
    bonusText: "物理卡芯片让不支持 eSIM 的手机轻松写入并切换全球 eSIM"
  },
  "airalo": {
    code: "",
    url: "https://www.airalo.com/",
    bonusText: "覆盖全球 200+ 国家与地区的旅行数据流量 eSIM"
  }
};
