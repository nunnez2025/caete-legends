import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componente de atmosfera brasileira
export const BrazilianAtmosphereLayer = ({ region = 'Norte', intensity = 0.7, weather = null }) => {
  const [activeElements, setActiveElements] = useState([]);

  // Elementos atmosféricos por região
  const atmosphericElements = {
    Norte: [
      { icon: '🌳', size: 'text-6xl', opacity: 0.1, speed: 20 },
      { icon: '🐬', size: 'text-4xl', opacity: 0.15, speed: 15 },
      { icon: '🦋', size: 'text-3xl', opacity: 0.2, speed: 25 },
      { icon: '🌺', size: 'text-5xl', opacity: 0.1, speed: 18 },
      { icon: '🐍', size: 'text-4xl', opacity: 0.08, speed: 12 }
    ],
    Nordeste: [
      { icon: '🌵', size: 'text-5xl', opacity: 0.12, speed: 8 },
      { icon: '☀️', size: 'text-6xl', opacity: 0.1, speed: 30 },
      { icon: '🦎', size: 'text-3xl', opacity: 0.15, speed: 22 },
      { icon: '🌾', size: 'text-4xl', opacity: 0.1, speed: 16 },
      { icon: '🏺', size: 'text-4xl', opacity: 0.08, speed: 10 }
    ],
    Sudeste: [
      { icon: '🏔️', size: 'text-6xl', opacity: 0.08, speed: 5 },
      { icon: '🌲', size: 'text-5xl', opacity: 0.12, speed: 12 },
      { icon: '☁️', size: 'text-4xl', opacity: 0.15, speed: 18 },
      { icon: '🦅', size: 'text-4xl', opacity: 0.1, speed: 25 },
      { icon: '🌸', size: 'text-3xl', opacity: 0.2, speed: 20 }
    ]
  };

  const elements = atmosphericElements[region] || atmosphericElements.Norte;

  useEffect(() => {
    // Gerar elementos atmosféricos aleatórios
    const interval = setInterval(() => {
      if (activeElements.length < 15) {
        const element = elements[Math.floor(Math.random() * elements.length)];
        const newElement = {
          id: Date.now() + Math.random(),
          ...element,
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360,
          duration: 10 + Math.random() * 20
        };
        
        setActiveElements(prev => [...prev, newElement]);
        
        // Remover após duração
        setTimeout(() => {
          setActiveElements(prev => prev.filter(el => el.id !== newElement.id));
        }, newElement.duration * 1000);
      }
    }, 2000 / intensity);

    return () => clearInterval(interval);
  }, [region, intensity, elements, activeElements.length]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {activeElements.map(element => (
          <motion.div
            key={element.id}
            className={`absolute ${element.size}`}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              opacity: element.opacity
            }}
            initial={{ 
              scale: 0,
              rotate: element.rotation,
              opacity: 0
            }}
            animate={{ 
              scale: [0, 1, 1, 0],
              rotate: element.rotation + 360,
              opacity: [0, element.opacity, element.opacity, 0],
              y: [0, -50, -100, -150]
            }}
            transition={{ 
              duration: element.duration,
              ease: "linear"
            }}
          >
            {element.icon}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Efeito de clima dinâmico
export const WeatherEffect = ({ weather, intensity = 1 }) => {
  const weatherEffects = {
    'Chuva Amazônica': {
      particles: '💧',
      count: 50,
      color: 'text-blue-400',
      animation: 'rain'
    },
    'Sol Escaldante': {
      particles: '☀️',
      count: 3,
      color: 'text-yellow-400',
      animation: 'pulse'
    },
    'Vento Forte': {
      particles: '💨',
      count: 20,
      color: 'text-cyan-400',
      animation: 'wind'
    },
    'Lua Cheia': {
      particles: '🌙',
      count: 1,
      color: 'text-purple-400',
      animation: 'glow'
    },
    'Floresta Densa': {
      particles: '🍃',
      count: 30,
      color: 'text-green-400',
      animation: 'float'
    }
  };

  const effect = weatherEffects[weather];
  if (!effect) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(Math.floor(effect.count * intensity))].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${effect.color} text-2xl`}
          style={{
            left: `${Math.random() * 100}%`,
            top: effect.animation === 'rain' ? '-10%' : `${Math.random() * 100}%`
          }}
          animate={getWeatherAnimation(effect.animation)}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        >
          {effect.particles}
        </motion.div>
      ))}
    </div>
  );
};

// Componente de música ambiente
export const AmbientSoundscape = ({ region, weather, isActive }) => {
  useEffect(() => {
    if (!isActive) return;

    // Simular sons ambiente baseados na região
    const ambientSounds = {
      Norte: ['som_floresta', 'som_rios', 'som_passaros'],
      Nordeste: ['som_vento_sertao', 'som_cigarra', 'som_fogo'],
      Sudeste: ['som_montanha', 'som_chuva', 'som_vento'],
      Sul: ['som_pampas', 'som_vento_minuano'],
      CentroOeste: ['som_cerrado', 'som_pantanal']
    };

    console.log(`🎵 Reproduzindo ambiente sonoro: ${region}`);
    
    // Em produção, aqui seria implementado o sistema de áudio real
    
  }, [region, weather, isActive]);

  return null; // Componente apenas para lógica
};

// Efeito de transição entre fases
export const PhaseTransition = ({ phase, onComplete }) => {
  const phaseData = {
    draw: { icon: '🎴', text: 'FASE DE COMPRA', color: 'text-blue-400' },
    main: { icon: '⚡', text: 'FASE PRINCIPAL', color: 'text-yellow-400' },
    battle: { icon: '⚔️', text: 'FASE DE BATALHA', color: 'text-red-400' },
    end: { icon: '🏁', text: 'FASE FINAL', color: 'text-green-400' }
  };

  const data = phaseData[phase];
  if (!data) return null;

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2 }}
      onAnimationComplete={onComplete}
    >
      <div className="text-center">
        <motion.div
          className="text-9xl mb-4"
          animate={{ 
            scale: [0, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 1.5 }}
        >
          {data.icon}
        </motion.div>
        <motion.div
          className={`text-4xl font-black ${data.color}`}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2 }}
        >
          {data.text}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Efeito de combo visual
export const ComboEffect = ({ comboCount, onComplete }) => {
  if (comboCount < 2) return null;

  return (
    <motion.div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.5, 1],
        opacity: [0, 1, 1, 0]
      }}
      transition={{ duration: 2 }}
      onAnimationComplete={onComplete}
    >
      <div className="text-center">
        <div className="text-8xl mb-4 animate-pulse">⚡</div>
        <div className="text-6xl font-black text-yellow-400 mb-2">
          {comboCount}x COMBO!
        </div>
        <div className="text-2xl text-orange-300">
          {comboCount >= 5 ? 'COMBO LENDÁRIO!' :
           comboCount >= 4 ? 'COMBO ÉPICO!' :
           comboCount >= 3 ? 'COMBO INCRÍVEL!' :
           'COMBO!'}
        </div>
      </div>
    </motion.div>
  );
};

// Background dinâmico com elementos brasileiros
export const BrazilianBackground = ({ phase, element }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradiente base */}
      <motion.div
        className={`absolute inset-0 ${
          phase === 'victory' ? 'bg-gradient-to-br from-green-900 via-yellow-900 to-orange-900' :
          phase === 'defeat' ? 'bg-gradient-to-br from-red-900 via-gray-900 to-black' :
          'bg-gradient-to-br from-emerald-900 via-amber-900 to-red-900'
        }`}
        animate={{ opacity: [0.8, 1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
      />
      
      {/* Elementos decorativos fixos */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-8 text-9xl animate-pulse">🏹</div>
        <div className="absolute top-32 right-16 text-7xl animate-bounce">🪶</div>
        <div className="absolute bottom-20 left-16 text-8xl animate-pulse">🌳</div>
        <div className="absolute bottom-40 right-8 text-6xl animate-bounce">🐬</div>
        <div className="absolute top-1/2 left-1/4 text-5xl animate-spin">🌪️</div>
        <div className="absolute top-1/3 right-1/3 text-7xl animate-pulse">🔥</div>
        <div className="absolute bottom-1/3 left-1/3 text-4xl animate-bounce">👻</div>
        <div className="absolute top-2/3 right-1/4 text-5xl animate-pulse">💎</div>
      </div>

      {/* Overlay elemental dinâmico */}
      {element && (
        <motion.div
          className={`absolute inset-0 ${getElementalOverlay(element)}`}
          animate={{
            opacity: [0, 0.3, 0.1, 0.3],
            scale: [0.9, 1.1, 1, 1.05]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}
    </div>
  );
};

// Efeito de card reveal brasileiro
export const BrazilianCardReveal = ({ card, onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center max-w-2xl">
        {/* Arte da carta em destaque */}
        <motion.div
          className="text-9xl mb-8"
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ 
            scale: 1, 
            rotateY: 0,
            rotateX: [0, 10, -10, 0]
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {card.art}
        </motion.div>
        
        {/* Nome da carta */}
        <motion.h2
          className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {card.name}
        </motion.h2>
        
        {/* Descrição */}
        <motion.p
          className="text-xl text-gray-300 mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          {card.description}
        </motion.p>
        
        {/* Lore (se disponível) */}
        {card.lore && (
          <motion.div
            className="bg-black/50 p-6 rounded-xl border border-yellow-400/30 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <div className="text-yellow-400 font-bold mb-2">📜 Lenda</div>
            <div className="text-gray-300 text-lg italic leading-relaxed">
              "{card.lore}"
            </div>
          </motion.div>
        )}
        
        {/* Stats da carta */}
        {card.type === 'Criatura' && (
          <motion.div
            className="flex justify-center space-x-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{card.attack}</div>
              <div className="text-red-300">ATK</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{card.defense}</div>
              <div className="text-blue-300">DEF</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{card.level}</div>
              <div className="text-purple-300">NÍVEL</div>
            </div>
          </motion.div>
        )}
        
        {/* Botão para continuar */}
        <motion.button
          className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
        >
          Continuar
        </motion.button>
      </div>
    </motion.div>
  );
};

// Efeito de entrada épica para o menu
export const EpicMenuEntrance = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateX: -30 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotateX: 0,
        y: [0, -10, 0]
      }}
      transition={{ 
        duration: 2,
        ease: "easeOut",
        y: {
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Helpers
const getElementalOverlay = (element) => {
  const overlays = {
    'Fogo': 'bg-gradient-radial from-red-500/20 via-orange-500/10 to-transparent',
    'Água': 'bg-gradient-radial from-blue-500/20 via-cyan-500/10 to-transparent',
    'Floresta': 'bg-gradient-radial from-green-500/20 via-emerald-500/10 to-transparent',
    'Terra': 'bg-gradient-radial from-amber-500/20 via-yellow-500/10 to-transparent',
    'Vento': 'bg-gradient-radial from-cyan-500/20 via-sky-500/10 to-transparent',
    'Sombra': 'bg-gradient-radial from-purple-500/20 via-violet-500/10 to-transparent',
    'Espírito': 'bg-gradient-radial from-yellow-500/20 via-amber-500/10 to-transparent'
  };
  return overlays[element] || '';
};

const getWeatherAnimation = (type) => {
  const animations = {
    rain: {
      y: ['0vh', '110vh'],
      x: [0, -20],
      opacity: [0, 1, 1, 0]
    },
    wind: {
      x: ['-10vw', '110vw'],
      y: [0, -30, 0],
      opacity: [0, 1, 1, 0]
    },
    float: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      rotate: [0, 180, 360],
      opacity: [0.3, 1, 0.3]
    },
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5]
    },
    glow: {
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.8, 0.3],
      boxShadow: [
        '0 0 20px rgba(147, 51, 234, 0.3)',
        '0 0 40px rgba(147, 51, 234, 0.6)',
        '0 0 20px rgba(147, 51, 234, 0.3)'
      ]
    }
  };
  return animations[type] || animations.float;
};

export default BrazilianAtmosphereLayer;