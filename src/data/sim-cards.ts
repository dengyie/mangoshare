import { SimCardItem } from '../types/sim-card';

export const SIM_CARDS: SimCardItem[] = [
  {
    id: 'giffgaff',
    name: 'giffgaff UK (英国 0月租保号神卡)',
    country: '英国',
    countryCode: 'GB',
    form: ['Physical', 'eSIM'],
    maintenanceCost: '£0 / 月 (每180天发一条短信 £0.30 即可顺延)',
    receiveSmsCost: '国内漫游免费接收短信',
    needRealName: false,
    realNameDesc: '无需实名认证，激活绑定 Visa/Mastercard 充值 £10 即可永久激活',
    topUpMethods: ['Visa', 'Mastercard', 'PayPal'],
    summary: '出海注册首选神卡，0月租保号，国内漫游稳定免费接码，支持转换 eSIM。',
    features: [
      '无固定月租，不使用不扣费',
      '在中国大陆漫游免费接收来自全球的验证码短信',
      '支持注册英国银行 (Monzo / Wise / Revolut)、海外 Telegram、WhatsApp、PayPal、ChatGPT',
      '支持从物理 SIM 卡一键转为 eSIM (需在 giffgaff App 内操作)',
      '激活首充 £10 额外赠送 £5 话费奖励'
    ],
    cautions: [
      '每 180 天内必须产生一次余额变动（如发送一条短信至国内号码，扣费约 £0.30），否则号码会被回收',
      '国内漫游上网流量费极贵 (£0.20/MB)，建议在手机设置中关闭该卡的数据漫游功能'
    ],
    affLink: 'https://www.giffgaff.com/',
    affCode: '',
    tags: ['0月租', '免实名', '国内免费接码', '支持eSIM', '出海必备']
  },
  {
    id: 'clubsim',
    name: 'Club Sim (香港 HKT 6港币年保号卡)',
    country: '中国香港',
    countryCode: 'HK',
    form: ['Physical', 'eSIM'],
    maintenanceCost: '约 HK$6 / 年 (每年购买一个短信组合包即可顺延365天)',
    receiveSmsCost: '国内漫游免费接收短信',
    needRealName: true,
    realNameDesc: '线上 3 分钟完成护照或港澳通行证实名认证，审批秒过',
    topUpMethods: ['Alipay HK', '微信支付', 'Visa', 'Mastercard', 'Apple Pay'],
    summary: '开通香港银行账户与港美股绝配，年维护成本仅需 6 港币，支持全线上实名。',
    features: [
      '香港电讯 HKT 官方卡，网络覆盖顶级，信号极其稳定',
      '年保号成本极低：每年买一次 HK$6 的短信套餐即可延期 1 年',
      '国内无缝漫游接入中国移动/中国联通网络，免费秒接验证码',
      '完全支持香港各银行 (汇丰/中银香港/渣打/众安ZA Bank) 与港股券商绑定',
      '提供官方 eSIM 二维码即买即发，支持 5ber / eSIM.me 等写卡器'
    ],
    cautions: [
      '香港法例要求电话卡必须实名登记，需准备有效护照或港澳通行证在网页拍照审核',
      '未实名状态下无法漫游接收信号'
    ],
    affLink: 'https://www.clubsim.com.hk/',
    affCode: '',
    tags: ['超低成本', '香港银行绝配', '线上秒实名', '国内免费接码', '支持eSIM']
  },
  {
    id: 'ultra-paygo',
    name: 'Ultra Mobile PayGo (美国 $3 原生美号神卡)',
    country: '美国',
    countryCode: 'US',
    form: ['Physical', 'eSIM'],
    maintenanceCost: '$3.00 / 月 (固定月租，支持信用卡自动扣款)',
    receiveSmsCost: 'Wi-Fi Calling 下免费收发，蜂窝漫游扣除配额',
    needRealName: false,
    realNameDesc: '无需向运营商提供护照实名，激活填美国邮编分配对应区号',
    topUpMethods: ['Visa', 'Mastercard', '银联信用卡'],
    summary: '出海美股美卡核心资产，正宗美国 T-Mobile 实体原生号段，非虚拟 VoIP 号码。',
    features: [
      '每月包含 100 分钟通话 + 100 条短信 (在 Wi-Fi Calling 开启状态下全球通用)',
      '正规原生美国移动网络号段，100% 通过银行风控，绝不被识别为 Google Voice 虚拟号',
      '完美支持美区 PayPal、Apple ID、Chase/Amex/Capital One 银行开户及 Zelle 转账',
      '支持各大美股券商 (Firstrade、嘉信理财 Charles Schwab、盈透证券 IBKR)',
      '全功能支持在 iPhone 和 Android 上开启 Wi-Fi 通话'
    ],
    cautions: [
      '若未开启 Wi-Fi Calling 直接使用蜂窝漫游，每条短信会额外扣除 $0.10，每分钟通话 $0.25',
      '实体卡需从美国转运或国内现货代购'
    ],
    affLink: 'https://www.ultramobile.com/paygo/',
    affCode: '',
    tags: ['原生美号', '免实名', '银行风控首选', 'Wi-Fi Calling', '支持eSIM']
  },
  {
    id: 'skinny',
    name: 'Skinny Mobile (新西兰 NZ$5 保号卡)',
    country: '新西兰',
    countryCode: 'NZ',
    form: ['Physical', 'eSIM'],
    maintenanceCost: '约 NZ$5 / 年 (每隔一年充值 5 纽币即可顺延保号)',
    receiveSmsCost: '国内漫游免费接收短信',
    needRealName: false,
    realNameDesc: '新西兰电信法目前免实名登记，插卡即用',
    topUpMethods: ['Visa', 'Mastercard'],
    summary: '南半球隐私天花板，真正零实名保号，国内免费接短信，纯净原生新西兰号码。',
    features: [
      '完全无需个人身份证明，最大程度保护隐私',
      '充值一次 NZ$5（约 22 元人民币），有效期即可延长整整 365 天',
      '国内自动漫游接入中国移动/联通网络，接收验证码短信完全免费',
      '支持注册海外 Telegram、Twitter/X、Instagram、Google、OpenAI'
    ],
    cautions: [
      '新卡必须在国内具有良好新西兰漫游协议的基站激活，或在入境新西兰时激活',
      '充值需要支持海外 3D 验证的双币信用卡'
    ],
    affLink: 'https://www.skinny.co.nz/',
    affCode: '',
    tags: ['免实名', '高隐私', '国内免费接码', '年付极低']
  },
  {
    id: 'three-hk-diy',
    name: '3HK DIY 储值卡 (香港 3 香港大流量漫游)',
    country: '中国香港',
    countryCode: 'HK',
    form: ['Physical', 'eSIM'],
    maintenanceCost: '按订购套餐周期扣费，365天多国漫游数据包',
    receiveSmsCost: '国内漫游免费接短信',
    needRealName: true,
    realNameDesc: '线上通行证/护照拍照实名，几分钟内审核通过',
    topUpMethods: ['Alipay HK', '支付宝 (内地版)', '微信支付', '信用卡'],
    summary: '出境差旅、翻越局域网利器，支持大中华/亚太/全球 365 天长效漫游数据包。',
    features: [
      '可在国内直连访问外网（原生香港独立 IP，出口自带香港原生住宅/IDC）',
      '支持内地支付宝和微信直接充值付款，对大陆用户极度友好',
      '提供即开即用 eSIM 二维码，几分钟内手机扫码完成安装',
      '提供 365 天长效大中华区 (内地/港/澳) 45GB 共享流量包'
    ],
    cautions: [
      '漫游数据流量价格高于国内普通套餐，主要用于紧急备份或境外纯净 IP 需求',
      '需要实名登记'
    ],
    affLink: 'https://web.three.com.hk/',
    affCode: '',
    tags: ['自带原生翻墙', '支付宝充值', '365天长效流量', 'eSIM即开即用']
  },
  {
    id: 'helium-mobile',
    name: 'Helium Mobile (美国去中心化 Web3 挖矿通信卡)',
    country: '美国',
    countryCode: 'US',
    form: ['eSIM', 'Physical'],
    maintenanceCost: '$20 / 月 (支持使用挖矿产出的 MOBILE 代币全额抵扣)',
    receiveSmsCost: '全美无限通话短信，国际漫游可按需充值',
    needRealName: false,
    realNameDesc: '需海外邮箱与美国地址注册（免护照实名）',
    topUpMethods: ['Solana 链上 MOBILE 代币', 'USDC', '信用卡'],
    summary: 'Web3 与 DePIN 标杆项目，手机开启位置映射参与网络即可天天赚币抵扣月租。',
    features: [
      '基于 Solana 链上生态，每天后台自动参与 Discovery Mapping 赚取 MOBILE 代币',
      '代币可直接在 Helium Wallet App 内一键支付抵扣话费，实现真正意义上的「0元购无限套餐」',
      '底层网络走美国 T-Mobile 5G 网络，网速与通话质量与正规运营商一致',
      '提供原生美国 eSIM，手机扫码秒激活'
    ],
    cautions: [
      '需要手机每天产生位置移动（走路或坐车）才能稳定获得 Mapping 奖励',
      '在国内无漫游资费包时仅支持 Wi-Fi Calling'
    ],
    affLink: 'https://hellohelium.com/',
    affCode: '',
    tags: ['Web3', 'DePIN挖矿', '0元无限套餐', '原生美号', '支持eSIM']
  },
  {
    id: '5ber-esim',
    name: '5ber.eSIM 实体转 eSIM 物理芯片卡 (硬件神器)',
    country: '全球通用',
    countryCode: 'GLOBAL',
    form: ['Physical'],
    maintenanceCost: '一次性硬件采购成本 (约 $12 ~ $25，终身免月租)',
    receiveSmsCost: '取决于写入的 eSIM 配置文件运营商规则',
    needRealName: false,
    realNameDesc: '硬件本身无实名要求',
    topUpMethods: ['微信支付', '支付宝', 'USDT', '信用卡'],
    summary: '让所有不支持 eSIM 的普通双卡手机直接变成全功能 eSIM 手机，自由下载切换全球卡号。',
    features: [
      '标准 Nano-SIM 卡尺寸，直接插入手机 SIM 卡槽即可使用',
      '配套 5ber 官方 Android App，手机摄像头直接扫二维码即可将任何运营商的 eSIM 写入卡内',
      '卡内可存储多达 15+ 个全球 eSIM 配置文件，并在 App 内随时一秒无缝切换活跃号码',
      '完美适配 giffgaff、ClubSim、Airalo、Nomad、3HK 等全网 eSIM',
      '支持通过国内顺丰/中通快递直接邮寄到家'
    ],
    cautions: [
      '需要 Android 手机（支持 OTG / 智能 SIM 通信规范）进行配置和写入（写卡完成后部分 iPhone 亦可读取使用）',
      'Standard 版支持无限次下载写入，Premium 版支持更多存储槽位'
    ],
    affLink: 'https://esim.5ber.com/',
    affCode: '',
    tags: ['写卡神器', '免实名', '突破硬件限制', '支持多卡切换', '终身使用']
  },
  {
    id: 'airalo',
    name: 'Airalo (全球最大旅行与数据流量 eSIM 平台)',
    country: '全球 200+ 国家',
    countryCode: 'GLOBAL',
    form: ['eSIM'],
    maintenanceCost: '无月租，按需购买纯数据流量包 (7天/15天/30天)',
    receiveSmsCost: '纯流量数据卡 (部分全球包提供虚拟漫游号码)',
    needRealName: false,
    realNameDesc: '大部分地区即买即用无需实名',
    topUpMethods: ['Apple Pay', 'Google Pay', 'PayPal', '支付宝', '信用卡'],
    summary: '出国旅游与商务差旅首选，下飞机扫码秒上网，彻底告别机场排队买卡与昂贵漫游。',
    features: [
      '覆盖全球 200 多个国家与地区（亚洲、欧洲、美洲、中东等）',
      '提供单个国家包、区域跨国包（如欧洲 39 国通用）与全球全球通用包',
      'App 内一键直达安装 eSIM，支持无网络预先激活',
      '费用透明，用完即止，绝无隐形扣费与自动续订陷阱'
    ],
    cautions: [
      '绝大多数为纯流量 eSIM，不附带本地通话与短信号码',
      '购买后需在指定有效期内完成激活'
    ],
    affLink: 'https://www.airalo.com/',
    affCode: '',
    tags: ['旅行必备', '全球漫游', '即买即用', '多国通用', '免实名']
  }
];
