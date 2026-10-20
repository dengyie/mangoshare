import React, { useState } from 'react';
import { loginAdmin, AdminSession } from '../../utils/admin-auth';
import { useModalLock } from '../../utils/use-modal-lock';
import { UiIcon } from '../awesome-ui/UiIcon';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoint: string;
  onLogin: (session: AdminSession) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  endpoint,
  onLogin,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useModalLock(isOpen, onClose);

  if (!isOpen) return null;

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
      const session = await loginAdmin(endpoint, username.trim(), password);
      setPassword('');
      onLogin(session);
      onClose();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : '登录失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="管理员登录"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UiIcon name="shield" size={15} className="text-[var(--ink)]" />
            <h3 className="text-sm font-semibold tracking-wide text-[var(--ink)]">管理员登录</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[var(--ink-soft)] hover:bg-[var(--paper-soft)] hover:text-[var(--ink)]"
            aria-label="关闭登录弹窗"
          >
            <UiIcon name="x" size={14} />
          </button>
        </div>

        <p className="mb-4 text-xs leading-relaxed text-[var(--ink-soft)]">
          使用 API 站点（<span className="font-mono">{endpoint}</span>）的管理员账号登录后，方可进行站点导入更新、拓扑配置等管理操作。会话有效期与后端登录令牌一致。
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-[var(--ink-soft)]">
            用户名
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
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
      </div>
    </div>
  );
};
