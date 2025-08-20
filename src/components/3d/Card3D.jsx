import React from 'react';

// Componente simplificado para evitar problemas de deploy
const Card3D = ({ 
  card, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  scale = 1,
  isSelected = false,
  isHovered = false,
  onClick,
  isPlayable = true,
  isEnemy = false
}) => {
  // Cores baseadas na raridade
  const getRarityColor = (rarity) => {
    const colors = {
      common: '#8B8B8B',
      rare: '#4169E1',
      super_rare: '#9932CC',
      legendary: '#FFD700'
    };
    return colors[rarity] || colors.common;
  };

  // Cores baseadas no elemento
  const getElementColor = (element) => {
    const colors = {
      'Terra': '#8B4513',
      'Água': '#006994',
      'Fogo': '#FF4500',
      'Floresta': '#228B22',
      'Vento': '#87CEEB',
      'Espírito': '#9370DB'
    };
    return colors[element] || '#FFFFFF';
  };

  return (
    <div
      className={`card-3d ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
      style={{
        transform: `translate(${position[0]}px, ${position[1]}px) rotate(${rotation[1]}rad) scale(${scale})`,
        backgroundColor: getRarityColor(card.rarity),
        borderColor: isSelected ? '#FFD700' : getElementColor(card.element),
        opacity: isPlayable ? 1 : 0.5,
        filter: isEnemy ? 'hue-rotate(180deg)' : 'none'
      }}
      onClick={onClick}
    >
      <div className="card-content">
        <div className="card-title">{card.name}</div>
        <div className="card-art">{card.art}</div>
        <div className="card-type">{card.type}</div>
        {card.type === 'Monster' && (
          <div className="card-stats">
            <span>ATK: {card.attack}</span>
            <span>DEF: {card.defense}</span>
          </div>
        )}
        <div className="card-mana">Mana: {card.manaCost}</div>
      </div>
    </div>
  );
};

export default Card3D;