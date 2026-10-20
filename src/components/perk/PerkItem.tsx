import React from 'react';
import { PerkItem as PerkItemType } from '../../types/perk';
import { getPerkArt } from '../../utils/card-art';
import { UiIcon } from '../awesome-ui/UiIcon';

interface PerkItemProps {
  perk: PerkItemType;
  onSelect: (perk: PerkItemType) => void;
}

export const PerkItem: React.FC<PerkItemProps> = ({ perk, onSelect }) => {
  const handlePointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const cardArt = getPerkArt(
    perk.id,
    perk.name,
    perk.categoryName,
    perk.provider,
    perk.rewardValue,
    perk.iconName
  );

  const subText = `${perk.categoryName} · 难度:${perk.difficulty} · ${perk.validity}`;

  return (
    <div
      className="cell"
      onClick={() => onSelect(perk)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(perk);
        }
      }}
    >
      <span className="cell-img" onPointerMove={handlePointerMove}>
        <img src={cardArt} alt={`${perk.name} 卡面`} loading="lazy" />
      </span>
      <span className="cell-meta">
        <div className="cell-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <UiIcon name={perk.iconName || 'gift'} size={15} style={{ opacity: 0.85, flexShrink: 0 }} />
          <span>{perk.name.split(' (')[0]}</span>
        </div>
        <div className="cell-sub">{subText}</div>
      </span>
    </div>
  );
};

