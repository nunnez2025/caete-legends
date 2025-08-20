import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Sword, Shield, Zap, Heart, Star, Flame, Crown, Skull, Mountain, TreePine,
  Sparkles, Target, Timer, RotateCcw, PlayCircle, Trophy, Gem,
  Check, Lock, Waves, Wind, Eye, Award
} from 'lucide-react';
import { getCardById, createBalancedDeck } from '../../game/brazilian-folklore-cards';

const CaeteLegendsNetflixPro = () => {
  // Estados do jogo
  const [gameState, setGameState] = useState({
    phase: 'menu',
    turn: 'player',
    turnCount: 1,
    playerLifePoints: 8000,
    enemyLifePoints: 8000,
    playerMana: 4,
    enemyMana: 4,
    maxMana: 10,
    battleLog: [],
    playerWins: parseInt(localStorage.getItem('caete_wins') || '0'),
    playerLosses: parseInt(localStorage.getItem('caete_losses') || '0'),
    streak: parseInt(localStorage.getItem('caete_streak') || '0'),
    spellsCast: 0,
    monstersDefeated: 0,
    gameTime: 0,
    difficulty: 'Médio',
    soundEnabled: true,
    musicEnabled: true
  });

  const [playerDeck, setPlayerDeck] = useState([]);
  const [enemyDeck, setEnemyDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [enemyHand, setEnemyHand] = useState([]);
  const [playerField, setPlayerField] = useState([null, null, null, null, null]);
  const [enemyField, setEnemyField] = useState([null, null, null, null, null]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [gameTimer, setGameTimer] = useState(0);

  // Salvar progresso
  useEffect(() => {
    localStorage.setItem('caete_wins', gameState.playerWins.toString());
    localStorage.setItem('caete_losses', gameState.playerLosses.toString());
    localStorage.setItem('caete_streak', gameState.streak.toString());
  }, [gameState.playerWins, gameState.playerLosses, gameState.streak]);

  // Texto flutuante
  const addFloatingText = useCallback((text, color = 'text-yellow-400') => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { 
      id, text, color, 
      position: { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 }
    }]);
    setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const canAfford = useCallback((card, isPlayer = true) => {
    if (!card?.manaCost) return true;
    const mana = isPlayer ? gameState.playerMana : gameState.enemyMana;
    return mana >= card.manaCost;
  }, [gameState.playerMana, gameState.enemyMana]);

  const drawCard = useCallback((isPlayer, count = 1) => {
    for (let i = 0; i < count; i++) {
      if (isPlayer && playerDeck.length > 0) {
        setPlayerDeck(prev => {
          const newDeck = [...prev];
          const drawnCard = newDeck.shift();
          setPlayerHand(hand => hand.length >= 7 ? hand : [...hand, drawnCard]);
          return newDeck;
        });
      } else if (!isPlayer && enemyDeck.length > 0) {
        setEnemyDeck(prev => {
          const newDeck = [...prev];
          const drawnCard = newDeck.shift();
          setEnemyHand(hand => [...hand, drawnCard]);
          return newDeck;
        });
      }
    }
  }, [playerDeck, enemyDeck]);

  const summonCreature = useCallback((cardId, position, isPlayer = true) => {
    const card = getCardById(cardId);
    if (!card || card.type !== 'Criatura' || !canAfford(card, isPlayer)) return false;

    const tributesNeeded = Math.max(0, card.level - 4);
    if (tributesNeeded > 0) {
      const field = isPlayer ? playerField : enemyField;
      if (field.filter(c => c !== null).length < tributesNeeded) {
        addFloatingText(`❌ Precisa de ${tributesNeeded} tributos!`, 'text-red-400');
        return false;
      }
      
      const fieldSetter = isPlayer ? setPlayerField : setEnemyField;
      fieldSetter(prev => {
        const newField = [...prev];
        let removed = 0;
        for (let i = 0; i < newField.length && removed < tributesNeeded; i++) {
          if (newField[i]) { newField[i] = null; removed++; }
        }
        return newField;
      });
    }

    setGameState(prev => ({
      ...prev,
      [isPlayer ? 'playerMana' : 'enemyMana']: prev[isPlayer ? 'playerMana' : 'enemyMana'] - card.manaCost
    }));

    const summoned = { ...card, id: cardId, canAttack: false, attackedThisTurn: false };

    if (isPlayer) {
      setPlayerField(prev => { const newField = [...prev]; newField[position] = summoned; return newField; });
      setPlayerHand(prev => prev.filter(c => c !== cardId));
    } else {
      setEnemyField(prev => { const newField = [...prev]; newField[position] = summoned; return newField; });
      setEnemyHand(prev => prev.filter(c => c !== cardId));
    }

    addFloatingText(`✨ ${card.name} Invocado!`, 'text-blue-400');

    setGameState(prev => ({
      ...prev,
      battleLog: [...prev.battleLog, {
        id: Date.now(),
        message: `${isPlayer ? '🏹 Você invocou' : '👹 Oponente invocou'} ${card.name}! (ATK: ${card.attack}/DEF: ${card.defense})`,
        timestamp: Date.now(),
        type: 'summon',
        rarity: card.rarity
      }]
    }));

    return true;
  }, [gameState.playerMana, gameState.enemyMana, playerField, enemyField, canAfford, addFloatingText]);

  const castSpell = useCallback((cardId, isPlayer = true) => {
    const card = getCardById(cardId);
    if (!card || card.type !== 'Magia' || !canAfford(card, isPlayer)) return false;

    setGameState(prev => ({
      ...prev,
      [isPlayer ? 'playerMana' : 'enemyMana']: prev[isPlayer ? 'playerMana' : 'enemyMana'] - card.manaCost,
      spellsCast: prev.spellsCast + 1
    }));

    if (isPlayer) {
      setPlayerHand(prev => prev.filter(c => c !== cardId));
    } else {
      setEnemyHand(prev => prev.filter(c => c !== cardId));
    }

    // Efeitos das magias
    if (card.id === 'furia_boitata') {
      setGameState(prev => ({
        ...prev,
        [isPlayer ? 'enemyLifePoints' : 'playerLifePoints']: prev[isPlayer ? 'enemyLifePoints' : 'playerLifePoints'] - 1000
      }));
      addFloatingText('🐍🔥 Fúria do Boitatá!', 'text-red-400');
    } else if (card.id === 'bencao_curupira') {
      addFloatingText('🌿 Proteção da Floresta!', 'text-green-400');
    }

    addFloatingText(`🔮 ${card.name}!`, 'text-purple-400');
    return true;
  }, [gameState.playerMana, gameState.enemyMana, canAfford, addFloatingText]);

  const advancedAI = useCallback(() => {
    if (gameState.turn !== 'enemy' || gameState.phase !== 'duel') return;

    setTimeout(() => {
      const creaturesInHand = enemyHand
        .map(cardId => getCardById(cardId))
        .filter(card => card && card.type === 'Criatura' && canAfford(card, false));

      if (creaturesInHand.length > 0) {
        const chosenCreature = gameState.difficulty === 'Lendário' 
          ? creaturesInHand.reduce((strongest, current) => current.attack > strongest.attack ? current : strongest)
          : creaturesInHand[0];
        
        const emptySlot = enemyField.findIndex(slot => slot === null);
        if (emptySlot !== -1) {
          const cardId = enemyHand.find(id => getCardById(id)?.id === chosenCreature.id);
          summonCreature(cardId, emptySlot, false);
        }
      }

      setTimeout(() => {
        const attackingCreatures = enemyField.filter(creature => creature !== null);
        
        attackingCreatures.forEach((creature, index) => {
          setTimeout(() => {
            const damage = creature.attack;
            setGameState(prev => ({
              ...prev,
              playerLifePoints: prev.playerLifePoints - damage,
              battleLog: [...prev.battleLog, {
                id: Date.now(),
                message: `💀 ${creature.name} atacou diretamente! ${damage} de dano!`,
                timestamp: Date.now(),
                type: 'direct_attack'
              }]
            }));
            addFloatingText(`💥 -${damage} LP!`, 'text-red-500');
          }, index * 800);
        });

        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            turn: 'player',
            turnCount: prev.turnCount + 1,
            playerMana: Math.min(prev.maxMana, 4 + Math.floor(prev.turnCount / 2)),
            enemyMana: Math.min(prev.maxMana, 4 + Math.floor(prev.turnCount / 2))
          }));
          
          setEnemyField(prev => prev.map(c => c ? { ...c, canAttack: true, attackedThisTurn: false } : c));
          drawCard(true, 1);
          addFloatingText('🔄 Seu Turno!', 'text-blue-400');
        }, attackingCreatures.length * 800 + 1500);
      }, 1000);
    }, 2000);
  }, [gameState, enemyHand, enemyField, canAfford, summonCreature, drawCard, addFloatingText]);

  const endTurn = useCallback(() => {
    setPlayerField(prev => prev.map(c => c ? { ...c, canAttack: true, attackedThisTurn: false } : c));
    setGameState(prev => ({
      ...prev,
      turn: 'enemy',
      enemyMana: Math.min(prev.maxMana, 4 + Math.floor(prev.turnCount / 2))
    }));
    drawCard(false, 1);
    addFloatingText('🔄 Turno do Inimigo', 'text-red-400');
  }, [drawCard, addFloatingText]);

  const startDuel = useCallback((difficulty = 'Médio') => {
    const newPlayerDeck = createBalancedDeck();
    const newEnemyDeck = createBalancedDeck();
    
    setPlayerDeck(newPlayerDeck);
    setEnemyDeck(newEnemyDeck);
    
    const weatherEffects = ['Chuva Amazônica', 'Sol Escaldante', 'Vento Forte', 'Lua Cheia', 'Floresta Densa'];
    const randomWeather = weatherEffects[Math.floor(Math.random() * weatherEffects.length)];
    
    setGameState(prev => ({
      ...prev,
      phase: 'duel',
      turn: 'player',
      turnCount: 1,
      playerLifePoints: 8000,
      enemyLifePoints: 8000,
      playerMana: 4,
      enemyMana: 4,
      difficulty,
      currentWeather: randomWeather,
      battleLog: [{
        id: 1,
        message: `🏹⚔️ Duelo épico iniciado sob ${randomWeather}! Que as lendas brasileiras despertem!`,
        timestamp: Date.now(),
        type: 'game_start'
      }],
      spellsCast: 0,
      monstersDefeated: 0,
      gameTime: 0
    }));

    setPlayerHand([]);
    setEnemyHand([]);
    setPlayerField([null, null, null, null, null]);
    setEnemyField([null, null, null, null, null]);
    setSelectedCard(null);
    setFloatingTexts([]);
    setGameTimer(0);

    setTimeout(() => {
      drawCard(true, 5);
      drawCard(false, 5);
      addFloatingText('🎴 Cartas distribuídas!', 'text-cyan-400');
    }, 500);
  }, [drawCard, addFloatingText]);

  useEffect(() => {
    if (gameState.phase === 'duel') {
      if (gameState.playerLifePoints <= 0) {
        setGameState(prev => ({ 
          ...prev, 
          phase: 'defeat',
          playerLosses: prev.playerLosses + 1,
          streak: 0
        }));
      } else if (gameState.enemyLifePoints <= 0) {
        setGameState(prev => ({ 
          ...prev, 
          phase: 'victory',
          playerWins: prev.playerWins + 1,
          streak: prev.streak + 1
        }));
      }
    }
  }, [gameState.playerLifePoints, gameState.enemyLifePoints, gameState.phase]);

  useEffect(() => {
    if (gameState.turn === 'enemy') advancedAI();
  }, [gameState.turn, advancedAI]);

  useEffect(() => {
    let interval;
    if (gameState.phase === 'duel') {
      interval = setInterval(() => {
        setGameTimer(prev => prev + 1);
        setGameState(prev => ({ ...prev, gameTime: prev.gameTime + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.phase]);

  const getRarityColor = (rarity) => ({
    'Comum': 'border-gray-400 bg-gradient-to-br from-gray-800 to-gray-900',
    'Rara': 'border-blue-400 bg-gradient-to-br from-blue-800 to-blue-900',
    'Super Rara': 'border-purple-400 bg-gradient-to-br from-purple-800 to-purple-900',
    'Ultra Rara': 'border-pink-400 bg-gradient-to-br from-pink-800 to-purple-900 animate-pulse',
    'Lendária': 'border-red-400 bg-gradient-to-br from-red-800 via-orange-800 to-yellow-800 animate-pulse',
    'Mítica': 'border-yellow-400 bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-800 animate-pulse shadow-2xl'
  }[rarity] || 'border-gray-400 bg-gray-800');

  const getElementIcon = (element) => ({
    'Terra': <Mountain className="w-4 h-4 text-amber-500" />,
    'Água': <Waves className="w-4 h-4 text-blue-400" />,
    'Fogo': <Flame className="w-4 h-4 text-red-500" />,
    'Floresta': <TreePine className="w-4 h-4 text-green-500" />,
    'Vento': <Wind className="w-4 h-4 text-cyan-400" />,
    'Sombra': <Eye className="w-4 h-4 text-purple-400" />,
    'Espírito': <Sparkles className="w-4 h-4 text-yellow-400" />
  }[element] || <Star className="w-4 h-4 text-gray-400" />);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-amber-900 to-red-900 text-white relative overflow-hidden">
      
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 opacity-10">
        <motion.div className="absolute top-10 left-8 text-8xl" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>🏹</motion.div>
        <motion.div className="absolute top-32 right-16 text-6xl" animate={{ y: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity }}>🪶</motion.div>
        <motion.div className="absolute bottom-20 left-16 text-7xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }}>🌳</motion.div>
        <motion.div className="absolute bottom-40 right-8 text-5xl" animate={{ x: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }}>🐬</motion.div>
      </div>

      {/* Textos flutuantes */}
      <AnimatePresence>
        {floatingTexts.map(text => (
          <motion.div
            key={text.id}
            className={`fixed z-50 pointer-events-none ${text.color} font-bold text-xl`}
            style={{ left: `${text.position.x}%`, top: `${text.position.y}%` }}
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: -50 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            transition={{ duration: 3 }}
          >
            {text.text}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Header Netflix */}
        <motion.div 
          className="border-b-4 border-yellow-400 bg-black/95 backdrop-blur-lg shadow-2xl"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-yellow-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Crown className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-300 via-yellow-300 to-red-300 bg-clip-text text-transparent">
                    CAETÉ LEGENDS
                  </h1>
                  <h2 className="text-lg font-bold text-orange-300">NETFLIX PREMIUM • FOLCLORE BRASILEIRO PRO</h2>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {gameState.phase === 'duel' && (
                  <div className="text-center bg-gradient-to-br from-blue-800 to-indigo-900 p-2 rounded-xl border-2 border-blue-400/50">
                    <Timer className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <div className="text-sm font-bold text-blue-400">{formatTime(gameTimer)}</div>
                  </div>
                )}

                <div className="text-center bg-gradient-to-br from-green-800 to-emerald-900 p-2 rounded-xl border-2 border-green-400/50">
                  <Trophy className="w-4 h-4 text-green-400 mx-auto mb-1" />
                  <div className="text-sm font-bold text-green-400">{gameState.playerWins}</div>
                  <div className="text-xs text-green-300">Vitórias</div>
                </div>
                <div className="text-center bg-gradient-to-br from-red-800 to-rose-900 p-2 rounded-xl border-2 border-red-400/50">
                  <Skull className="w-4 h-4 text-red-400 mx-auto mb-1" />
                  <div className="text-sm font-bold text-red-400">{gameState.playerLosses}</div>
                  <div className="text-xs text-red-300">Derrotas</div>
                </div>
                {gameState.streak > 0 && (
                  <div className="text-center bg-gradient-to-br from-purple-800 to-pink-900 p-2 rounded-xl border-2 border-purple-400/50">
                    <Star className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <div className="text-sm font-bold text-purple-400">{gameState.streak}</div>
                    <div className="text-xs text-purple-300">Sequência</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Menu Principal */}
          {gameState.phase === 'menu' && (
            <motion.div 
              className="text-center space-y-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
            >
              <div className="bg-black/90 rounded-3xl p-16 border-4 border-yellow-400/50 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-yellow-900/30 to-red-900/30 animate-pulse"></div>
                <div className="relative z-10">
                  <motion.h2 
                    className="text-7xl font-black mb-8 bg-gradient-to-r from-emerald-300 via-yellow-300 to-red-300 bg-clip-text text-transparent"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    LENDAS DO BRASIL
                  </motion.h2>
                  <p className="text-3xl text-orange-300 mb-6 font-bold">
                    🏹 Edição Netflix Premium Pro 🏹
                  </p>
                  <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                    Mergulhe nas profundezas do folclore brasileiro em um duelo épico de cartas mágicas. 
                    Invoque lendas ancestrais, domine elementos primordiais e torne-se o mestre supremo das tradições brasileiras!
                  </p>
                </div>
              </div>

              {/* Seleção de Dificuldade */}
              <motion.div 
                className="bg-black/80 rounded-2xl p-8 border-2 border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-3xl font-bold mb-6 text-yellow-300">⚔️ Escolha seu Destino</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Fácil', desc: 'Iniciante', variant: 'success', icon: '🌱' },
                    { name: 'Médio', desc: 'Equilibrado', variant: 'primary', icon: '⚔️' },
                    { name: 'Difícil', desc: 'Desafiador', variant: 'secondary', icon: '🔥' },
                    { name: 'Lendário', desc: 'Apenas Mestres', variant: 'danger', icon: '👑' }
                  ].map((diff) => (
                    <motion.div key={diff.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        variant={diff.variant}
                        className={`py-8 text-lg font-black w-full ${diff.name === 'Lendário' ? 'animate-pulse shadow-2xl' : ''}`}
                        onClick={() => startDuel(diff.name)}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{diff.icon}</div>
                          <div>{diff.name}</div>
                          <div className="text-xs opacity-75">{diff.desc}</div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Estatísticas */}
              {(gameState.playerWins > 0 || gameState.playerLosses > 0) && (
                <motion.div 
                  className="bg-black/80 rounded-2xl p-8 border-2 border-white/20"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-cyan-300 flex items-center justify-center">
                    <Award className="w-6 h-6 mr-2" />
                    Suas Conquistas Lendárias
                  </h3>
                  <div className="grid grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-black text-green-400 mb-2">{gameState.playerWins}</div>
                      <div className="text-green-300 font-bold">Vitórias Épicas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-black text-red-400 mb-2">{gameState.playerLosses}</div>
                      <div className="text-red-300 font-bold">Derrotas Honrosas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-black text-purple-400 mb-2">{gameState.streak}</div>
                      <div className="text-purple-300 font-bold">Sequência Máxima</div>
                    </div>
                  </div>
                  
                  {gameState.playerWins > 0 && (
                    <div className="mt-6 text-center">
                      <div className="text-lg text-yellow-300">
                        Taxa de Vitória: <span className="font-bold">{Math.round((gameState.playerWins / (gameState.playerWins + gameState.playerLosses)) * 100)}%</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Interface de Duelo */}
          {gameState.phase === 'duel' && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Placar */}
              <div className="grid grid-cols-3 gap-6 bg-black/95 p-6 rounded-2xl border-4 border-yellow-400/50 shadow-2xl">
                <div className="text-center">
                  <div className="bg-green-800/50 p-4 rounded-xl border border-green-400/50">
                    <h4 className="text-lg font-bold text-green-300 mb-2">🏹 VOCÊ</h4>
                    <div className="flex justify-center space-x-4">
                      <div className="text-center">
                        <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                        <motion.div 
                          className="text-xl font-bold text-green-400"
                          key={gameState.playerLifePoints}
                          initial={{ scale: 1.2, color: '#ef4444' }}
                          animate={{ scale: 1, color: '#10b981' }}
                        >
                          {gameState.playerLifePoints}
                        </motion.div>
                        <div className="text-xs text-green-300">VIDA</div>
                      </div>
                      <div className="text-center">
                        <Gem className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                        <div className="text-xl font-bold text-blue-400">{gameState.playerMana}</div>
                        <div className="text-xs text-blue-300">MANA</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-yellow-800/50 p-4 rounded-xl border border-yellow-400/50">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">⚔️</div>
                    <div className="text-lg text-yellow-300 font-bold">DUELO ÉPICO</div>
                    <div className="text-sm text-gray-300 mb-2">Turno {gameState.turnCount}</div>
                    <motion.div 
                      className={`text-sm font-bold mb-2 ${gameState.turn === 'player' ? 'text-green-400' : 'text-red-400'}`}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {gameState.turn === 'player' ? 'SEU TURNO' : 'TURNO INIMIGO'}
                    </motion.div>
                    {gameState.currentWeather && (
                      <div className="text-xs text-cyan-300">🌤️ {gameState.currentWeather}</div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-red-800/50 p-4 rounded-xl border border-red-400/50">
                    <h4 className="text-lg font-bold text-red-300 mb-2">👹 INIMIGO</h4>
                    <div className="flex justify-center space-x-4">
                      <div className="text-center">
                        <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                        <motion.div 
                          className="text-xl font-bold text-red-400"
                          key={gameState.enemyLifePoints}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                        >
                          {gameState.enemyLifePoints}
                        </motion.div>
                        <div className="text-xs text-red-300">VIDA</div>
                      </div>
                      <div className="text-center">
                        <Gem className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                        <div className="text-xl font-bold text-blue-400">{gameState.enemyMana}</div>
                        <div className="text-xs text-blue-300">MANA</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campos */}
              <div className="space-y-6">
                {/* Campo Inimigo */}
                <div className="text-center">
                  <h4 className="text-xl font-bold text-red-300 mb-3">👹 CAMPO INIMIGO</h4>
                  <div className="grid grid-cols-5 gap-3">
                    {enemyField.map((creature, index) => (
                      <motion.div key={`enemy-${index}`} whileHover={{ scale: 1.05 }}>
                        <Card className={`h-32 flex items-center justify-center border-2 ${
                          creature ? getRarityColor(creature.rarity) : 'border-dashed border-gray-600 bg-gray-800/20'
                        }`}>
                          {creature ? (
                            <div className="text-center p-2">
                              <div className="text-3xl mb-1">{creature.art}</div>
                              <div className="text-xs font-bold text-white mb-1">{creature.name}</div>
                              <div className="flex justify-center space-x-2 text-xs">
                                <span className="text-red-400"><Sword className="w-3 h-3 inline mr-1" />{creature.attack}</span>
                                <span className="text-blue-400"><Shield className="w-3 h-3 inline mr-1" />{creature.defense}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-500 text-center">
                              <div className="text-2xl mb-1">⭕</div>
                              <div className="text-xs">Vazio</div>
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Campo do Jogador */}
                <div className="text-center">
                  <h4 className="text-xl font-bold text-green-300 mb-3">🏹 SEU CAMPO</h4>
                  <div className="grid grid-cols-5 gap-3">
                    {playerField.map((creature, index) => (
                      <motion.div key={`player-${index}`} whileHover={{ scale: 1.05 }}>
                        <Card 
                          className={`h-32 flex items-center justify-center border-2 cursor-pointer ${
                            creature ? getRarityColor(creature.rarity) : 'border-dashed border-gray-600 bg-gray-800/20 hover:bg-gray-700/40'
                          } ${
                            selectedCard && !creature && getCardById(selectedCard)?.type === 'Criatura' && canAfford(getCardById(selectedCard))
                              ? 'border-green-400 bg-green-800/30 animate-pulse' : ''
                          }`}
                          onClick={() => {
                            if (!creature && selectedCard && getCardById(selectedCard)?.type === 'Criatura') {
                              const card = getCardById(selectedCard);
                              if (card && canAfford(card)) {
                                summonCreature(selectedCard, index, true);
                                setSelectedCard(null);
                              }
                            }
                          }}
                        >
                          {creature ? (
                            <div className="text-center p-2">
                              <div className="text-3xl mb-1">{creature.art}</div>
                              <div className="text-xs font-bold text-white mb-1">{creature.name}</div>
                              <div className="flex justify-center space-x-2 text-xs">
                                <span className="text-red-400"><Sword className="w-3 h-3 inline mr-1" />{creature.attack}</span>
                                <span className="text-blue-400"><Shield className="w-3 h-3 inline mr-1" />{creature.defense}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-500 text-center">
                              <div className="text-2xl mb-1">⭕</div>
                              <div className="text-xs">
                                {selectedCard && getCardById(selectedCard)?.type === 'Criatura' && canAfford(getCardById(selectedCard))
                                  ? 'Clique para invocar' : 'Vazio'}
                              </div>
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Mão do Jogador */}
                <div className="bg-black/95 p-4 rounded-xl border-2 border-green-400/50">
                  <h5 className="text-lg font-bold text-green-300 mb-3">🃏 SUA MÃO</h5>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {playerHand.map((cardId, index) => {
                      const card = getCardById(cardId);
                      if (!card) return null;
                      
                      const affordable = canAfford(card);
                      const isSelected = selectedCard === cardId;
                      
                      return (
                        <motion.div key={`hand-${index}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Card
                            className={`min-w-[140px] h-48 p-2 cursor-pointer transition-all duration-300 ${
                              getRarityColor(card.rarity)
                            } ${isSelected ? 'ring-2 ring-yellow-400 scale-105' : ''} ${
                              !affordable ? 'opacity-50 grayscale' : ''
                            }`}
                            onClick={() => affordable && setSelectedCard(isSelected ? null : cardId)}
                          >
                            <div className="text-center h-full flex flex-col justify-between">
                              <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center">
                                  <Gem className="w-3 h-3 text-blue-400" />
                                  <span className="text-xs text-blue-400 ml-1">{card.manaCost}</span>
                                </div>
                                {isSelected && <Check className="w-3 h-3 text-yellow-400" />}
                              </div>
                              
                              <div className="flex-1 flex flex-col justify-center">
                                <div className="text-3xl mb-2">{card.art}</div>
                                <div className="text-xs font-bold text-white mb-1">{card.name}</div>
                                
                                {card.type === 'Criatura' && (
                                  <div className="flex justify-center space-x-2 text-xs mb-1">
                                    <span className="text-red-400"><Sword className="w-3 h-3 inline mr-1" />{card.attack}</span>
                                    <span className="text-blue-400"><Shield className="w-3 h-3 inline mr-1" />{card.defense}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-center">
                                <div className="flex justify-center mb-1">{getElementIcon(card.attribute)}</div>
                                <Badge className={`text-xs ${card.type === 'Criatura' ? 'bg-red-600' : 'bg-purple-600'}`}>
                                  {card.type}
                                </Badge>
                              </div>

                              {!affordable && (
                                <div className="absolute inset-0 bg-red-900/70 rounded flex items-center justify-center">
                                  <div className="text-center">
                                    <Lock className="w-6 h-6 text-red-400 mx-auto mb-1" />
                                    <div className="text-xs text-red-300 font-bold">MANA INSUFICIENTE</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Botões de Ação */}
                {gameState.turn === 'player' && (
                  <div className="flex justify-center space-x-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg"
                        disabled={!selectedCard || getCardById(selectedCard)?.type !== 'Magia' || !canAfford(getCardById(selectedCard))}
                        onClick={() => {
                          if (selectedCard) {
                            castSpell(selectedCard, true);
                            setSelectedCard(null);
                          }
                        }}
                      >
                        <Zap className="w-4 h-4 mr-2" />🔮 LANÇAR MAGIA
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
                        onClick={endTurn}
                      >
                        <Timer className="w-4 h-4 mr-2" />🔄 FINALIZAR TURNO
                      </Button>
                    </motion.div>
                  </div>
                )}

                {/* Log de Batalha */}
                <Card className="bg-black/95 border-2 border-yellow-400/50 h-48">
                  <div className="p-4 h-full">
                    <h5 className="text-sm font-bold text-yellow-300 mb-2">📜 LOG DE BATALHA ÉPICA</h5>
                    <div className="space-y-1 h-32 overflow-y-auto text-sm">
                      {gameState.battleLog.slice(-10).reverse().map((entry) => (
                        <motion.div 
                          key={entry.id} 
                          className={`p-2 rounded border-l-2 ${
                            entry.type === 'direct_attack' ? 'bg-red-900/30 border-red-400 text-red-200' :
                            entry.type === 'summon' ? 'bg-green-900/30 border-green-400 text-green-200' :
                            'bg-blue-900/30 border-blue-400 text-blue-200'
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <div className="font-semibold">{entry.message}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Tela de Vitória */}
          {gameState.phase === 'victory' && (
            <motion.div 
              className="text-center space-y-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="bg-black/95 rounded-3xl p-16 border-4 border-yellow-400 shadow-2xl">
                <motion.div className="text-9xl mb-8" animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>🏆</motion.div>
                <h2 className="text-7xl font-black mb-8 bg-gradient-to-r from-yellow-300 via-orange-400 to-green-400 bg-clip-text text-transparent">
                  VITÓRIA LENDÁRIA!
                </h2>
                <p className="text-3xl text-green-300 mb-8 font-bold">🎉 Você dominou as lendas do Brasil! 🎉</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                  {[
                    { icon: Trophy, value: 'ÉPICA', label: 'Vitória', color: 'yellow' },
                    { icon: Star, value: gameState.streak, label: 'Sequência', color: 'purple' },
                    { icon: Timer, value: formatTime(gameState.gameTime), label: 'Tempo', color: 'green' },
                    { icon: Target, value: gameState.turnCount, label: 'Turnos', color: 'blue' }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      className={`bg-${stat.color}-800/50 p-6 rounded-xl border border-${stat.color}-400/50`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <stat.icon className={`w-10 h-10 text-${stat.color}-400 mx-auto mb-3`} />
                      <div className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</div>
                      <div className={`text-${stat.color}-300`}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center space-x-6">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button size="xl" className="bg-green-600 hover:bg-green-700 py-6 px-12 rounded-xl" onClick={() => startDuel(gameState.difficulty)}>
                    <RotateCcw className="w-8 h-8 mr-4" />⚔️ NOVO DUELO
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button size="xl" className="bg-blue-600 hover:bg-blue-700 py-6 px-12 rounded-xl" onClick={() => setGameState(prev => ({ ...prev, phase: 'menu' }))}>
                    <Crown className="w-8 h-8 mr-4" />🏠 MENU
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Tela de Derrota */}
          {gameState.phase === 'defeat' && (
            <motion.div className="text-center space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-black/95 rounded-3xl p-16 border-4 border-red-400 shadow-2xl">
                <motion.div className="text-9xl mb-8" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>💀</motion.div>
                <h2 className="text-7xl font-black mb-8 bg-gradient-to-r from-red-400 via-orange-400 to-gray-400 bg-clip-text text-transparent">
                  DERROTA HONROSA
                </h2>
                <p className="text-3xl text-red-300 mb-8 font-bold">⚰️ Os espíritos sombrios prevaleceram... ⚰️</p>
                
                <div className="bg-gray-800/50 p-8 rounded-xl border border-red-400/50 max-w-2xl mx-auto mb-8">
                  <h3 className="text-2xl font-bold text-red-300 mb-6">📊 Estatísticas da Batalha</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { icon: Timer, value: formatTime(gameState.gameTime), label: 'Duração', color: 'orange' },
                      { icon: Target, value: gameState.turnCount, label: 'Turnos', color: 'blue' },
                      { icon: Zap, value: gameState.spellsCast, label: 'Magias', color: 'purple' },
                      { icon: Skull, value: gameState.monstersDefeated, label: 'Derrotas', color: 'red' }
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <stat.icon className={`w-8 h-8 text-${stat.color}-400 mx-auto mb-2`} />
                        <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
                        <div className={`text-${stat.color}-300 text-sm`}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-900/30 rounded-lg border border-yellow-600/50">
                    <div className="text-yellow-300 font-bold">💡 Dica do Mestre:</div>
                    <div className="text-yellow-200 text-sm mt-2">
                      {gameState.difficulty === 'Lendário' 
                        ? 'Você enfrentou o desafio máximo! Tente estratégias mais defensivas.'
                        : gameState.difficulty === 'Difícil'
                        ? 'Considere balancear criaturas e magias em seu deck.'
                        : 'Invoque criaturas mais fortes e use magias estrategicamente.'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-6">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button size="xl" className="bg-red-600 hover:bg-red-700 py-6 px-12 rounded-xl" onClick={() => startDuel(gameState.difficulty)}>
                    <Sword className="w-8 h-8 mr-4" />⚔️ VINGANÇA!
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button size="xl" className="bg-blue-600 hover:bg-blue-700 py-6 px-12 rounded-xl" onClick={() => setGameState(prev => ({ ...prev, phase: 'menu' }))}>
                    <RotateCcw className="w-8 h-8 mr-4" />🔄 MENU
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaeteLegendsNetflixPro;