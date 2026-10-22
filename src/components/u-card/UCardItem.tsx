import React from 'react';
import { UCardItem as UCardItemType } from '../../types/u-card';
import { ItemStatusBadge } from '../account/ItemMarkControl';

interface UCardItemProps {
  card: UCardItemType;
  onSelect: (card: UCardItemType) => void;
}

export const UCardItem: React.FC<UCardItemProps> = ({ card, onSelect }) => {
  const { brand, net, img, detail } = card;

  const handlePointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const cashbackText = detail && detail.cashback ? `返现 ${detail.cashback}` : '';
  const subText = [net, cashbackText].filter(Boolean).join(' · ');

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
        <img src={img.startsWith('/') ? img : `/${img}`} alt={`${brand} 卡面`} loading="lazy" />
        <ItemStatusBadge itemType="u-card" itemId={card.slug} />
      </span>
      <span className="cell-meta">
        <div className="cell-name">{brand}</div>
        <div className="cell-sub">{subText}</div>
      </span>
    </div>
  );
};
