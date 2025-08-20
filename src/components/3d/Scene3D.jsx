import React from 'react';

// Componente simplificado para evitar problemas de deploy
const Scene3D = ({ gameState }) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-amber-900 to-red-900 opacity-20">
      {/* Efeitos de fundo simples */}
      <div className="absolute top-10 left-8 text-8xl animate-pulse">🏹</div>
      <div className="absolute top-32 right-16 text-6xl animate-bounce">🪶</div>
      <div className="absolute bottom-20 left-16 text-7xl animate-pulse">🌳</div>
      <div className="absolute bottom-40 right-8 text-5xl animate-bounce">🐬</div>
      
      {/* Texto flutuante baseado no estado do jogo */}
      {gameState.phase === 'duel' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-yellow-400 animate-pulse">
          Turno {gameState.turnCount}
        </div>
      )}
    </div>
  );
};

export default Scene3D;