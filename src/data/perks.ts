import { PerkItem } from '../types/perk';

export const PERKS: PerkItem[] = [
  {
    id: 'oracle-cloud-free',
    name: 'Oracle Cloud 永久免费云 (甲骨文真神机)',
    category: 'Cloud',
    categoryName: '永久云资源',
    provider: 'Oracle Cloud Infrastructure',
    rewardValue: '永久免费 (4核 24G ARM + 200GB 硬盘 + 10TB/月流量)',
    difficulty: '中等',
    validity: '永久有效 (Always Free)',
    requirement: '支持国际双币/多币种信用卡（Visa / Mastercard）用于验证扣款 $1 测试',
    summary: '云计算界天花板级永久免费福利，4 核 24GB 内存性能怪兽，建站与跑服务的终极神器。',
    highlights: [
      '包含最高 4 核心 Ampere A1 Compute ARM 架构处理器与 24GB 内存（可分配为 1 台 4C24G 或最多 4 台小机器）',
      '外加 2 台始终免费的 AMD x86 微型计算实例（合计最多同时拥有 6 台 VPS）',
      '提供 200GB 高性能 Block Volume 云硬盘存储空间',
      '每月赠送高达 10TB 免费出站流量，自带免费公网 IPv4 地址与 IPv6 支持',
      '支持自主安装 Docker、Nginx、Nextcloud、代理、私人知识库与各类生产级应用'
    ],
    steps: [
      '使用与信用卡持卡人姓名、真实地址一致的信息注册甲骨文云账号',
      '主区域（Home Region）建议优先选择圣何塞、凤凰城、新加坡、东京或法兰克福',
      '若提示 ABC 扣款错误，可更换干净的住宅网络 IP 或使用国内中行、招行、工行外币卡重试',
      '开通后部署实例建议使用 keepalive 脚本维持 10% 以上 CPU 占用以防空闲回收'
    ],
    targetUrl: 'https://www.oracle.com/cloud/free/',
    tags: ['永久免费', '4C24G', '神级VPS', '10TB流量', '建站必备'],
    iconName: 'cloud'
  },
  {
    id: 'cloudflare-free',
    name: 'Cloudflare 基础设施全家桶 (互联网瑞士军刀)',
    category: 'Cloud',
    categoryName: '永久云资源',
    provider: 'Cloudflare',
    rewardValue: '永久免费 (CDN + Workers 10万次/天 + Pages 无限流量 + 10GB R2)',
    difficulty: '极简',
    validity: '永久有效',
    requirement: '仅需普通邮箱注册，无需绑定任何信用卡即可使用绝大多数核心功能',
    summary: '全球出海开发者最强护城河：从全球 CDN 防御、免费 SSL、Serverless 到零信任内网穿透。',
    highlights: [
      '全球最大 CDN 节点免费接入，自带免费 Universal SSL/TLS 证书与抗 DDoS 攻击防御',
      'Cloudflare Pages：无限免费静态网站托管与极速全球边缘部署（比 Vercel 更宽松）',
      'Cloudflare Workers：每日 100,000 次边缘计算免费请求，支持运行轻量 API 与反代服务',
      'Cloudflare R2：10GB 永久免费对象存储，彻底免收昂贵的公网出站流量费（Egress Free）',
      'Cloudflare Tunnel：免费将内网或本地端口安全暴露到公网，无需公网 IP'
    ],
    steps: [
      '在域名注册商处将域名 DNS Nameservers 指向 Cloudflare',
      '开启「小黄云」Proxy 模式即可享受全站边缘加速与安全防护',
      '在 Workers & Pages 菜单中一键连接 GitHub 仓库实现自动化 CI/CD 部署'
    ],
    targetUrl: 'https://www.cloudflare.com/',
    tags: ['零门槛', '无需信用卡', '无限流量', '边缘计算', '防DDOS'],
    iconName: 'shield'
  },
  {
    id: 'google-cloud-free',
    name: 'Google Cloud 始终免费实例 (GCP e2-micro)',
    category: 'Cloud',
    categoryName: '永久云资源',
    provider: 'Google Cloud Platform',
    rewardValue: '永久免费 (1 台微型云服务器 + 30GB 硬盘 + 1GB 出站流量)',
    difficulty: '简单',
    validity: '永久有效 (Free Tier)',
    requirement: '需要绑定国际信用卡激活账号，新用户首月额外赠送 $300 试用金',
    summary: '谷歌官方承诺的始终免费云实例，适合部署探针、轻量 Telegram Bot 或 DNS 解析器。',
    highlights: [
      '每月免费赠送 1 台位于美国俄勒冈、爱荷华或南卡罗来纳的 e2-micro 实例（2 vCPU, 1GB 内存）',
      '赠送 30GB 标准永久块存储硬盘 (Standard Persistent Disk)',
      '每月提供 1GB 从北美到全球非特定地区的免费出站网络流量',
      '新用户首次注册激活额外直接送 $300 美元抵用金（有效期 90 天）'
    ],
    steps: [
      '登录 Google Cloud 控制台并绑定外币信用卡激活免费试用',
      '创建 VM 实例时机型务必选择 `e2-micro`，地区选择 `us-west1 (Oregon)`, `us-central1 (Iowa)` 或 `us-east1 (South Carolina)`',
      '磁盘类型选择标准永久性磁盘并设置为 30GB 以内即可实现 100% 零账单'
    ],
    targetUrl: 'https://cloud.google.com/free',
    tags: ['Google出品', '300刀赠金', '永久免费', '美区节点'],
    iconName: 'server'
  },
  {
    id: 'render-free',
    name: 'Render.com 免费 Docker 容器与 Web 服务',
    category: 'Cloud',
    categoryName: '永久云资源',
    provider: 'Render Services Inc.',
    rewardValue: '每月 750 小时免费实例 (可全月 24h 持续运行)',
    difficulty: '极简',
    validity: '永久有效',
    requirement: 'GitHub 账号直接授权登录，免信用卡即可部署 Web 服务',
    summary: '现代 PaaS 云平台，支持一键部署 Docker、Node.js、Python、Go 容器与静态网站。',
    highlights: [
      '每月赠送 750 小时免费 Instance 运行时间，正好够 1 个容器 720h 整月全天候运行',
      '支持从 GitHub 仓库自动拉取 Dockerfile 进行无感云端编译构建',
      '自带免费 HTTPS 泛域名二级域名（*.onrender.com）并支持绑定自定义私有域名',
      '配合自建探活保活脚本或 UptimeRobot 可轻松避免 15 分钟无请求自动休眠'
    ],
    steps: [
      '使用 GitHub 账号授权登录 render.com',
      '点击「New +」选择「Web Service」，绑定你的 GitHub 代码库',
      'Instance Type 选择「Free」，Environment 选择「Docker」，点击 Deploy 即可'
    ],
    targetUrl: 'https://render.com/',
    tags: ['Docker支持', '无需信用卡', '750小时', 'GitHub直连'],
    iconName: 'zap'
  },
  {
    id: 'github-student-pack',
    name: 'GitHub Student Developer Pack (学生开发者礼包)',
    category: 'Dev',
    categoryName: '开发利器',
    provider: 'GitHub & 合作生态伙伴',
    rewardValue: '总价值超 $1,000+ 美元开发者专属权益',
    difficulty: '中等',
    validity: '在校期间每年自动续期',
    requirement: '有效高校 edu 邮箱，或提供带有姓名日期的学生证、在读学信网在籍证明截图',
    summary: '全球学生程序员与科技爱好者最豪华福利包，含 Copilot、各大云厂商赠金与顶级域名。',
    highlights: [
      'GitHub Copilot 官方 AI 编程助手全程免费使用（原本 $10/月）',
      'JetBrains 全家桶旗舰版 IDE 每年免费授权（IntelliJ, WebStorm, PyCharm 等）',
      'DigitalOcean 赠送 $200 美元云服务器抵用券；Microsoft Azure 每年 $100 免费额度',
      'Namecheap 提供 1 年免费 .me 域名注册与免费 SSL 证书',
      'Termius 终端 SSH 工具全平台 Pro 会员免费'
    ],
    steps: [
      '使用带有学校域名的 edu 邮箱绑定 GitHub 个人账号',
      '访问 GitHub Education 页面上传带有真实姓名的学生证或英文学信网学籍在线验证报告',
      '审核通过后在 Benefits 页面一键领取各合作厂商的专属激活兑换码'
    ],
    targetUrl: 'https://education.github.com/pack',
    tags: ['Copilot免费', 'JetBrains全家桶', '200刀云额度', '免年费'],
    iconName: 'graduation-cap'
  },
  {
    id: 'jetbrains-education',
    name: 'JetBrains 全系列专业 IDE 免费教育许可',
    category: 'Dev',
    categoryName: '开发利器',
    provider: 'JetBrains s.r.o.',
    rewardValue: '价值 $779/年的 All Products Pack 商业旗舰工具包',
    difficulty: '简单',
    validity: '每年一续，毕业前均可免费续订',
    requirement: '拥有教育邮箱或国际学生证 ISIC，或学信网证明',
    summary: '软件开发工具的绝对王者，零成本使用 IDEA Ultimate、CLion、GoLand 等顶级 IDE。',
    highlights: [
      '覆盖 JetBrains 旗下全部 16 款桌面 IDE 旗舰版本：IntelliJ IDEA Ultimate, PyCharm Pro, WebStorm, GoLand, CLion, Rider, DataGrip 等',
      '全功能激活，支持所有专业版插件与远程远程开发开发工具',
      '每年期满前在官网一键发送验证邮件即可极速续订'
    ],
    steps: [
      '访问 JetBrains 官网「Free Educational Licenses」申请页面',
      '选择「University email address」填入 edu 邮箱并点击申请',
      '在学校收件箱中点击激活链接，完成 JetBrains 账户绑定并登录各 IDE'
    ],
    targetUrl: 'https://www.jetbrains.com/community/education/#students',
    tags: ['旗舰IDE', '全家桶免费', '开发利器', '每年续期'],
    iconName: 'code'
  },
  {
    id: 'eu-org-domain',
    name: 'EU.org 永久免费顶级子域名 (支持 CF NS 托管)',
    category: 'Domain',
    categoryName: '免费网络/域名',
    provider: 'EU.org Registry',
    rewardValue: '终身永久免费域名 (稳定运营超 28 年)',
    difficulty: '简单',
    validity: '永久有效 (无需年年手动续费)',
    requirement: '仅需邮箱注册申请，无需任何信用卡或实名信息',
    summary: '互联网历史上最长青的免费域名，真正被各大云厂商与 Cloudflare 官方认可为顶级域名。',
    highlights: [
      '真正被公共后缀列表 (Public Suffix List) 认可，可直接无阻接入 Cloudflare 托管完整 NS 记录',
      '支持申请任意未被占用的个性化名字（如 yourname.eu.org）',
      '不强制要求每年续费或做任务保活，属于真正意义上的永久拥有',
      '完美支持配置自定义企业邮局、个人博客、CDN 与 API 网关'
    ],
    steps: [
      '在 nic.eu.org 注册个人 Contact 账户（注意记住生成的联络 ID）',
      '在「Domain」菜单提交域名申请，Name servers 先填入两组可用 DNS（如 Cloudflare 提供的解析地址）',
      '提交后耐心等待官方人工审核（通常周期为 1 周至 1 个月左右）即可激活'
    ],
    targetUrl: 'https://nic.eu.org/',
    tags: ['永久免费', '支持CF托管', '28年老牌', '免实名'],
    iconName: 'globe'
  },
  {
    id: 'tailscale-free',
    name: 'Tailscale 免费全球私有 Mesh 组网 (3用户 100设备)',
    category: 'Domain',
    categoryName: '免费网络/域名',
    provider: 'Tailscale Inc.',
    rewardValue: '免费连接最多 100 台设备，免公网 IP 打洞互联',
    difficulty: '极简',
    validity: '永久有效',
    requirement: '使用 Google / GitHub / Microsoft 账号一键授权注册',
    summary: '基于 WireGuard 协议的最强去中心化内网穿透神器，秒连多台 VPS、家庭 NAS 与手机。',
    highlights: [
      '免费套餐支持高达 3 个独立用户与 100 台任意联网设备（VPS、Mac、Windows、手机、路由器）',
      '全自动智能 NAT 打洞，在复杂 NAT 环境下建立点对点 P2P 加密隧道，速度拉满',
      '自带全球官方 DERP 中继服务器兜底，打洞失败也能高速中转',
      '提供 MagicDNS 功能：每台机器自动分配专属域名（如 my-mac.domain.ts.net），无需记 IP'
    ],
    steps: [
      '使用 GitHub 或微软账号授权登录 tailscale.com',
      '在 VPS 上执行 `curl -fsSL https://tailscale.com/install.sh | sh` 并运行 `tailscale up`',
      '打开返回的授权链接完成绑定，各节点即可通过 100.x.y.z 私有内网 IP 相互无缝通信'
    ],
    targetUrl: 'https://tailscale.com/',
    tags: ['100台设备', 'WireGuard', '异地组网', '内网穿透'],
    iconName: 'link'
  },
  {
    id: 'ibkr-free',
    name: '盈透证券 IBKR 闲置资金生息与全球资产配置',
    category: 'Finance',
    categoryName: '出海金融福利',
    provider: 'Interactive Brokers LLC',
    rewardValue: '未投资闲置美元现金享最高 4.83% 年化活期利息',
    difficulty: '中等',
    validity: '开户即享',
    requirement: '中国大陆护照 + 身份证 + 真实地址证明，线上在线申请',
    summary: '全球规模最大的上市综合网络券商，全球投资出海必备底层账户。',
    highlights: [
      '真正美国上市券商（纳斯达克代码: IBKR），受美联储与 SIPC 最高 50 万美元官方保险',
      '闲置美元现金按市场基准利率每日计息、按月发放（当前高达 4.83% 年化），流动性极佳',
      '一个账户买遍全球 150+ 个市场（美股、港股、日股、欧股、债券、期货与外汇兑换）',
      '提供极低汇率点差货币兑换服务（比普通银行换汇划算得多）',
      '与 OCBC 华侨银行、Wise、香港银行之间出入金无缝对接'
    ],
    steps: [
      '准备好中国大陆护照与身份证原件，访问官方开户通道填写问卷',
      '上传水电费账单或信用卡电子对账单作为居住地址证明文件',
      '开立账户后可通过 Wise、香港银行 FPS 或电汇完成首次入金激活'
    ],
    targetUrl: 'https://www.interactivebrokers.com/',
    tags: ['4.8%活期', 'SIPC保险', '全球投资', '美元生息'],
    iconName: 'trending-up'
  },
  {
    id: 'schwab-debit',
    name: '嘉信理财 Charles Schwab (全球 ATM 取款免费神卡)',
    category: 'Finance',
    categoryName: '出海金融福利',
    provider: 'Charles Schwab & Co.',
    rewardValue: '全球任意 ATM 取现 100% 自动报销手续费 + 0% FTF',
    difficulty: '较高',
    validity: '永久有效',
    requirement: '需要中国大陆护照 + 入境签证或美国签证/海外地址证明，国际版需存入 $25,000 (可后续转出)',
    summary: '常年霸榜全球数字游民出境取现第一神卡，全球刷卡取现 0 手续费。',
    highlights: [
      '附带的 Schwab Bank Visa Platinum 借记卡承诺：全球任何一台支持 Visa 的 ATM 取款手续费 100% 月末自动返还到账',
      '完全无任何外币兑换手续费 (0% Foreign Transaction Fee)，完全按 Visa 实时汇率结算',
      '无账户月费、无最低结余管理费',
      '附赠功能完备的美股投资账户与专属美国支票账户（Routing & Account Number）'
    ],
    steps: [
      '访问 Charles Schwab International 国际版官方申请页面提交护照和 W-8BEN 表格',
      '审核通过后存入初始激活资金',
      '联系客服申请将实体 Visa 借记卡邮寄至国内真实地址或转运地址'
    ],
    targetUrl: 'https://international.schwab.com/',
    tags: ['全球ATM免手续费', '出境神卡', '0外币转换费', 'Visa白金'],
    iconName: 'credit-card'
  },
  {
    id: 'longbridge-bonus',
    name: '长桥证券 Longbridge (终身免佣与出海入金礼遇)',
    category: 'Finance',
    categoryName: '出海金融福利',
    provider: 'Longbridge Group',
    rewardValue: '终身免佣卡 + 最高 HK$1,000+ 现金股票礼遇',
    difficulty: '简单',
    validity: '新客专享',
    requirement: '海外银行账户（香港银行 / 新加坡 OCBC 等）或存量海外投资证明',
    summary: '新加坡与香港双持牌社交型新一代券商，极客风格界面，首充送终身美股港股免佣。',
    highlights: [
      '新用户完成首次入金达到等值 10,000 港币，直接赠送港美股「终身免佣卡」',
      '额外赠送热门科技公司碎股礼包或数百港币现金返还抵用券',
      '全中文客服响应迅速，极简开户流程，支持绑定香港 FPS 极速免费入金',
      '集成财经社交网络，海量深度研报与 AI 智能选股分析工具'
    ],
    steps: [
      '通过专属优惠链接注册手机号下载 Longbridge App',
      '上传海外银行对账单或海外券商资产证明',
      '使用香港银行户口（中银香港、汇丰、众安等）发起 eDDA 或 FPS 转账 10,000+ 港币即可解锁所有奖励'
    ],
    targetUrl: 'https://longbridgeapp.com/',
    tags: ['终身免佣', '入金送股', '港美股', 'FPS秒到'],
    iconName: 'gift'
  }
];
