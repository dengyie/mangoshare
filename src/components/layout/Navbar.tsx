import React from 'react';
import { TabType } from '../../types/common';
import { Sun, Moon, Sparkles, X, UiIcon } from '../awesome-ui/UiIcon';

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  uCardCount: number;
  simCardCount: number;
  aiStationCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  isDark,
  onToggleTheme,
  uCardCount,
  simCardCount,
  aiStationCount,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-paper/80 border-b border-white/10 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer group" onClick={() => onTabChange('u-cards')}>
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-paper-soft border border-line shadow-sm group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="MangoShare Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight text-ink">
                <span>MangoShare</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono font-medium border border-emerald-500/20">
                  PRO
                </span>
              </div>
              <p className="text-xs text-ink-muted hidden sm:block">出海卡片 · 通信 · AI 资源枢纽</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="全站检索 (卡片品牌、网络、AI模型、国家地区...)"
                className="w-full pl-9 pr-8 py-2 rounded-xl text-sm bg-paper-muted border border-white/10 text-ink placeholder-ink-subtle focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              <span className="absolute left-3 top-2.5 text-ink-subtle text-sm">
                <UiIcon name="search" size={14} strokeWidth={2} />
              </span>
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-2.5 text-ink-subtle hover:text-ink text-xs p-0.5"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Theme Switcher & Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              aria-label="切换主题"
              className="p-2 rounded-xl bg-paper-muted hover:bg-paper-card text-ink-muted hover:text-ink border border-white/10 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a
              href="mailto:dengyietech@gmail.com"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-paper-muted hover:bg-paper-card text-ink border border-white/10 font-medium transition-colors"
            >
              <span>投稿/反馈</span>
              <Sparkles size={14} className="text-emerald-500" />
            </a>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2.5 border-t border-white/5">
          {/* U Cards Tab */}
          <button
            onClick={() => onTabChange('u-cards')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium shrink-0 transition-all ${
              currentTab === 'u-cards'
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                : 'text-ink-muted hover:text-ink hover:bg-paper-muted'
            }`}
          >
            <span>U卡对比</span>
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${
                currentTab === 'u-cards' ? 'bg-white/20 text-white' : 'bg-paper-muted text-ink-subtle'
              }`}
            >
              {uCardCount}
            </span>
          </button>

          {/* SIM / eSIM Tab */}
          <button
            onClick={() => onTabChange('sim-cards')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium shrink-0 transition-all ${
              currentTab === 'sim-cards'
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                : 'text-ink-muted hover:text-ink hover:bg-paper-muted'
            }`}
          >
            <span>电话卡 / eSIM</span>
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${
                currentTab === 'sim-cards' ? 'bg-white/20 text-white' : 'bg-paper-muted text-ink-subtle'
              }`}
            >
              {simCardCount}
            </span>
          </button>

          {/* AI Hub Tab */}
          <button
            onClick={() => onTabChange('ai-hub')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium shrink-0 transition-all ${
              currentTab === 'ai-hub'
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                : 'text-ink-muted hover:text-ink hover:bg-paper-muted'
            }`}
          >
            <span>AI 公益站</span>
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${
                currentTab === 'ai-hub' ? 'bg-white/20 text-white' : 'bg-paper-muted text-ink-subtle'
              }`}
            >
              {aiStationCount}
            </span>
          </button>

          {/* Credit Cards Tab */}
          <button
            onClick={() => onTabChange('credit-cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm shrink-0 transition-all ${
              currentTab === 'credit-cards'
                ? 'bg-emerald-500 text-white font-medium'
                : 'text-ink-subtle hover:text-ink-muted'
            }`}
          >
            <span>境外信用卡</span>
            <span className="text-[10px] px-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
              精选
            </span>
          </button>

          {/* Perks Tab */}
          <button
            onClick={() => onTabChange('perks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm shrink-0 transition-all ${
              currentTab === 'perks'
                ? 'bg-emerald-500 text-white font-medium'
                : 'text-ink-subtle hover:text-ink-muted'
            }`}
          >
            <span>羊毛福利</span>
            <span className="text-[10px] px-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
              精选
            </span>
          </button>
        </div>

        {/* Mobile Search Box */}
        <div className="pb-3 md:hidden">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="全站检索关键词..."
            className="w-full px-3 py-1.5 rounded-lg text-sm bg-paper-muted border border-white/10 text-ink placeholder-ink-subtle focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>
    </header>
  );
};
