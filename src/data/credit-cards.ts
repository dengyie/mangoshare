import { CreditCardItem } from '../types/credit-card';

export const CREDIT_CARDS: CreditCardItem[] = [
  {
    id: 'amex-gold',
    name: 'American Express Gold Card (运通金卡)',
    issuer: 'American Express',
    region: 'US',
    regionName: '美国',
    currency: 'USD',
    network: 'American Express',
    annualFee: '$325 (等效年费约 $0~$10)',
    foreignTxFee: '0%',
    welcomeBonus: '开卡 6 个月内消费满 $6,000 赠送 60,000 ~ 90,000 MR 积分 (价值约 $1,200)',
    cashbackRewards: '全球餐厅 4X 积分、美国超市 4X 积分、机票 3X 积分，其他 1X 积分',
    requirement: '需要 ITIN 或 SSN，有 6 个月以上美卡信用记录（或通过 Amex Global Transfer 跨国转卡）',
    creditScoreLevel: 'Medium',
    features: [
      '全球餐饮 4X MR 积分，可 1:1 转点全日空、国泰、法航达美等多家主流航司',
      '无外币转换费 (0% FTF)，全球刷卡消费无汇率加价',
      '每月 $10 餐饮报销 (Grubhub / Shake Shack 等) + 每月 $10 Uber Cash 额度',
      '赠送 Dunkin Donuts 每月 $7 额度与 Resy 餐厅半年 $50 报销',
      '高额度金属卡身，自带极佳卡面质感与尊贵辨识度'
    ],
    cautions: [
      '年费 $325 需先付，适合能用足每月外卖/餐饮报销的常客',
      'Amex 在国内部分小商户刷卡覆盖率略低于 Visa / Mastercard'
    ],
    applyUrl: 'https://www.americanexpress.com/us/credit-cards/card/gold-card/',
    summary: '美卡体系公认第一餐饮神卡，报销抵扣后近乎 0 成本，积分价值极高。',
    cardBgColor: 'linear-gradient(135deg, #d4af37 0%, #aa771c 50%, #593e0b 100%)',
    cardTextColor: '#ffffff'
  },
  {
    id: 'chase-csp',
    name: 'Chase Sapphire Preferred (CSP 蓝宝石)',
    issuer: 'Chase',
    region: 'US',
    regionName: '美国',
    currency: 'USD',
    network: 'Visa',
    annualFee: '$95',
    foreignTxFee: '0%',
    welcomeBonus: '开卡 3 个月内消费满 $4,000 赠送 60,000 ~ 75,000 UR 积分 (价值约 $1,000+)',
    cashbackRewards: '旅行消费 2X、餐饮/外卖/流媒体 3X、Chase Travel 机票酒店 5X 积分',
    requirement: '需要 ITIN 或 SSN，严格遵循 Chase 5/24 规则（过去 24 个月新账户少于 5 个），建议 1 年以上美国信用历史',
    creditScoreLevel: 'Medium',
    features: [
      'Chase UR 积分核心枢纽卡：可 1:1 转点凯悦 Hyatt（酒店界最保值积分）、美联航 UA、英航 BA',
      '在 Chase Travel 兑换机票酒店享受 1.25 倍价值升水（10,000 分 = $125）',
      '每年提供 $50 酒店预订报销，抵扣后年费仅 $45',
      '全功能 Visa 顶级卡，0 外币手续费，支持 Apple Pay 与全球无障碍刷卡',
      '附带业内领先的原生租车 Primary CDW 碰撞险与行李延误赔付'
    ],
    cautions: [
      'Chase 审批对信用历史要求较严，受 5/24 限制，建议作为出海美卡第二张或第三张申请'
    ],
    applyUrl: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred',
    summary: '出海转点凯悦酒店与航司的终极必备神卡，福利与保险业内标杆。',
    cardBgColor: 'linear-gradient(135deg, #0b2545 0%, #134074 50%, #001220 100%)',
    cardTextColor: '#ffffff'
  },
  {
    id: 'c1-venture-x',
    name: 'Capital One Venture X (高端旅行负年费卡)',
    issuer: 'Capital One',
    region: 'US',
    regionName: '美国',
    currency: 'USD',
    network: 'Visa',
    annualFee: '$395 (等效 -$5 负年费)',
    foreignTxFee: '0%',
    welcomeBonus: '开卡 3 个月内消费满 $4,000 赠送 75,000 里程 (价值约 $1,000+)',
    cashbackRewards: '所有日常消费保底 2X 里程，Capital One Travel 订机酒最高 10X',
    requirement: '需要 ITIN 或 SSN，良好信用记录，C1 偏好信用记录适中且无过多近期新账户的申请人',
    creditScoreLevel: 'High',
    features: [
      '每年直接赠送 $300 Capital One Travel 订票报销',
      '每年持卡满一年赠送 10,000 里程（价值 $100+），两者相加等于每年倒赚 $5',
      '无限次免费进入 Priority Pass 机场贵宾厅（可免费带 2 位同行人）',
      '免费进入 Capital One 自营顶级奢华贵宾室',
      '免费添加多达 4 张副卡，副卡持卡人同样免费享有独立的 PP 贵宾厅权益'
    ],
    cautions: [
      '$300 报销需在官方 Travel Portal 中使用，但支持比价与差价返还'
    ],
    applyUrl: 'https://www.capitalone.com/credit-cards/venture-x/',
    summary: '高端卡中的神仙性价比，无脑持有每年倒贴福利，出海机场贵宾厅首选。',
    cardBgColor: 'linear-gradient(135deg, #1b263b 0%, #415a77 50%, #0d1b2a 100%)',
    cardTextColor: '#ffffff'
  },
  {
    id: 'amex-bce',
    name: 'Amex Blue Cash Everyday (BCE 免年费入门)',
    issuer: 'American Express',
    region: 'US',
    regionName: '美国',
    currency: 'USD',
    network: 'American Express',
    annualFee: '$0 (永久免年费)',
    foreignTxFee: '2.7%',
    welcomeBonus: '开卡 6 个月内消费满 $2,000 返现 $200 账单抵扣',
    cashbackRewards: '美国在线零售网购 3%、美国超市 3%、美国加油站 3% 现金返还，其他 1%',
    requirement: '支持 ITIN 申请，新手友好，对信用历史要求宽松，可作为美卡起步卡',
    creditScoreLevel: 'Low',
    features: [
      '终身 $0 年费，适合长期持有建立美国长效信用历史与 FICO 分数',
      '涵盖跨境海淘、线上独立站购物 3% 返现（每年上限 $6,000 消费）',
      '每月提供 $7 Disney Bundle 订阅报销（每年最高 $84），名副其实倒贴收益卡',
      '通过 Amex 官网可免费无损查阅每月 Experian 真实 FICO 信用分'
    ],
    cautions: [
      '存在 2.7% 外币交易费，建议仅在美元结算或海淘消费时使用，避免在线下非美元地区刷卡'
    ],
    applyUrl: 'https://www.americanexpress.com/us/credit-cards/card/blue-cash-everyday/',
    summary: 'ITIN 出海玩家起步神卡，0 年费 + 3% 线上零售返现 + Disney 报销。',
    cardBgColor: 'linear-gradient(135deg, #48cae4 0%, #0077b6 60%, #023e8a 100%)',
    cardTextColor: '#ffffff'
  },
  {
    id: 'bilt-mastercard',
    name: 'Bilt World Elite Mastercard (付房租神卡)',
    issuer: 'Wells Fargo',
    region: 'US',
    regionName: '美国',
    currency: 'USD',
    network: 'Mastercard',
    annualFee: '$0 (永久免年费)',
    foreignTxFee: '0%',
    welcomeBonus: '常有开卡前 5 天所有消费 5X 积分限时活动',
    cashbackRewards: '付房租免手续费 1X 积分、餐饮 3X 积分、旅行 2X 积分、每月 1 号 Rent Day 双倍积分',
    requirement: '需要 ITIN 或 SSN，建议有 6 个月以上良好信用记录',
    creditScoreLevel: 'Medium',
    features: [
      '唯一一张可直接生成专属虚拟 ACH 路由账号支付美国房租、且免除任何手续费积累积分的信用卡',
      'Bilt 积分被誉为点数界价值第一：1:1 转点凯悦 Hyatt、阿拉斯加航空、美国航空等稀缺顶流',
      '全功能 World Elite Mastercard，0 外币手续费，支持 Apple Pay 全球无障碍刷卡',
      '包含手机碎屏险、租车 Secondary 保险与航班延误险'
    ],
    cautions: [
      '每月账单周期需满足至少 5 次任意金额消费，才可激活当期积分入账'
    ],
    applyUrl: 'https://www.biltrewards.com/card',
    summary: '0 年费 + 0 FTF，积分价值极高且支持免手续费刷美国房租。',
    cardBgColor: 'linear-gradient(135deg, #2b2d42 0%, #1f1f2e 60%, #111118 100%)',
    cardTextColor: '#ffffff'
  },
  {
    id: 'hsbc-red',
    name: '汇丰 HSBC Red 信用卡 (网购 4% 港卡神卡)',
    issuer: 'HSBC Hong Kong',
    region: 'HK',
    regionName: '香港',
    currency: 'HKD',
    network: 'Mastercard',
    annualFee: 'HK$0 (永久无条件免年费)',
    foreignTxFee: '1.95%',
    welcomeBonus: '新客户发卡后首 60 天内消费满 HK$8,000 获高达 $800「奖赏钱」RC',
    cashbackRewards: '网上购物签账高达 4%「奖赏钱」RC 回赠（每月上限 HK$10,000 签账），本地超市 2%，其他 0.4%',
    requirement: '香港居民身份证或持有汇丰香港 One / 卓越理财账户且有存入资金的非香港居民',
    creditScoreLevel: 'Medium',
    features: [
      '无门槛永久免年费，下卡即用，支持绑定 Apple Pay 与支付宝/微信支付香港版',
      '网上购物消费（包括海淘、云服务器订阅、App Store 等）通通享受 4% 高额返现',
      '回赠的「奖赏钱」RC 可以 1:1 抵扣信用卡账单，或以极佳比例兑换国泰航空亚洲万里通里数',
      '通过 HSBC HK App 随时随地即时锁定、生成虚拟卡号、调整限额'
    ],
    cautions: [
      '外币消费有 1.95% 跨境手续费，但 4% 返现扣除手续费后仍有净 2.05% 正收益'
    ],
    applyUrl: 'https://www.hsbc.com.hk/zh-hk/credit-cards/products/red/',
    summary: '香港公认第一网购神器，4% 稳定返现，无需登记月月自动到账。',
    cardBgColor: 'linear-gradient(135deg, #d90429 0%, #ef233c 60%, #8d0801 100%)',
    cardTextColor: '#ffffff'
  },
  {
    id: 'hsbc-pulse',
    name: '汇丰 Pulse 银联双币钻石信用卡 (内地 4.4% 返现)',
    issuer: 'HSBC Hong Kong',
    region: 'HK',
    regionName: '香港',
    currency: 'HKD / CNY',
    network: 'UnionPay',
    annualFee: 'HK$1,800 (首两年免年费，后续可轻松致电豁免)',
    foreignTxFee: '0% (内地刷人民币 0 手续费)',
    welcomeBonus: '签账满额享高达 $800 奖赏钱',
    cashbackRewards: '配合「最红自主奖赏」以及内地/澳门签账叠加优惠，内地刷卡/云闪付最高达 4.4% 返现',
    requirement: '持有汇丰香港账户，年薪达标或在汇丰香港持有一定资产结余',
    creditScoreLevel: 'Medium',
    features: [
      '大湾区最强神卡：人民币与港币双币账户，在内地直接走银联通道扣划人民币，免收任何外币手续费',
      '绑定云闪付或微信/支付宝，在内地线下各类商超、餐饮、酒店消费畅行无阻',
      '高达 4.4% 的综合返现率，秒杀所有境内普通信用卡',
      '附赠大湾区机场贵宾厅礼遇与高铁贵宾通道优惠'
    ],
    cautions: [
      '需在每年年底或年初于汇丰 Rewards App 中登记「最红自主奖赏」赏中华/赏世界类别'
    ],
    applyUrl: 'https://www.hsbc.com.hk/zh-hk/credit-cards/products/pulse-diamond-unionpay/',
    summary: '出海与港人北上神卡，内地消费 0 手续费 + 最高 4.4% 高额返现。',
    cardBgColor: 'linear-gradient(135deg, #1d3557 0%, #457b9d 60%, #0d1b2a 100%)',
    cardTextColor: '#ffffff'
  },
  {
    id: 'boc-cheers',
    name: '中银香港 BOC Cheers 信用卡 (餐饮娱乐 10X 积分)',
    issuer: 'BOC Hong Kong',
    region: 'HK',
    regionName: '香港',
    currency: 'HKD',
    network: 'Visa',
    annualFee: 'HK$2,000 (首年免年费，可致电豁免)',
    foreignTxFee: '1.95%',
    welcomeBonus: '新客户签账满额送高达 300,000 积分或高额现金券',
    cashbackRewards: '指定餐饮及旅游签账高达 10X 积分 (相当于 4% 回赠或 HK$1.5/里数)',
    requirement: '中银香港私人财富或「中银理财」客户，或年薪达到 HK$300,000+',
    creditScoreLevel: 'High',
    features: [
      'Visa Infinite 顶级无限卡尊荣地位，持卡人可享每年多次免费 Priority Pass 贵宾厅',
      '香港与海外餐饮消费统统 10X 积分，兑换国泰亚万里数比例极佳（低至 HK$1.5/里）',
      '支持绑定 Apple Pay、Google Pay 等各大移动钱包',
      '附带香港及海外高额旅游与意外保险保障'
    ],
    cautions: [
      '需要满足较高年薪或中银理财资产要求，建议开立中银香港账户并存入资金后申请'
    ],
    applyUrl: 'https://www.bochk.com/dam/boccreditcard/cheers/tc/index.html',
    summary: '中银香港顶配高端卡，餐饮 10 倍积分，里数党与高端商旅客必申。',
    cardBgColor: 'linear-gradient(135deg, #3d0c11 0%, #7209b7 60%, #1a002c 100%)',
    cardTextColor: '#ffffff'
  },
  {
    id: 'sc-smart',
    name: '渣打 Smart 信用卡 (0 外币手续费港卡)',
    issuer: 'Standard Chartered HK',
    region: 'HK',
    regionName: '香港',
    currency: 'HKD',
    network: 'Visa',
    annualFee: 'HK$0 (永久无条件豁免年费)',
    foreignTxFee: '0% (完全免收 1.95% 外币交易手续费)',
    welcomeBonus: '新客户发卡后首 2 个月内消费满 HK$4,000 获高达 HK$1,000 现金回赠',
    cashbackRewards: '指定商户 (Donki, 百佳, 屈臣氏, 759等) 5% 现金回赠，所有海外/外币签账 0.56% 且免手续费',
    requirement: '年满 18 岁，持有渣打香港账户或有效证件与收入/存款证明',
    creditScoreLevel: 'Low',
    features: [
      '永久免年费 + 0% 海外签账外币手续费（大多数港卡收 1.95%）',
      '无限次申请 3 个月免费免息分期，资金周转非常灵活',
      '支持 Apple Pay、Google Pay 与云闪付绑卡',
      '开卡门槛低，对内地常赴港用户非常友好'
    ],
    cautions: [
      '非特约商户的海外基础返现率为 0.56%，核心优势在于 0% FTF 与免年费'
    ],
    applyUrl: 'https://www.sc.com/hk/zh/credit-cards/smart/',
    summary: '永久免年费 + 0 外币手续费，出境消费与小额资金周转首选。',
    cardBgColor: 'linear-gradient(135deg, #028090 0%, #00a896 60%, #05668d 100%)',
    cardTextColor: '#ffffff'
  },
  {
    id: 'ocbc-card',
    name: '新加坡 OCBC 华侨银行 借记卡 (中国护照远程可开)',
    issuer: 'OCBC Bank Singapore',
    region: 'SG',
    regionName: '新加坡',
    currency: 'SGD / USD / HKD 等',
    network: 'Visa',
    annualFee: '$0 (永久免年费)',
    foreignTxFee: '0% (支持多币种直接借记对应账户余额)',
    welcomeBonus: '注册填写邀请码并在 30 天内入金 1,000 新币即赠 15 新币 (约 80 元人民币)',
    cashbackRewards: '日常全球消费 1% 返现直接打入银行账户',
    requirement: '仅需中国大陆护照 + NFC 手机 + 身份证，全流程手机 App 5 分钟极速在线开户',
    creditScoreLevel: 'None',
    features: [
      '真正的新加坡本土一线全牌照银行账户，受新加坡存款保险最高 10 万新币法定保障',
      '无需赴新，无需线下见证，全程在中国境内通过 App 人脸识别与护照芯片验证开户',
      '赠送 Visa 实体卡寄送到中国大陆地址，支持绑定 Apple Pay 与微信/支付宝消费',
      '支持开通 SGD、USD、EUR、GBP、AUD 等 10+ 个离岸币种独立账户',
      '支持与 Wise、盈透证券 IBKR、香港各银行之间极速无损跨境汇款'
    ],
    cautions: [
      '开户后首年免账户管理费，第二年起若月均余额不足 1,000 新币可能有每月 2 新币管费（可降级账户保留）'
    ],
    applyUrl: 'https://www.ocbc.com/personal-banking/digital-banking/digital-services/account-opening',
    affCode: 'OCBC2026',
    summary: '出海资产配置第一枢纽，大陆护照 5 分钟远程开通新加坡正规银行账户。',
    cardBgColor: 'linear-gradient(135deg, #c1121f 0%, #780000 60%, #440000 100%)',
    cardTextColor: '#ffffff'
  },
  {
    id: 'wise-debit',
    name: 'Wise 国际借记卡 (全球中间汇率兑换)',
    issuer: 'Wise (原 TransferWise)',
    region: 'GLOBAL',
    regionName: '全球离岸',
    currency: '40+ 种全球法定货币',
    network: 'Visa',
    annualFee: '$0 (永久免年费)',
    foreignTxFee: '0% (以路透社实时真实无加价中间市场汇率兑换)',
    welcomeBonus: '通过邀请链接开户首笔最高 £500 (或等值人民币) 免除汇款手续费',
    cashbackRewards: '特定地区支持资金余额生息 (如美元年化高达 4.5%+)',
    requirement: '护照 + 海外地址证明（或支持的国家地区身份证明）',
    creditScoreLevel: 'None',
    features: [
      '提供独一无二的个人名下专属国际银行账号：美国 ACH 账号、欧洲 IBAN、英国 Sort Code 等',
      '跨境汇款汇率最透明：完全采用 Google/路透社中间汇率，手续费公开无隐藏点差',
      '提供多达 3 张即开即用的虚拟卡，随用随销毁，安全防盗刷',
      '完美兼容各大交易所入金出金、海淘电商支付以及海外工资结算'
    ],
    cautions: [
      '中国大陆地址注册目前暂无法直接邮寄实体卡，但可通过开通海外地址或使用虚拟卡'
    ],
    applyUrl: 'https://wise.com/',
    summary: '数字游民人手必备的全球资金中转站，真实中间汇率，0 隐藏费用。',
    cardBgColor: 'linear-gradient(135deg, #9ef01a 0%, #70e000 50%, #38b000 100%)',
    cardTextColor: '#111827'
  },
  {
    id: 'revolut-card',
    name: 'Revolut 欧洲离岸多币种卡 (新一代数字银行)',
    issuer: 'Revolut Bank UAB',
    region: 'EU',
    regionName: '欧洲 / 英国',
    currency: 'EUR / GBP / USD',
    network: 'Mastercard',
    annualFee: '€0 (标准版永久免年费)',
    foreignTxFee: '0% (工作日免费实时兑换 30+ 种货币)',
    welcomeBonus: '受邀注册常赠送 €10 ~ €40 迎新现金奖励',
    cashbackRewards: '特定商户高达 10% 购物回赠，支持加密货币与股票投资交易',
    requirement: '欧洲、英国、日本、新加坡等支持国家的签证/居留/合规地址证明',
    creditScoreLevel: 'None',
    features: [
      '全功能欧洲立陶宛持牌银行账户，受欧盟 10 万欧元法定存款保险保障',
      '独创一次性动态虚拟卡（Disposable Virtual Card），每次消费后卡号自动粉碎，盗刷概率为 0',
      '支持一键定投美股、ETF、加密货币与贵金属',
      '极客风 UI 与极速点对点免费转账系统'
    ],
    cautions: [
      '周末进行货币兑换可能有 1% 的外汇波动微量手续费，建议工作日提前锁定汇率'
    ],
    applyUrl: 'https://www.revolut.com/',
    summary: '欧洲最大的数字新银行，独创单次动态粉碎虚拟卡，极致资金安全。',
    cardBgColor: 'linear-gradient(135deg, #14213d 0%, #000000 60%, #1f1f2e 100%)',
    cardTextColor: '#ffffff'
  }
];
