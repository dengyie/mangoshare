/**
 * ItemMarkControl — tri-state checklist control inside the five detail
 * modals. Clicking the active status again clears the mark. Guests mark
 * locally (localStorage via UserAccountProvider); logged-in users also push
 * to the account backend.
 */
import React from 'react';
import type { MyItemType } from '../../types/account';
import { useUserAccount } from '../../hooks/useUserAccount';
import { UiIcon } from '../awesome-ui/UiIcon';

interface ItemMarkControlProps {
  itemType: MyItemType;
  itemId: string;
}

const OPTIONS: { value: 'opened' | 'wanted'; label: string; icon: 'check-circle' | 'star' }[] = [
  { value: 'opened', label: '已开通', icon: 'check-circle' },
  { value: 'wanted', label: '待开通', icon: 'star' },
];

export const ItemMarkControl: React.FC<ItemMarkControlProps> = ({ itemType, itemId }) => {
  const { getItemStatus, setItemStatus, user } = useUserAccount();
  const status = getItemStatus(itemType, itemId);

  return (
    <div className="item-mark-control">
      <div className="section-label">我的标记</div>
      <div className="item-mark-options">
        {OPTIONS.map((opt) => {
          const active = status === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              className={`item-mark-option ${active ? `active active-${opt.value}` : ''}`}
              onClick={() => setItemStatus(itemType, itemId, active ? null : opt.value)}
              aria-pressed={active}
            >
              <UiIcon name={opt.icon} size={14} strokeWidth={2} />
              <span>{opt.label}</span>
              {active && <UiIcon name="x" size={11} strokeWidth={2.2} className="item-mark-clear" />}
            </button>
          );
        })}
      </div>
      <p className="item-mark-hint">
        {user
          ? '标记已同步到云端，多端登录可见'
          : '当前以游客身份记录在本地浏览器，注册 / 登录后自动同步'}
      </p>
    </div>
  );
};

/**
 * Corner badge shown on grid cells for marked items. Renders nothing while
 * unmarked so untouched grids look exactly as before.
 */
export const ItemStatusBadge: React.FC<{ itemType: MyItemType; itemId: string }> = ({
  itemType,
  itemId,
}) => {
  const { getItemStatus } = useUserAccount();
  const status = getItemStatus(itemType, itemId);
  if (!status) return null;
  return (
    <span className={`item-status-badge ${status}`}>
      <UiIcon name={status === 'opened' ? 'check' : 'star'} size={10} strokeWidth={2.5} />
      <span>{status === 'opened' ? '已开通' : '待开通'}</span>
    </span>
  );
};
