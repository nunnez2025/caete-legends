import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componente de partículas premium
export const ParticleSystem = ({ effects, onEffectComplete }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {effects.map(effect => (
          <motion.div
            key={effect.id}
            initial={{ 
              opacity: 0, 
              scale: 0,
              x: effect.position.x + '%',
              y: effect.position.y + '%'
            }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0, 1.2, 1, 0],
              rotate: [0, 180, 360]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: effect.duration / 1000, ease: "easeOut" }}
            className="absolute"
            onAnimationComplete={() => onEffectComplete(effect.id)}
          >
            <div className={`text-6xl ${getEffectColor(effect.type)}`}>
              {getEffectIcon(effect.type)}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Efeito de screen shake premium
export const ScreenShakeEffect = ({ isActive, intensity = 'medium', children }) => {
  const shakeVariants = {
    idle: { x: 0, y: 0 },
    light: { 
      x: [-2, 2, -2, 2, 0],
      y: [-1, 1, -1, 1, 0],
      transition: { duration: 0.3 }
    },
    medium: { 
      x: [-5, 5, -5, 5, 0],
      y: [-3, 3, -3, 3, 0],
      transition: { duration: 0.5 }
    },
    heavy: { 
      x: [-10, 10, -8, 8, -6, 6, 0],
      y: [-6, 6, -4, 4, -2, 2, 0],
      transition: { duration: 0.8 }
    }
  };

  return (
    <motion.div
      animate={isActive ? intensity : 'idle'}
      variants={shakeVariants}
    >
      {children}
    </motion.div>
  );
};

// Efeito de glow atmosférico
export const AtmosphericGlow = ({ element, intensity = 0.5 }) => {
  const glowColors = {
    'Fogo': 'from-red-500/30 via-orange-500/20 to-yellow-500/10',
    'Água': 'from-blue-500/30 via-cyan-500/20 to-teal-500/10',
    'Floresta': 'from-green-500/30 via-emerald-500/20 to-lime-500/10',
    'Terra': 'from-amber-500/30 via-yellow-500/20 to-orange-500/10',
    'Vento': 'from-cyan-500/30 via-sky-500/20 to-blue-500/10',
    'Sombra': 'from-purple-500/30 via-violet-500/20 to-indigo-500/10',
    'Espírito': 'from-yellow-500/30 via-amber-500/20 to-orange-500/10',
    'Luz': 'from-white/30 via-yellow-500/20 to-orange-500/10'
  };

  if (!element) return null;

  return (
    <motion.div
      className={`absolute inset-0 bg-gradient-radial ${glowColors[element]} pointer-events-none`}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, intensity, intensity * 0.7, intensity, 0],
        scale: [0.8, 1.2, 1, 1.1, 0.9]
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    />
  );
};

// Efeito de transição cinematográfica
export const CinematicTransition = ({ isActive, type = 'fade', duration = 1000, children }) => {
  const transitionVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { x: '100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '-100%', opacity: 0 }
    },
    zoom: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 1.2, opacity: 0 }
    },
    epic: {
      initial: { 
        scale: 0.5, 
        opacity: 0, 
        rotateY: -90,
        filter: 'blur(10px)'
      },
      animate: { 
        scale: 1, 
        opacity: 1, 
        rotateY: 0,
        filter: 'blur(0px)'
      },
      exit: { 
        scale: 1.1, 
        opacity: 0, 
        rotateY: 90,
        filter: 'blur(5px)'
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          variants={transitionVariants[type]}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: duration / 1000, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Efeito de carta sendo invocada
export const CardSummonEffect = ({ card, position, onComplete }) => {
  return (
    <motion.div
      className="absolute z-50 pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ 
        scale: 0,
        opacity: 0,
        rotateY: -180
      }}
      animate={{ 
        scale: [0, 1.5, 1],
        opacity: [0, 1, 1, 0],
        rotateY: [180, 0, 0, 0],
        y: [0, -20, -10, 0]
      }}
      transition={{ 
        duration: 2,
        times: [0, 0.3, 0.7, 1],
        ease: "easeOut"
      }}
      onAnimationComplete={onComplete}
    >
      <div className="text-center">
        <div className="text-8xl mb-4 animate-pulse">{card.art}</div>
        <div className="bg-black/90 backdrop-blur-lg rounded-xl p-4 border-2 border-yellow-400">
          <div className="text-2xl font-bold text-yellow-400 mb-2">{card.name}</div>
          <div className="text-lg text-white">Invocado!</div>
        </div>
      </div>
    </motion.div>
  );
};

// Efeito de dano flutuante avançado
export const AdvancedFloatingText = ({ texts, onTextComplete }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {texts.map(text => (
          <motion.div
            key={text.id}
            className={`absolute font-black text-2xl ${text.color} ${text.shadow ? 'drop-shadow-2xl' : ''}`}
            style={{
              left: `${text.position.x}%`,
              top: `${text.position.y}%`
            }}
            initial={{ 
              opacity: 0, 
              scale: 0.5,
              y: 0
            }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1, 0.8],
              y: [-50, -100, -120, -150]
            }}
            transition={{ 
              duration: 3,
              times: [0, 0.2, 0.8, 1],
              ease: "easeOut"
            }}
            onAnimationComplete={() => onTextComplete(text.id)}
          >
            <div className="relative">
              {text.glow && (
                <div className={`absolute inset-0 ${text.color} blur-lg opacity-50`}>
                  {text.text}
                </div>
              )}
              <div className="relative z-10">
                {text.text}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Efeito de background dinâmico
export const DynamicBackground = ({ phase, element, intensity = 0.3 }) => {
  const backgroundEffects = {
    menu: 'from-emerald-900 via-amber-900 to-red-900',
    duel: 'from-slate-900 via-gray-900 to-black',
    victory: 'from-green-900 via-yellow-900 to-orange-900',
    defeat: 'from-red-900 via-gray-900 to-black'
  };

  const elementalOverlays = {
    'Fogo': 'from-red-500/20 via-orange-500/10 to-transparent',
    'Água': 'from-blue-500/20 via-cyan-500/10 to-transparent',
    'Floresta': 'from-green-500/20 via-emerald-500/10 to-transparent',
    'Terra': 'from-amber-500/20 via-yellow-500/10 to-transparent',
    'Vento': 'from-cyan-500/20 via-sky-500/10 to-transparent',
    'Sombra': 'from-purple-500/20 via-violet-500/10 to-transparent',
    'Espírito': 'from-yellow-500/20 via-amber-500/10 to-transparent'
  };

  return (
    <div className="absolute inset-0">
      {/* Background base */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${backgroundEffects[phase] || backgroundEffects.menu}`}
        animate={{
          opacity: [0.8, 1, 0.9, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Overlay elemental */}
      {element && (
        <motion.div
          className={`absolute inset-0 bg-gradient-radial ${elementalOverlays[element]}`}
          animate={{
            opacity: [0, intensity, intensity * 0.7, intensity],
            scale: [0.9, 1.1, 1, 1.05]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}
      
      {/* Partículas de fundo */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [-20, -40, -60]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Efeito de carta premium
export const PremiumCardEffect = ({ card, isSelected, isHovered, children }) => {
  const rarityEffects = {
    'Mítica': {
      glow: 'shadow-2xl shadow-purple-500/50',
      border: 'border-gradient-to-r from-purple-400 via-pink-400 to-purple-400',
      animation: 'animate-pulse'
    },
    'Lendária': {
      glow: 'shadow-xl shadow-red-500/40',
      border: 'border-red-400',
      animation: 'animate-pulse'
    },
    'Ultra Rara': {
      glow: 'shadow-lg shadow-pink-500/30',
      border: 'border-pink-400',
      animation: ''
    },
    'Super Rara': {
      glow: 'shadow-lg shadow-purple-500/30',
      border: 'border-purple-400',
      animation: ''
    },
    'Rara': {
      glow: 'shadow-md shadow-blue-500/20',
      border: 'border-blue-400',
      animation: ''
    },
    'Comum': {
      glow: '',
      border: 'border-gray-400',
      animation: ''
    }
  };

  const effect = rarityEffects[card.rarity] || rarityEffects['Comum'];

  return (
    <motion.div
      className={`relative ${effect.glow} ${effect.animation}`}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        z: 50
      }}
      whileTap={{ scale: 0.95 }}
      animate={isSelected ? { 
        scale: 1.1,
        rotateY: [0, 5, -5, 0],
        boxShadow: "0 0 30px rgba(255, 255, 0, 0.6)"
      } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      {/* Efeito de brilho para cartas raras */}
      {(card.rarity === 'Lendária' || card.rarity === 'Mítica') && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        />
      )}
      
      {children}
    </motion.div>
  );
};

// Efeito de batalha cinematográfica
export const CinematicBattleEffect = ({ attacker, defender, onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        {/* Atacante */}
        <motion.div
          className="text-8xl mb-8"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {attacker.art}
        </motion.div>
        
        {/* VS */}
        <motion.div
          className="text-6xl font-black text-yellow-400 mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          ⚔️ VS ⚔️
        </motion.div>
        
        {/* Defensor */}
        <motion.div
          className="text-8xl mb-8"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {defender.art}
        </motion.div>

        {/* Efeito de impacto */}
        <motion.div
          className="text-9xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 2, 1],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 1, delay: 1 }}
          onAnimationComplete={onComplete}
        >
          💥
        </motion.div>
      </div>
    </motion.div>
  );
};

// Loading screen Netflix-style
export const NetflixLoader = ({ isLoading, progress = 0 }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            {/* Logo animado */}
            <motion.div
              className="text-8xl mb-8"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              👑
            </motion.div>
            
            {/* Título */}
            <motion.h1
              className="text-4xl font-black bg-gradient-to-r from-emerald-300 via-yellow-300 to-red-300 bg-clip-text text-transparent mb-8"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              CAETÉ LEGENDS
            </motion.h1>
            
            {/* Barra de progresso */}
            <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="text-white/70">
              Carregando lendas brasileiras... {progress}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Efeito de vitória épica
export const EpicVictoryEffect = ({ isActive, stats }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Chuva de confetes */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'][Math.floor(Math.random() * 5)]
              }}
              initial={{ y: -100, opacity: 0, rotate: 0 }}
              animate={{ 
                y: window.innerHeight + 100,
                opacity: [0, 1, 1, 0],
                rotate: 360 * 3
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: "easeIn"
              }}
            />
          ))}
          
          {/* Fogos de artifício */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`firework-${i}`}
              className="absolute text-6xl"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 2, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.3,
                ease: "easeOut"
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helpers
const getEffectColor = (type) => {
  const colors = {
    fire: 'text-red-500',
    water: 'text-blue-500',
    wind: 'text-cyan-500',
    earth: 'text-amber-500',
    shadow: 'text-purple-500',
    spirit: 'text-yellow-500',
    magic: 'text-pink-500'
  };
  return colors[type] || 'text-white';
};

const getEffectIcon = (type) => {
  const icons = {
    fire: '🔥',
    water: '💧',
    wind: '🌪️',
    earth: '🪨',
    shadow: '👻',
    spirit: '✨',
    magic: '🔮'
  };
  return icons[type] || '⭐';
};

export {
  getEffectColor,
  getEffectIcon
};