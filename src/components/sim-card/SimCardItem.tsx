import React from 'react';
import { SimCardItem as SimCardItemType } from '../../types/sim-card';
import { getSimCardArt } from '../../utils/card-art';
import { ItemStatusBadge } from '../account/ItemMarkControl';

interface SimCardItemProps {
  card: SimCardItemType;
  onSelect: (card: SimCardItemType) => void;
}

export const SimCardItem: React.FC<SimCardItemProps> = ({ card, onSelect }) => {
  const handlePointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const cardArt = getSimCardArt(card.id, card.name, card.countryCode, card.country, card.form);
  const costShort = card.maintenanceCost.split('(')[0].trim();
  const subText = `${costShort} · 免费接码 · ${card.needRealName ? '需实名' : '免实名'}`;

  return (
    <div
      className="cell"
      onClick={() => onSelect(card)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(card);
        }
      }}
    >
      <span className="cell-img" onPointerMove={handlePointerMove}>
        <img src={cardArt} alt={`${card.name} 卡面`} loading="lazy" />
        <ItemStatusBadge itemType="sim-card" itemId={card.id} />
      </span>
      <span className="cell-meta">
        <div className="cell-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', background: 'var(--paper-soft)', border: '1px solid var(--line)', color: 'var(--ink-soft)' }}>
            {card.countryCode}
          </span>
          <span>{card.name.split(' (')[0]}</span>
        </div>
        <div className="cell-sub">{subText}</div>
      </span>
    </div>
  );
};
