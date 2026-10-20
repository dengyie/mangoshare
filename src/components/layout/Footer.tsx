import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-white/10 bg-paper-muted/50 backdrop-blur-sm py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="Mango" className="w-6 h-6 object-contain" />
              <span className="font-bold text-lg text-ink">MangoShare</span>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed max-w-md">
              一站式出海卡片对比、全球保号通信与高可用 AI 算力中转分享平台。帮助数字游民与跨境开发者消除信息差，打造安全高性价比的个人出海资产配置。
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-ink-subtle">
              <span>品牌原属 Mango</span>
              <span>•</span>
              <a href="mailto:dengyietech@gmail.com" className="hover:text-emerald-500 underline underline-offset-4">
                dengyietech@gmail.com
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">核心板块</h4>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li><a href="#/u-cards" className="hover:text-ink">270+ 加密货币 U 卡</a></li>
              <li><a href="#/sim-cards" className="hover:text-ink">全球电话卡与 eSIM</a></li>
              <li><a href="#/ai-hub" className="hover:text-ink">活跃 AI 公益中转站</a></li>
              <li><a href="#/credit-cards" className="hover:text-ink">全球精选境外信用卡</a></li>
              <li><a href="#/perks" className="hover:text-ink">出海羊毛与永久云资源</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">免责声明与安全</h4>
            <p className="text-xs text-ink-subtle leading-relaxed">
              本站仅供出海技术交流、学术研究与信息整理，不对各第三方服务商的充值费率、KYC合规政策及资产安全性作任何担保。请用户自行遵守所在司法辖区的法律法规，理性评估资金与账户风控。
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-subtle gap-4">
          <p>© {new Date().getFullYear()} MangoShare (share.mangoqwq.com). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Vite + React + Awesome-UI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
