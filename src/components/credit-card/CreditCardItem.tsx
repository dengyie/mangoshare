import React from 'react';
import { CreditCardItem as CreditCardItemType } from '../../types/credit-card';
import { getCreditCardArt } from '../../utils/card-art';
import { ItemStatusBadge } from '../account/ItemMarkControl';

interface CreditCardItemProps {
  card: CreditCardItemType;
  onSelect: (card: CreditCardItemType) => void;
}

export const CreditCardItem: React.FC<CreditCardItemProps> = ({ card, onSelect }) => {
  const handlePointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const cardArt = getCreditCardArt(
    card.id,
    card.name,
    card.issuer,
    card.network,
    card.regionName,
    card.cardBgColor,
    card.cardTextColor
  );

  const subText = `${card.regionName} · 年费 ${card.annualFee.split(' (')[0]} · FTF ${card.foreignTxFee}`;

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
        <ItemStatusBadge itemType="credit-card" itemId={card.id} />
      </span>
      <span className="cell-meta">
        <div className="cell-name">
          <span>{card.name.split(' (')[0]}</span>
        </div>
        <div className="cell-sub">{subText}</div>
      </span>
    </div>
  );
};
