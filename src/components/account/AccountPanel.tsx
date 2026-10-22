import React, { useMemo, useState } from 'react';
import { AiStationItem as AiStationItemType } from '../../types/ai-station';
import { ApiStationStatus } from '../../types/api-sync';
import { analyzeTopology } from '../../utils/api-station-sync';
import {
  AdminSession,
  completeAdminLogin,
  startAdminLogin,
} from '../../utils/admin-auth';
import { ApiSyncPanel } from '../ai-hub/ApiSyncPanel';
import { BestConfigModal } from '../ai-hub/BestConfigModal';
import { StationImportModal } from '../ai-hub/StationImportModal';
import { UiIcon } from '../awesome-ui/UiIcon';

interface AccountPanelProps {
  endpoint: string;
  onEndpointChange: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  statusData: ApiStationStatus | null;
  models: string[];
  stations: AiStationItemType[];
  onRefresh: () => void;
  onPersistStations: (newStations: AiStationItemType[]) => void;
  onResetStations: () => void;
  isAdmin: boolean;
  adminSession: AdminSession | null;
  onLogin: (session: AdminSession) => void;
  onLogout: () => void;
}

/**
 * 用户 tab: the single login + management surface. Visitors see only the
 * login form; the entire management console (ApiSyncPanel, import/update,
 * best-config topology) renders exclusively for a verified admin session.
 */
export const AccountPanel: React.FC<AccountPanelProps> = ({
  endpoint,
  onEndpointChange,
  isLoading,
  error,
  statusData,
  models,
  stations,
  onRefresh,
  onPersistStations,
  onResetStations,
  isAdmin,
  adminSession,
  onLogin,
  onLogout,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingFlowToken, setPendingFlowToken] = useState<string | null>(null);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isBestConfigOpen, setIsBestConfigOpen] = useState(false);

  const topologyAnalysis = useMemo(
    () => analyzeTopology(models, stations),
    [models, stations]
  );

  const domainDisplay = (() => {
    try {
      const u = new URL(endpoint.startsWith('http') ? endpoint : `https://${endpoint}`);
      return u.hostname;
    } catch {
      return endpoint;
    }
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!username.trim() || !password) {
      setErrorMessage('请输入用户名与密码');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const attempt = await startAdminLogin(endpoint, username.trim(), password);
      if (attempt.kind === 'session') {
        setPassword('');
        setUsername('');
        onLogin(attempt.session);
      } else {
        setPassword('');
        setPendingFlowToken(attempt.flowToken);
        setErrorMessage(null);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : '登录失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTwoFaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !pendingFlowToken) return;
    if (!twoFaCode.trim()) {
      setErrorMessage('请输入两步验证码');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const session = await completeAdminLogin(
        endpoint,
        pendingFlowToken,
        twoFaCode,
        username.trim()
      );
      setTwoFaCode('');
      setPendingFlowToken(null);
      setUsername('');
      onLogin(session);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : '验证失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelTwoFa = () => {
    setPendingFlowToken(null);
    setTwoFaCode('');
    setErrorMessage(null);
  };

  // ---- Visitor view: login form only, zero management surface ----------
  if (!isAdmin) {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4 rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <UiIcon name="shield" size={15} className="text-[var(--ink)]" />
          <h2 className="text-sm font-semibold tracking-wide text-[var(--ink)]">
            {pendingFlowToken ? '两步验证' : '管理员登录'}
          </h2>
        </div>

        {pendingFlowToken ? (
          <>
            <p className="text-xs leading-relaxed text-[var(--ink-soft)]">
              账号 <span className="font-mono">{username}</span> 已开启两步验证。
              请输入认证器 App 生成的 6 位动态码，或使用备用恢复码完成登录。
            </p>
            <form onSubmit={handleTwoFaSubmit} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-xs font-medium text-[var(--ink-soft)]">
                动态验证码
                <input
                  type="text"
                  value={twoFaCode}
                  onChange={(e) => setTwoFaCode(e.target.value)}
                  autoComplete="one-time-code"
                  autoFocus
                  inputMode="text"
                  className="rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 font-mono text-sm tracking-widest text-[var(--ink)] outline-none focus:border-[var(--ink)]"
                  placeholder="6 位动态码或备用码"
                />
              </label>

              {errorMessage && (
                <div className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                  <UiIcon name="alert-triangle" size={13} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="mt-1 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--ink)] px-4 py-2 text-sm font-medium text-[var(--paper)] transition-all hover:opacity-90 active:scale-[0.98] ${
                    isSubmitting ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                >
                  <UiIcon name="lock" size={14} className={isSubmitting ? 'animate-pulse' : ''} />
                  <span>{isSubmitting ? '正在验证…' : '验证并登录'}</span>
                </button>
                <button
                  type="button"
                  onClick={cancelTwoFa}
                  className="rounded-lg border border-[var(--line)] px-3 py-2 text-xs text-[var(--ink-soft)] transition-colors hover:bg-[var(--paper-muted)] hover:text-[var(--ink)]"
                >
                  返回
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <p className="text-xs leading-relaxed text-[var(--ink-soft)]">
              使用 API 站点（<span className="font-mono">{domainDisplay}</span>）的管理员账号登录后，
              可进行公益站拓扑更新、渠道导入与最佳配置等管理操作。普通访客无需登录，
              浏览其他标签页即可；会话有效期与后端登录令牌一致（15 分钟）。
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-xs font-medium text-[var(--ink-soft)]">
                用户名
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--ink)]"
                  placeholder="API 站管理员用户名"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-[var(--ink-soft)]">
                密码
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--ink)]"
                  placeholder="API 站管理员密码"
                />
              </label>

              {errorMessage && (
                <div className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                  <UiIcon name="alert-triangle" size={13} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--ink)] px-4 py-2 text-sm font-medium text-[var(--paper)] transition-all hover:opacity-90 active:scale-[0.98] ${
                  isSubmitting ? 'cursor-not-allowed opacity-60' : ''
                }`}
              >
                <UiIcon name="shield" size={14} className={isSubmitting ? 'animate-pulse' : ''} />
                <span>{isSubmitting ? '正在验证…' : '登录管理员'}</span>
              </button>
            </form>
          </>
        )}
      </div>
    );
  }

  // ---- Admin view: full management console -----------------------------
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <UiIcon name="shield" size={14} className="text-emerald-600" />
          <h2 className="text-sm font-semibold tracking-wide text-[var(--ink)]">管理中心</h2>
          <span className="rounded-full border border-emerald-200 bg-emerald-50/70 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            {adminSession?.displayName || '管理员'}
          </span>
        </div>
        <p className="text-xs text-[var(--ink-soft)]">
          已登录 <span className="font-mono">{adminSession?.username}</span>（角色{' '}
          {adminSession?.role}），关联站点{' '}
          <span className="font-mono">{domainDisplay}</span>。当前 AI 公益站展示{' '}
          {stations.length} 个节点，管理操作全部集中在本页。
        </p>
      </div>

      <ApiSyncPanel
        endpoint={endpoint}
        onEndpointChange={onEndpointChange}
        isLoading={isLoading}
        error={error}
        statusData={statusData}
        modelCount={models.length}
        onRefresh={onRefresh}
        onOpenBestConfig={() => setIsBestConfigOpen(true)}
        onOpenImport={() => setIsImportModalOpen(true)}
        adminDisplayName={adminSession?.displayName}
        onAdminLogout={onLogout}
      />

      {/* Best Public Station Config Modal */}
      <BestConfigModal
        isOpen={isBestConfigOpen}
        onClose={() => setIsBestConfigOpen(false)}
        analysis={topologyAnalysis}
        apiEndpoint={endpoint}
      />

      {/* Station Import & Update Management Modal */}
      <StationImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        currentStations={stations}
        apiModels={models}
        apiEndpoint={endpoint}
        onUpdateStations={onPersistStations}
        onResetDefaults={onResetStations}
      />
    </div>
  );
};
