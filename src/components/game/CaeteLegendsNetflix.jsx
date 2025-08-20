import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Sword, Shield, Zap, Heart, Star, Flame, 
  Crown, Skull, Mountain, TreePine, Fish, Bird, 
  Sparkles, Target, Timer, Volume2, 
  RotateCcw, PlayCircle, Trophy, Gem, Moon, Sun,
  Settings, Check, Lock, Waves, Wind, Eye,
  Leaf, Feather, Maximize2, Minimize2,
  Volume1, VolumeX, Pause, Play, Info,
  Users, Award, Gamepad2, Tv, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { brazilianFolkloreCards, getCardById, createBalancedDeck } from '../../game/brazilian-folklore-cards';
import { 
  ParticleSystem, 
  ScreenShakeEffect, 
  AtmosphericGlow,
  CinematicTransition,
  NetflixLoader,
  EpicVictoryEffect,
  PremiumCardEffect
} from '../effects/NetflixStyleEffects';
import { 
  BrazilianAtmosphereLayer, 
  WeatherEffect, 
  AmbientSoundscape,
  PhaseTransition,
  ComboEffect,
  EpicMenuEntrance
} from '../atmosphere/BrazilianAtmosphere';
import useGameState from '../../hooks/useGameState';
import { netflixConfig } from '../../config/netflix-config';

const CaeteLegendsNetflix = () => {
  // Estados principais do jogo
  const [gameState, setGameState] = useState({
    phase: 'menu', // menu, deck_selection, duel, victory, defeat, settings
    turn: 'player',
    turnCount: 1,
    playerLifePoints: 8000,
    enemyLifePoints: 8000,
    playerMana: 4,
    enemyMana: 4,
    maxMana: 10,
    battleLog: [],
    playerWins: 0,
    playerLosses: 0,
    streak: 0,
    spellsCast: 0,
    monstersDefeated: 0,
    gameTime: 0,
    difficulty: 'Médio', // Fácil, Médio, Difícil, Lendário
    soundEnabled: true,
    musicEnabled: true,
    animationsEnabled: true,
    fullscreen: false
  });

  // Estados do jogo
  const [playerDeck, setPlayerDeck] = useState([]);
  const [enemyDeck, setEnemyDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [enemyHand, setEnemyHand] = useState([]);
  const [playerField, setPlayerField] = useState([null, null, null, null, null]);
  const [enemyField, setEnemyField] = useState([null, null, null, null, null]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedFieldCard, setSelectedFieldCard] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [gameTimer, setGameTimer] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('draw'); // draw, main, battle, end

  // Efeitos visuais avançados
  const [screenShake, setScreenShake] = useState(false);
  const [glowEffect, setGlowEffect] = useState(null);
  const [particleEffects, setParticleEffects] = useState([]);

  // Sistema de som e música (simulado)
  const playSound = useCallback((soundName) => {
    if (!gameState.soundEnabled) return;
    // Aqui seria implementado o sistema de som real
    console.log(`🔊 Playing sound: ${soundName}`);
  }, [gameState.soundEnabled]);

  const playMusic = useCallback((musicName) => {
    if (!gameState.musicEnabled) return;
    console.log(`🎵 Playing music: ${musicName}`);
  }, [gameState.musicEnabled]);

  // Adicionar texto flutuante com efeitos
  const addFloatingText = useCallback((text, color = 'text-yellow-400', position = null, effect = 'bounce') => {
    const id = Date.now() + Math.random();
    const pos = position || { 
      x: 20 + Math.random() * 60, 
      y: 20 + Math.random() * 60 
    };
    
    setFloatingTexts(prev => [...prev, { 
      id, 
      text, 
      color, 
      position: pos, 
      opacity: 1,
      effect,
      scale: 1
    }]);
    
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Adicionar efeito de partículas
  const addParticleEffect = useCallback((type, position) => {
    if (!gameState.animationsEnabled) return;
    
    const id = Date.now() + Math.random();
    setParticleEffects(prev => [...prev, {
      id,
      type, // fire, water, wind, earth, shadow, spirit
      position,
      duration: 2000
    }]);
    
    setTimeout(() => {
      setParticleEffects(prev => prev.filter(p => p.id !== id));
    }, 2000);
  }, [gameState.animationsEnabled]);

  // Efeito de tela tremendo
  const triggerScreenShake = useCallback(() => {
    if (!gameState.animationsEnabled) return;
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  }, [gameState.animationsEnabled]);

  // Verificar se pode pagar o custo da carta
  const canAfford = useCallback((card, isPlayer = true) => {
    if (!card || !card.manaCost) return true;
    const mana = isPlayer ? gameState.playerMana : gameState.enemyMana;
    return mana >= card.manaCost;
  }, [gameState.playerMana, gameState.enemyMana]);

  // Embaralhar deck
  const shuffleDeck = useCallback((deck) => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  }, []);

  // Comprar carta
  const drawCard = useCallback((isPlayer, count = 1) => {
    for (let i = 0; i < count; i++) {
      if (isPlayer && playerDeck.length > 0) {
        setPlayerDeck(prev => {
          const newDeck = [...prev];
          const drawnCard = newDeck.shift();
          setPlayerHand(hand => {
            if (hand.length >= 7) {
              addFloatingText('❌ Mão cheia! Carta descartada', 'text-red-400');
              return hand;
            }
            return [...hand, drawnCard];
          });
          return newDeck;
        });
        playSound('draw_card');
      } else if (!isPlayer && enemyDeck.length > 0) {
        setEnemyDeck(prev => {
          const newDeck = [...prev];
          const drawnCard = newDeck.shift();
          setEnemyHand(hand => [...hand, drawnCard]);
          return newDeck;
        });
      }
    }
  }, [playerDeck, enemyDeck, addFloatingText, playSound]);

  // Invocar criatura
  const summonCreature = useCallback((cardId, position, isPlayer = true) => {
    const card = getCardById(cardId);
    if (!card || card.type !== 'Criatura') return false;

    const currentMana = isPlayer ? gameState.playerMana : gameState.enemyMana;
    if (currentMana < card.manaCost) {
      if (isPlayer) addFloatingText('❌ Mana Insuficiente!', 'text-red-400');
      return false;
    }

    // Verificar se precisa de tributos para criaturas de nível alto
    const tributesNeeded = Math.max(0, card.level - 4);
    if (tributesNeeded > 0) {
      const field = isPlayer ? playerField : enemyField;
      const availableCreatures = field.filter(c => c !== null);
      
      if (availableCreatures.length < tributesNeeded) {
        if (isPlayer) addFloatingText(`❌ Precisa de ${tributesNeeded} tributos!`, 'text-red-400');
        return false;
      }
      
      // Remover criaturas como tributo
      const fieldSetter = isPlayer ? setPlayerField : setEnemyField;
      fieldSetter(prev => {
        const newField = [...prev];
        let tributesRemoved = 0;
        for (let i = 0; i < newField.length && tributesRemoved < tributesNeeded; i++) {
          if (newField[i] !== null) {
            newField[i] = null;
            tributesRemoved++;
          }
        }
        return newField;
      });
    }

    // Reduzir mana
    setGameState(prev => ({
      ...prev,
      [isPlayer ? 'playerMana' : 'enemyMana']: 
        prev[isPlayer ? 'playerMana' : 'enemyMana'] - card.manaCost
    }));

    // Criar instância da criatura invocada
    const summoned = { 
      ...card, 
      id: cardId, 
      summoned: true,
      canAttack: false, // Não pode atacar no turno que foi invocada
      attackedThisTurn: false
    };

    // Colocar no campo
    if (isPlayer) {
      setPlayerField(prev => {
        const newField = [...prev];
        newField[position] = summoned;
        return newField;
      });
      setPlayerHand(prev => prev.filter(c => c !== cardId));
    } else {
      setEnemyField(prev => {
        const newField = [...prev];
        newField[position] = summoned;
        return newField;
      });
      setEnemyHand(prev => prev.filter(c => c !== cardId));
    }

    // Efeitos visuais e sonoros
    playSound('summon');
    addParticleEffect(card.attribute?.toLowerCase() || 'spirit', { x: position * 20, y: isPlayer ? 70 : 30 });
    addFloatingText(`✨ ${card.name} Invocado!`, 'text-blue-400');
    
    if (card.level >= 8) {
      triggerScreenShake();
      setGlowEffect(card.attribute);
      setTimeout(() => setGlowEffect(null), 2000);
    }

    // Log de batalha
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
  }, [gameState.playerMana, gameState.enemyMana, playerField, enemyField, addFloatingText, playSound, addParticleEffect, triggerScreenShake]);

  // Lançar magia
  const castSpell = useCallback((cardId, isPlayer = true) => {
    const card = getCardById(cardId);
    if (!card || card.type !== 'Magia') return false;

    const currentMana = isPlayer ? gameState.playerMana : gameState.enemyMana;
    if (currentMana < card.manaCost) {
      if (isPlayer) addFloatingText('❌ Mana Insuficiente!', 'text-red-400');
      return false;
    }

    // Reduzir mana
    setGameState(prev => ({
      ...prev,
      [isPlayer ? 'playerMana' : 'enemyMana']: 
        prev[isPlayer ? 'playerMana' : 'enemyMana'] - card.manaCost,
      spellsCast: prev.spellsCast + 1
    }));

    // Remover da mão
    if (isPlayer) {
      setPlayerHand(prev => prev.filter(c => c !== cardId));
    } else {
      setEnemyHand(prev => prev.filter(c => c !== cardId));
    }

    // Aplicar efeitos da magia
    applySpellEffects(card, isPlayer);

    // Efeitos visuais
    playSound('cast_spell');
    addParticleEffect('magic', { x: 50, y: 50 });
    addFloatingText(`🔮 ${card.name}!`, 'text-purple-400');

    return true;
  }, [gameState.playerMana, gameState.enemyMana, addFloatingText, playSound, addParticleEffect]);

  // Aplicar efeitos das magias
  const applySpellEffects = useCallback((card, isPlayer) => {
    switch (card.id) {
      case 'ritual_pajé':
        // Invocar criatura lendária
        const legendaryCreatures = brazilianFolkloreCards.creatures.filter(c => c.rarity === 'Lendária');
        if (legendaryCreatures.length > 0) {
          const randomLegendary = legendaryCreatures[Math.floor(Math.random() * legendaryCreatures.length)];
          const emptySlot = (isPlayer ? playerField : enemyField).findIndex(slot => slot === null);
          if (emptySlot !== -1) {
            const cardId = `${randomLegendary.id}_ritual`;
            if (isPlayer) {
              setPlayerField(prev => {
                const newField = [...prev];
                newField[emptySlot] = { ...randomLegendary, id: cardId, summoned: true, canAttack: true };
                return newField;
              });
            }
          }
        }
        // Buff todas as criaturas
        addFloatingText('🔥 Poder Ancestral!', 'text-orange-400');
        break;
        
      case 'encanto_iara':
        // Controlar criatura inimiga
        const enemyCreatures = (isPlayer ? enemyField : playerField).filter(c => c !== null);
        if (enemyCreatures.length > 0) {
          addFloatingText('💙 Criatura Controlada!', 'text-blue-400');
        }
        break;
        
      case 'furia_boitata':
        // Destruir magias/armadilhas e causar dano
        setGameState(prev => ({
          ...prev,
          [isPlayer ? 'enemyLifePoints' : 'playerLifePoints']: 
            prev[isPlayer ? 'enemyLifePoints' : 'playerLifePoints'] - 1000
        }));
        addFloatingText('🐍 Fogo Purificador!', 'text-red-400');
        triggerScreenShake();
        break;
        
      case 'bencao_curupira':
        addFloatingText('🌿 Proteção da Floresta!', 'text-green-400');
        break;
        
      default:
        addFloatingText('✨ Magia Lançada!', 'text-purple-400');
    }
  }, [playerField, enemyField, addFloatingText, triggerScreenShake]);

  // IA Avançada
  const advancedAI = useCallback(() => {
    if (gameState.turn !== 'enemy' || gameState.phase !== 'duel') return;

    setTimeout(() => {
      // Analisar situação do jogo
      const playerCreatures = playerField.filter(c => c !== null);
      const enemyCreatures = enemyField.filter(c => c !== null);
      const playerTotalATK = playerCreatures.reduce((sum, c) => sum + c.attack, 0);
      const enemyTotalATK = enemyCreatures.reduce((sum, c) => sum + c.attack, 0);
      
      const isPlayerWinning = playerTotalATK > enemyTotalATK || gameState.playerLifePoints > gameState.enemyLifePoints;
      
      // Decidir estratégia baseada na dificuldade e situação
      let strategy = 'balanced';
      if (gameState.difficulty === 'Lendário') {
        strategy = isPlayerWinning ? 'aggressive' : 'defensive';
      } else if (gameState.difficulty === 'Difícil') {
        strategy = Math.random() > 0.3 ? 'aggressive' : 'balanced';
      }

      // Tentar lançar magias primeiro se estiver perdendo
      if (strategy === 'aggressive' || isPlayerWinning) {
        const magicsInHand = enemyHand
          .map(cardId => getCardById(cardId))
          .filter(card => card && card.type === 'Magia' && canAfford(card, false));

        if (magicsInHand.length > 0) {
          const chosenMagic = magicsInHand[0];
          const cardId = enemyHand.find(id => getCardById(id)?.id === chosenMagic.id);
          if (castSpell(cardId, false)) {
            setTimeout(() => advancedAI(), 1000);
            return;
          }
        }
      }

      // Invocar criaturas
      const creaturesInHand = enemyHand
        .map(cardId => getCardById(cardId))
        .filter(card => card && card.type === 'Criatura' && canAfford(card, false));

      if (creaturesInHand.length > 0) {
        // Priorizar criaturas mais fortes em dificuldades altas
        let chosenCreature;
        if (gameState.difficulty === 'Lendário') {
          chosenCreature = creaturesInHand.reduce((strongest, current) => 
            current.attack > strongest.attack ? current : strongest
          );
        } else {
          chosenCreature = creaturesInHand[0];
        }
        
        const emptySlot = enemyField.findIndex(slot => slot === null);
        if (emptySlot !== -1) {
          const cardId = enemyHand.find(id => getCardById(id)?.id === chosenCreature.id);
          if (summonCreature(cardId, emptySlot, false)) {
            setTimeout(() => advancedAI(), 1000);
            return;
          }
        }
      }

      // Fase de batalha
      setTimeout(() => {
        const attackingCreatures = enemyField.filter(creature => creature !== null && creature.canAttack);

        if (attackingCreatures.length > 0) {
          attackingCreatures.forEach((creature, index) => {
            setTimeout(() => {
              // Escolher alvo inteligentemente
              const playerCreatures = playerField.filter(c => c !== null);
              
              if (strategy === 'aggressive' && playerCreatures.length === 0) {
                // Ataque direto
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
                playSound('attack');
                triggerScreenShake();
                
              } else if (playerCreatures.length > 0) {
                // Atacar criatura mais fraca que pode destruir
                const targets = playerCreatures.filter(c => c.attack <= creature.attack);
                if (targets.length > 0) {
                  const target = targets.reduce((weakest, current) => 
                    current.defense < weakest.defense ? current : weakest
                  );
                  
                  // Batalha entre criaturas
                  const damage = creature.attack - target.defense;
                  const counterDamage = target.attack - creature.defense;
                  
                  addFloatingText(`⚔️ ${creature.name} vs ${target.name}!`, 'text-yellow-400');
                  playSound('battle');
                  
                  // Remover criaturas destruídas
                  if (damage > 0) {
                    setPlayerField(prev => prev.map(c => c?.id === target.id ? null : c));
                    addFloatingText(`💀 ${target.name} destruído!`, 'text-red-400');
                  }
                  
                  if (counterDamage > 0) {
                    setEnemyField(prev => prev.map(c => c?.id === creature.id ? null : c));
                    addFloatingText(`💀 ${creature.name} destruído!`, 'text-green-400');
                  }
                }
              }
            }, index * 800);
          });
        }

        // Finalizar turno
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            turn: 'player',
            turnCount: prev.turnCount + 1,
            playerMana: Math.min(prev.maxMana, 4 + Math.floor(prev.turnCount / 2)),
            enemyMana: Math.min(prev.maxMana, 4 + Math.floor(prev.turnCount / 2))
          }));
          
          // Permitir que criaturas inimigas ataquem no próximo turno
          setEnemyField(prev => prev.map(c => c ? { ...c, canAttack: true, attackedThisTurn: false } : c));
          
          drawCard(true, 1);
          addFloatingText('🔄 Seu Turno!', 'text-blue-400');
          setCurrentPhase('draw');
        }, attackingCreatures.length * 800 + 1500);
      }, 1000);
    }, 2000);
  }, [gameState, enemyHand, enemyField, playerField, canAfford, castSpell, summonCreature, drawCard, addFloatingText, playSound, triggerScreenShake]);

  // Finalizar turno do jogador
  const endTurn = useCallback(() => {
    // Permitir que criaturas do jogador ataquem no próximo turno
    setPlayerField(prev => prev.map(c => c ? { ...c, canAttack: true, attackedThisTurn: false } : c));
    
    setGameState(prev => ({
      ...prev,
      turn: 'enemy',
      enemyMana: Math.min(prev.maxMana, 4 + Math.floor(prev.turnCount / 2))
    }));
    
    drawCard(false, 1);
    addFloatingText('🔄 Turno do Inimigo', 'text-red-400');
    playSound('end_turn');
    setCurrentPhase('draw');
  }, [drawCard, addFloatingText, playSound]);

  // Iniciar duelo
  const startDuel = useCallback((difficulty = 'Médio') => {
    const newPlayerDeck = createBalancedDeck();
    const newEnemyDeck = createBalancedDeck();
    
    setPlayerDeck(newPlayerDeck);
    setEnemyDeck(newEnemyDeck);
    
    setGameState(prev => ({
      ...prev,
      phase: 'duel',
      turn: 'player',
      turnCount: 1,
      playerLifePoints: 8000,
      enemyLifePoints: 8000,
      playerMana: 4,
      enemyMana: 4,
      maxMana: 10,
      difficulty,
      battleLog: [{
        id: 1,
        message: '🏹⚔️ O duelo épico das lendas brasileiras se inicia! Que os espíritos ancestrais guiem sua batalha!',
        timestamp: Date.now(),
        type: 'game_start'
      }],
      spellsCast: 0,
      monstersDefeated: 0,
      gameTime: 0
    }));

    // Reset do estado do jogo
    setPlayerHand([]);
    setEnemyHand([]);
    setPlayerField([null, null, null, null, null]);
    setEnemyField([null, null, null, null, null]);
    setSelectedCard(null);
    setSelectedFieldCard(null);
    setFloatingTexts([]);
    setParticleEffects([]);
    setCurrentPhase('draw');
    setGameTimer(0);

    // Iniciar música de batalha
    playMusic('battle_theme');

    // Distribuir cartas iniciais
    setTimeout(() => {
      drawCard(true, 5);
      drawCard(false, 5);
      addFloatingText('🎴 Cartas Distribuídas! Que a batalha comece!', 'text-cyan-400');
    }, 500);
  }, [drawCard, addFloatingText, playMusic]);

  // Atacar com criatura
  const attackWithCreature = useCallback((attackerIndex, targetIndex = null) => {
    const attacker = playerField[attackerIndex];
    if (!attacker || !attacker.canAttack || attacker.attackedThisTurn) {
      addFloatingText('❌ Criatura não pode atacar!', 'text-red-400');
      return false;
    }

    const enemyCreatures = enemyField.filter(c => c !== null);
    
    if (targetIndex === null && enemyCreatures.length === 0) {
      // Ataque direto
      const damage = attacker.attack;
      setGameState(prev => ({
        ...prev,
        enemyLifePoints: prev.enemyLifePoints - damage,
        battleLog: [...prev.battleLog, {
          id: Date.now(),
          message: `⚔️ ${attacker.name} atacou diretamente! ${damage} de dano!`,
          timestamp: Date.now(),
          type: 'direct_attack'
        }]
      }));
      
      addFloatingText(`💥 -${damage} LP!`, 'text-red-500');
      playSound('attack');
      triggerScreenShake();
      
    } else if (targetIndex !== null && enemyField[targetIndex]) {
      // Ataque contra criatura
      const target = enemyField[targetIndex];
      const damage = attacker.attack - target.defense;
      const counterDamage = target.attack - attacker.defense;
      
      addFloatingText(`⚔️ ${attacker.name} vs ${target.name}!`, 'text-yellow-400');
      playSound('battle');
      
      // Aplicar dano e destruir criaturas se necessário
      if (damage > 0) {
        setEnemyField(prev => {
          const newField = [...prev];
          newField[targetIndex] = null;
          return newField;
        });
        addFloatingText(`💀 ${target.name} destruído!`, 'text-green-400');
        
        setGameState(prev => ({
          ...prev,
          monstersDefeated: prev.monstersDefeated + 1
        }));
      }
      
      if (counterDamage > 0) {
        setPlayerField(prev => {
          const newField = [...prev];
          newField[attackerIndex] = null;
          return newField;
        });
        addFloatingText(`💀 ${attacker.name} destruído!`, 'text-red-400');
      }
    }

    // Marcar criatura como tendo atacado
    setPlayerField(prev => {
      const newField = [...prev];
      if (newField[attackerIndex]) {
        newField[attackerIndex] = { 
          ...newField[attackerIndex], 
          attackedThisTurn: true 
        };
      }
      return newField;
    });

    return true;
  }, [playerField, enemyField, addFloatingText, playSound, triggerScreenShake]);

  // Verificar condições de vitória/derrota
  useEffect(() => {
    if (gameState.phase === 'duel') {
      if (gameState.playerLifePoints <= 0) {
        setGameState(prev => ({ 
          ...prev, 
          phase: 'defeat',
          playerLosses: prev.playerLosses + 1,
          streak: 0
        }));
        playMusic('defeat');
      } else if (gameState.enemyLifePoints <= 0) {
        setGameState(prev => ({ 
          ...prev, 
          phase: 'victory',
          playerWins: prev.playerWins + 1,
          streak: prev.streak + 1
        }));
        playMusic('victory');
      }
    }
  }, [gameState.playerLifePoints, gameState.enemyLifePoints, gameState.phase, playMusic]);

  // IA turn trigger
  useEffect(() => {
    if (gameState.turn === 'enemy' && gameState.phase === 'duel') {
      advancedAI();
    }
  }, [gameState.turn, advancedAI]);

  // Timer do jogo
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

  // Obter cor da raridade
  const getRarityColor = (rarity) => {
    const colors = {
      'Comum': 'border-gray-400 bg-gradient-to-br from-gray-800 to-gray-900',
      'Rara': 'border-blue-400 bg-gradient-to-br from-blue-800 to-blue-900',
      'Super Rara': 'border-purple-400 bg-gradient-to-br from-purple-800 to-purple-900',
      'Ultra Rara': 'border-pink-400 bg-gradient-to-br from-pink-800 to-purple-900 animate-pulse',
      'Lendária': 'border-red-400 bg-gradient-to-br from-red-800 via-orange-800 to-yellow-800 animate-pulse',
      'Mítica': 'border-rainbow bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-800 animate-pulse shadow-2xl'
    };
    return colors[rarity] || colors['Comum'];
  };

  // Obter ícone do elemento
  const getElementIcon = (element) => {
    const icons = {
      'Terra': <Mountain className="w-4 h-4 text-amber-500" />,
      'Água': <Waves className="w-4 h-4 text-blue-400" />,
      'Fogo': <Flame className="w-4 h-4 text-red-500" />,
      'Floresta': <TreePine className="w-4 h-4 text-green-500" />,
      'Vento': <Wind className="w-4 h-4 text-cyan-400" />,
      'Sombra': <Eye className="w-4 h-4 text-purple-400" />,
      'Espírito': <Sparkles className="w-4 h-4 text-yellow-400" />,
      'Luz': <Sun className="w-4 h-4 text-orange-400" />
    };
    return icons[element] || <Star className="w-4 h-4 text-gray-400" />;
  };

  // Formatador de tempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-900 via-amber-900 to-red-900 text-white relative overflow-hidden transition-all duration-500 ${screenShake ? 'animate-pulse' : ''}`}>
      
      {/* Efeito de brilho global */}
      {glowEffect && (
        <div className={`absolute inset-0 opacity-20 animate-pulse pointer-events-none bg-gradient-radial from-${glowEffect === 'Fogo' ? 'red' : glowEffect === 'Água' ? 'blue' : glowEffect === 'Floresta' ? 'green' : 'purple'}-500 to-transparent`} />
      )}

      {/* Partículas flutuantes */}
      {particleEffects.map(particle => (
        <div
          key={particle.id}
          className={`fixed z-30 pointer-events-none animate-bounce ${
            particle.type === 'fire' ? 'text-red-500' :
            particle.type === 'water' ? 'text-blue-500' :
            particle.type === 'wind' ? 'text-cyan-500' :
            particle.type === 'earth' ? 'text-amber-500' :
            particle.type === 'shadow' ? 'text-purple-500' :
            'text-yellow-500'
          }`}
          style={{
            left: `${particle.position.x}%`,
            top: `${particle.position.y}%`,
            fontSize: '2rem'
          }}
        >
          {particle.type === 'fire' ? '🔥' :
           particle.type === 'water' ? '💧' :
           particle.type === 'wind' ? '🌪️' :
           particle.type === 'earth' ? '🪨' :
           particle.type === 'shadow' ? '👻' :
           particle.type === 'magic' ? '✨' : '⭐'}
        </div>
      ))}

      {/* Textos flutuantes */}
      {floatingTexts.map(text => (
        <div
          key={text.id}
          className={`fixed z-50 pointer-events-none ${text.color} font-bold text-xl animate-${text.effect} transition-all duration-1000`}
          style={{
            left: `${text.position.x}%`,
            top: `${text.position.y}%`,
            opacity: text.opacity,
            transform: `scale(${text.scale})`
          }}
        >
          {text.text}
        </div>
      ))}

      {/* Efeitos de fundo temáticos */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-8 text-8xl animate-pulse">🏹</div>
        <div className="absolute top-32 right-16 text-6xl animate-bounce">🪶</div>
        <div className="absolute bottom-20 left-16 text-7xl animate-pulse">🌳</div>
        <div className="absolute bottom-40 right-8 text-5xl animate-bounce">🐬</div>
        <div className="absolute top-1/2 left-1/4 text-4xl animate-spin">🌪️</div>
        <div className="absolute top-1/3 right-1/3 text-6xl animate-pulse">🔥</div>
      </div>

      <div className="relative z-10">
        {/* Header Netflix-style */}
        <div className="border-b-4 border-yellow-400 bg-black/95 backdrop-blur-lg shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo e título */}
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-yellow-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-300 via-yellow-300 to-red-300 bg-clip-text text-transparent">
                    CAETÉ LEGENDS
                  </h1>
                  <h2 className="text-lg font-bold text-orange-300">NETFLIX EDITION • FOLCLORE BRASILEIRO</h2>
                </div>
              </div>
              
              {/* Controles e estatísticas */}
              <div className="flex items-center space-x-3">
                {/* Timer do jogo */}
                {gameState.phase === 'duel' && (
                  <div className="text-center bg-gradient-to-br from-blue-800 to-indigo-900 p-2 rounded-xl border-2 border-blue-400/50">
                    <Timer className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <div className="text-sm font-bold text-blue-400">{formatTime(gameTimer)}</div>
                  </div>
                )}

                {/* Controles de áudio */}
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                  >
                    {gameState.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setGameState(prev => ({ ...prev, musicEnabled: !prev.musicEnabled }))}
                  >
                    {gameState.musicEnabled ? <Volume1 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Estatísticas */}
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
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Menu Principal Netflix-style */}
          {gameState.phase === 'menu' && (
            <div className="text-center space-y-12">
              {/* Hero Section */}
              <div className="bg-black/90 rounded-3xl p-16 border-4 border-yellow-400/50 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/50 via-yellow-900/50 to-red-900/50 animate-pulse"></div>
                <div className="relative z-10">
                  <h2 className="text-7xl font-black mb-8 bg-gradient-to-r from-emerald-300 via-yellow-300 to-red-300 bg-clip-text text-transparent animate-pulse">
                    LENDAS DO BRASIL
                  </h2>
                  <p className="text-3xl text-orange-300 mb-6 font-bold">
                    🏹 Edição Netflix Premium 🏹
                  </p>
                  <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                    Mergulhe nas profundezas do folclore brasileiro em um duelo épico de cartas. 
                    Invoque criaturas lendárias, lance magias ancestrais e torne-se o mestre das lendas!
                  </p>
                  
                  {/* Características do jogo */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-emerald-800/30 p-4 rounded-xl border border-emerald-400/30">
                      <TreePine className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <div className="text-emerald-300 font-bold">Folclore Autêntico</div>
                    </div>
                    <div className="bg-blue-800/30 p-4 rounded-xl border border-blue-400/30">
                      <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-blue-300 font-bold">Gráficos Premium</div>
                    </div>
                    <div className="bg-purple-800/30 p-4 rounded-xl border border-purple-400/30">
                      <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-purple-300 font-bold">IA Avançada</div>
                    </div>
                    <div className="bg-red-800/30 p-4 rounded-xl border border-red-400/30">
                      <Crown className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <div className="text-red-300 font-bold">Nível Senior</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seleção de Dificuldade */}
              <div className="bg-black/80 rounded-2xl p-8 border-2 border-white/20">
                <h3 className="text-3xl font-bold mb-6 text-yellow-300">Escolha seu Desafio</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Fácil', 'Médio', 'Difícil', 'Lendário'].map((difficulty) => (
                    <Button
                      key={difficulty}
                      size="lg"
                      variant={difficulty === 'Lendário' ? 'danger' : difficulty === 'Difícil' ? 'secondary' : 'primary'}
                      className={`py-6 text-lg font-black transform hover:scale-110 transition-all duration-500 ${
                        difficulty === 'Lendário' ? 'animate-pulse shadow-2xl' : ''
                      }`}
                      onClick={() => startDuel(difficulty)}
                    >
                      <PlayCircle className="w-6 h-6 mr-3" />
                      <div>
                        <div>{difficulty}</div>
                        <div className="text-xs opacity-75">
                          {difficulty === 'Fácil' ? 'Para iniciantes' :
                           difficulty === 'Médio' ? 'Equilibrado' :
                           difficulty === 'Difícil' ? 'Desafiador' :
                           'Apenas para mestres'}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Estatísticas do jogador */}
              {(gameState.playerWins > 0 || gameState.playerLosses > 0) && (
                <div className="bg-black/80 rounded-2xl p-8 border-2 border-white/20">
                  <h3 className="text-2xl font-bold mb-6 text-cyan-300">Suas Conquistas</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-black text-green-400">{gameState.playerWins}</div>
                      <div className="text-green-300">Vitórias</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-red-400">{gameState.playerLosses}</div>
                      <div className="text-red-300">Derrotas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-purple-400">{Math.max(gameState.streak, 0)}</div>
                      <div className="text-purple-300">Melhor Sequência</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interface de Duelo Avançada */}
          {gameState.phase === 'duel' && (
            <div className="space-y-6">
              {/* Placar Avançado */}
              <div className="grid grid-cols-3 gap-6 bg-black/95 p-6 rounded-2xl border-4 border-yellow-400/50 shadow-2xl">
                {/* Jogador */}
                <div className="text-center">
                  <div className="bg-green-800/50 p-4 rounded-xl border border-green-400/50">
                    <h4 className="text-lg font-bold text-green-300 mb-2">🏹 VOCÊ</h4>
                    <div className="flex justify-center space-x-4 mb-3">
                      <div className="text-center">
                        <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                        <div className="text-xl font-bold text-green-400">{gameState.playerLifePoints}</div>
                        <div className="text-xs text-green-300">VIDA</div>
                      </div>
                      <div className="text-center">
                        <Gem className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                        <div className="text-xl font-bold text-blue-400">{gameState.playerMana}</div>
                        <div className="text-xs text-blue-300">MANA</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-300">
                      Deck: {playerDeck.length} | Mão: {playerHand.length}
                    </div>
                  </div>
                </div>

                {/* Centro */}
                <div className="text-center">
                  <div className="bg-yellow-800/50 p-4 rounded-xl border border-yellow-400/50">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">⚔️</div>
                    <div className="text-lg text-yellow-300 font-bold">DUELO ÉPICO</div>
                    <div className="text-sm text-gray-300 mb-2">Turno {gameState.turnCount}</div>
                    <div className={`text-sm font-bold mb-2 ${gameState.turn === 'player' ? 'text-green-400' : 'text-red-400'}`}>
                      {gameState.turn === 'player' ? 'SEU TURNO' : 'TURNO INIMIGO'}
                    </div>
                    <Badge className={`${gameState.turn === 'player' ? 'bg-green-600' : 'bg-red-600'}`}>
                      Fase: {currentPhase === 'draw' ? 'Compra' : 
                            currentPhase === 'main' ? 'Principal' : 
                            currentPhase === 'battle' ? 'Batalha' : 'Final'}
                    </Badge>
                    <div className="text-xs text-gray-400 mt-2">
                      Dificuldade: {gameState.difficulty}
                    </div>
                  </div>
                </div>

                {/* Inimigo */}
                <div className="text-center">
                  <div className="bg-red-800/50 p-4 rounded-xl border border-red-400/50">
                    <h4 className="text-lg font-bold text-red-300 mb-2">👹 INIMIGO</h4>
                    <div className="flex justify-center space-x-4 mb-3">
                      <div className="text-center">
                        <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                        <div className="text-xl font-bold text-red-400">{gameState.enemyLifePoints}</div>
                        <div className="text-xs text-red-300">VIDA</div>
                      </div>
                      <div className="text-center">
                        <Gem className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                        <div className="text-xl font-bold text-blue-400">{gameState.enemyMana}</div>
                        <div className="text-xs text-blue-300">MANA</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-300">
                      Deck: {enemyDeck.length} | Mão: {enemyHand.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Campos de Batalha */}
              <div className="space-y-6">
                {/* Campo Inimigo */}
                <div className="text-center">
                  <h4 className="text-xl font-bold text-red-300 mb-3 flex items-center justify-center">
                    👹 CAMPO INIMIGO 
                    <Badge className="ml-2 bg-red-600">
                      {enemyField.filter(c => c !== null).length}/5
                    </Badge>
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    {enemyField.map((creature, index) => (
                      <Card 
                        key={`enemy-${index}`}
                        className={`h-36 flex items-center justify-center border-2 cursor-pointer ${
                          creature 
                            ? `${getRarityColor(creature.rarity)} hover:scale-105 ${selectedFieldCard === `enemy-${index}` ? 'ring-2 ring-yellow-400' : ''}` 
                            : 'border-dashed border-gray-600 bg-gray-800/20'
                        } transition-all duration-300`}
                        onClick={() => {
                          if (creature && gameState.turn === 'player' && currentPhase === 'battle') {
                            setSelectedFieldCard(selectedFieldCard === `enemy-${index}` ? null : `enemy-${index}`);
                          }
                        }}
                      >
                        {creature ? (
                          <div className="text-center p-2 w-full">
                            <div className="text-3xl mb-1">{creature.art}</div>
                            <div className="text-xs font-bold text-white mb-1 truncate">{creature.name}</div>
                            <div className="flex justify-center space-x-2 text-xs mb-1">
                              <span className="text-red-400 flex items-center">
                                <Sword className="w-3 h-3 mr-1" />{creature.attack}
                              </span>
                              <span className="text-blue-400 flex items-center">
                                <Shield className="w-3 h-3 mr-1" />{creature.defense}
                              </span>
                            </div>
                            <div className="flex justify-center mb-1">
                              {getElementIcon(creature.attribute)}
                            </div>
                            <Badge className={`text-xs ${
                              creature.rarity === 'Lendária' || creature.rarity === 'Mítica' ? 'bg-red-600' :
                              creature.rarity === 'Ultra Rara' ? 'bg-pink-600' :
                              creature.rarity === 'Super Rara' ? 'bg-purple-600' :
                              creature.rarity === 'Rara' ? 'bg-blue-600' : 'bg-gray-600'
                            }`}>
                              Nv.{creature.level}
                            </Badge>
                          </div>
                        ) : (
                          <div className="text-gray-500 text-center">
                            <div className="text-2xl mb-1">⭕</div>
                            <div className="text-xs">Vazio</div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Campo do Jogador */}
                <div className="text-center">
                  <h4 className="text-xl font-bold text-green-300 mb-3 flex items-center justify-center">
                    🏹 SEU CAMPO 
                    <Badge className="ml-2 bg-green-600">
                      {playerField.filter(c => c !== null).length}/5
                    </Badge>
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    {playerField.map((creature, index) => (
                      <Card 
                        key={`player-${index}`}
                        className={`h-36 flex items-center justify-center border-2 cursor-pointer ${
                          creature 
                            ? `${getRarityColor(creature.rarity)} hover:scale-105 ${selectedFieldCard === `player-${index}` ? 'ring-2 ring-yellow-400' : ''}` 
                            : 'border-dashed border-gray-600 bg-gray-800/20 hover:bg-gray-700/40'
                        } ${
                          selectedCard && !creature && getCardById(selectedCard)?.type === 'Criatura' && 
                          canAfford(getCardById(selectedCard))
                            ? 'border-green-400 bg-green-800/30 animate-pulse' : ''
                        } transition-all duration-300`}
                        onClick={() => {
                          if (!creature && selectedCard && getCardById(selectedCard)?.type === 'Criatura') {
                            const card = getCardById(selectedCard);
                            if (card && canAfford(card)) {
                              summonCreature(selectedCard, index, true);
                              setSelectedCard(null);
                            }
                          } else if (creature && gameState.turn === 'player') {
                            setSelectedFieldCard(selectedFieldCard === `player-${index}` ? null : `player-${index}`);
                          }
                        }}
                      >
                        {creature ? (
                          <div className="text-center p-2 w-full">
                            <div className="text-3xl mb-1">{creature.art}</div>
                            <div className="text-xs font-bold text-white mb-1 truncate">{creature.name}</div>
                            <div className="flex justify-center space-x-2 text-xs mb-1">
                              <span className="text-red-400 flex items-center">
                                <Sword className="w-3 h-3 mr-1" />{creature.attack}
                              </span>
                              <span className="text-blue-400 flex items-center">
                                <Shield className="w-3 h-3 mr-1" />{creature.defense}
                              </span>
                            </div>
                            <div className="flex justify-center mb-1">
                              {getElementIcon(creature.attribute)}
                            </div>
                            <div className="flex justify-center space-x-1 text-xs">
                              <Badge className={`${
                                creature.rarity === 'Lendária' || creature.rarity === 'Mítica' ? 'bg-red-600' :
                                creature.rarity === 'Ultra Rara' ? 'bg-pink-600' :
                                creature.rarity === 'Super Rara' ? 'bg-purple-600' :
                                creature.rarity === 'Rara' ? 'bg-blue-600' : 'bg-gray-600'
                              }`}>
                                Nv.{creature.level}
                              </Badge>
                              {creature.canAttack && !creature.attackedThisTurn && (
                                <Badge className="bg-green-600">
                                  ⚔️
                                </Badge>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500 text-center">
                            <div className="text-2xl mb-1">⭕</div>
                            <div className="text-xs">
                              {selectedCard && getCardById(selectedCard)?.type === 'Criatura' && 
                               canAfford(getCardById(selectedCard))
                                ? 'Clique para invocar' 
                                : 'Vazio'}
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Mão do Jogador */}
                <div className="bg-black/95 p-4 rounded-xl border-2 border-green-400/50">
                  <h5 className="text-lg font-bold text-green-300 mb-3 flex items-center justify-between">
                    <span>🃏 SUA MÃO</span>
                    <Badge className="bg-green-600">
                      {playerHand.length}/7 cartas
                    </Badge>
                  </h5>
                  
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {playerHand.map((cardId, index) => {
                      const card = getCardById(cardId);
                      if (!card) return null;
                      
                      const affordable = canAfford(card);
                      const isSelected = selectedCard === cardId;
                      
                      return (
                        <Card
                          key={`hand-${index}`}
                          className={`min-w-[160px] h-56 p-3 cursor-pointer transition-all duration-300 relative ${
                            getRarityColor(card.rarity)
                          } ${
                            isSelected 
                              ? 'ring-2 ring-yellow-400 scale-105 z-10' 
                              : 'hover:scale-105'
                          } ${
                            !affordable ? 'opacity-50 grayscale' : ''
                          }`}
                          onClick={() => {
                            if (affordable) {
                              setSelectedCard(isSelected ? null : cardId);
                            }
                          }}
                        >
                          <div className="text-center h-full flex flex-col justify-between">
                            {/* Header da carta */}
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <Gem className="w-3 h-3 text-blue-400" />
                                <span className="text-xs text-blue-400 ml-1 font-bold">{card.manaCost}</span>
                              </div>
                              <Badge className={`text-xs ${
                                card.rarity === 'Mítica' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                                card.rarity === 'Lendária' ? 'bg-red-600' :
                                card.rarity === 'Ultra Rara' ? 'bg-pink-600' :
                                card.rarity === 'Super Rara' ? 'bg-purple-600' :
                                card.rarity === 'Rara' ? 'bg-blue-600' : 'bg-gray-600'
                              }`}>
                                {card.rarity}
                              </Badge>
                            </div>
                            
                            {/* Arte e nome da carta */}
                            <div className="flex-1 flex flex-col justify-center">
                              <div className="text-4xl mb-2">{card.art}</div>
                              <div className="text-sm font-bold text-white mb-2 leading-tight">{card.name}</div>
                              
                              {/* Stats para Criaturas */}
                              {card.type === 'Criatura' && (
                                <>
                                  <div className="flex justify-center space-x-3 text-sm mb-2">
                                    <span className="text-red-400 flex items-center font-bold">
                                      <Sword className="w-3 h-3 mr-1" />{card.attack}
                                    </span>
                                    <span className="text-blue-400 flex items-center font-bold">
                                      <Shield className="w-3 h-3 mr-1" />{card.defense}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-300 mb-1">
                                    Nível {card.level} • {card.species}
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {/* Footer da carta */}
                            <div className="text-center">
                              <div className="flex justify-center items-center space-x-2 mb-2">
                                {getElementIcon(card.attribute)}
                                <Badge className={`text-xs ${
                                  card.type === 'Criatura' ? 'bg-red-600' : 
                                  card.type === 'Magia' ? 'bg-purple-600' : 'bg-orange-600'
                                }`}>
                                  {card.type}
                                </Badge>
                              </div>
                              
                              {card.region && (
                                <div className="text-xs text-gray-400">{card.region}</div>
                              )}
                            </div>

                            {/* Overlay de mana insuficiente */}
                            {!affordable && (
                              <div className="absolute inset-0 bg-red-900/70 rounded flex items-center justify-center">
                                <div className="text-center">
                                  <Lock className="w-6 h-6 text-red-400 mx-auto mb-1" />
                                  <div className="text-xs text-red-300 font-bold">MANA INSUFICIENTE</div>
                                </div>
                              </div>
                            )}

                            {/* Indicador de seleção */}
                            {isSelected && (
                              <div className="absolute -top-1 -right-1">
                                <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-black" />
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Botões de Ação Avançados */}
                {gameState.turn === 'player' && (
                  <div className="flex justify-center space-x-3">
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                      disabled={!selectedCard || getCardById(selectedCard)?.type !== 'Magia' || !canAfford(getCardById(selectedCard))}
                      onClick={() => {
                        if (selectedCard) {
                          castSpell(selectedCard, true);
                          setSelectedCard(null);
                        }
                      }}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      🔮 LANÇAR MAGIA
                    </Button>

                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                      disabled={currentPhase !== 'battle'}
                      onClick={() => {
                        if (selectedFieldCard?.startsWith('player-')) {
                          const attackerIndex = parseInt(selectedFieldCard.split('-')[1]);
                          const targetIndex = selectedFieldCard?.startsWith('enemy-') ? 
                            parseInt(selectedFieldCard.split('-')[1]) : null;
                          
                          if (attackWithCreature(attackerIndex, targetIndex)) {
                            setSelectedFieldCard(null);
                          }
                        }
                      }}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      ⚔️ ATACAR
                    </Button>

                    <Button
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                      onClick={() => {
                        if (currentPhase === 'draw') {
                          setCurrentPhase('main');
                        } else if (currentPhase === 'main') {
                          setCurrentPhase('battle');
                        } else if (currentPhase === 'battle') {
                          setCurrentPhase('end');
                        } else {
                          endTurn();
                        }
                      }}
                    >
                      <Timer className="w-4 h-4 mr-2" />
                      {currentPhase === 'draw' ? '📝 FASE PRINCIPAL' :
                       currentPhase === 'main' ? '⚔️ FASE BATALHA' :
                       currentPhase === 'battle' ? '🏁 FASE FINAL' :
                       '🔄 FINALIZAR TURNO'}
                    </Button>
                  </div>
                )}

                {/* Log de Batalha Avançado */}
                <Card className="bg-black/95 border-2 border-yellow-400/50 h-52">
                  <div className="p-4 h-full">
                    <h5 className="text-sm font-bold text-yellow-300 mb-2 flex items-center justify-between">
                      📜 LOG DE BATALHA ÉPICA
                      <Badge className="bg-yellow-600">
                        {gameState.battleLog.length} eventos
                      </Badge>
                    </h5>
                    <div className="space-y-1 h-36 overflow-y-auto text-sm">
                      {gameState.battleLog.slice(-15).reverse().map((entry) => (
                        <div 
                          key={entry.id} 
                          className={`p-2 rounded border-l-4 ${
                            entry.type === 'combat' || entry.type === 'direct_attack' ? 'bg-red-900/30 border-red-400 text-red-200' :
                            entry.type === 'summon' ? 'bg-green-900/30 border-green-400 text-green-200' :
                            entry.type === 'spell' ? 'bg-purple-900/30 border-purple-400 text-purple-200' :
                            entry.type === 'game_start' ? 'bg-yellow-900/30 border-yellow-400 text-yellow-200' :
                            'bg-blue-900/30 border-blue-400 text-blue-200'
                          } transition-all duration-300`}
                        >
                          <div className="font-semibold flex items-center justify-between">
                            <span>{entry.message}</span>
                            {entry.rarity && (
                              <Badge className={`text-xs ml-2 ${
                                entry.rarity === 'Mítica' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                                entry.rarity === 'Lendária' ? 'bg-red-600' :
                                entry.rarity === 'Ultra Rara' ? 'bg-pink-600' :
                                entry.rarity === 'Super Rara' ? 'bg-purple-600' :
                                entry.rarity === 'Rara' ? 'bg-blue-600' : 'bg-gray-600'
                              }`}>
                                {entry.rarity}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Tela de Vitória Épica */}
          {gameState.phase === 'victory' && (
            <div className="text-center space-y-8">
              <div className="bg-black/95 rounded-3xl p-16 border-4 border-yellow-400 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/50 via-yellow-900/50 to-emerald-900/50 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="text-9xl animate-bounce mb-8">🏆</div>
                  <h2 className="text-7xl font-black mb-8 bg-gradient-to-r from-yellow-300 via-orange-400 to-green-400 bg-clip-text text-transparent animate-pulse">
                    VITÓRIA LENDÁRIA!
                  </h2>
                  <p className="text-3xl text-green-300 mb-8 font-bold">🎉 Você dominou as lendas do Brasil! 🎉</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                    <div className="bg-yellow-800/50 p-6 rounded-xl border border-yellow-400/50">
                      <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-yellow-400">ÉPICA</div>
                      <div className="text-yellow-300">Vitória</div>
                    </div>
                    <div className="bg-purple-800/50 p-6 rounded-xl border border-purple-400/50">
                      <Zap className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-purple-400">{gameState.streak}</div>
                      <div className="text-purple-300">Sequência</div>
                    </div>
                    <div className="bg-green-800/50 p-6 rounded-xl border border-green-400/50">
                      <Timer className="w-10 h-10 text-green-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-green-400">{formatTime(gameState.gameTime)}</div>
                      <div className="text-green-300">Tempo</div>
                    </div>
                    <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-400/50">
                      <Star className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-blue-400">{gameState.turnCount}</div>
                      <div className="text-blue-300">Turnos</div>
                    </div>
                  </div>

                  {/* Conquistas especiais */}
                  <div className="bg-black/50 p-6 rounded-xl mb-8">
                    <h3 className="text-2xl font-bold text-cyan-300 mb-4">🎖️ Conquistas desta Batalha</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Badge className="bg-green-600 p-3">
                        🏹 {gameState.monstersDefeated} Criaturas Derrotadas
                      </Badge>
                      <Badge className="bg-purple-600 p-3">
                        🔮 {gameState.spellsCast} Magias Lançadas
                      </Badge>
                      <Badge className="bg-yellow-600 p-3">
                        ⭐ Dificuldade {gameState.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-6">
                <Button
                  size="xl"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-12 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-500"
                  onClick={() => startDuel(gameState.difficulty)}
                >
                  <RotateCcw className="w-8 h-8 mr-4" />
                  ⚔️ NOVO DUELO ÉPICO
                </Button>
                <Button
                  size="xl"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-12 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-500"
                  onClick={() => setGameState(prev => ({ ...prev, phase: 'menu' }))}
                >
                  <Crown className="w-8 h-8 mr-4" />
                  🏠 MENU PRINCIPAL
                </Button>
              </div>
            </div>
          )}

          {/* Tela de Derrota Épica */}
          {gameState.phase === 'defeat' && (
            <div className="text-center space-y-8">
              <div className="bg-black/95 rounded-3xl p-16 border-4 border-red-400 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/50 via-orange-900/50 to-gray-900/50 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="text-9xl animate-pulse mb-8">💀</div>
                  <h2 className="text-7xl font-black mb-8 bg-gradient-to-r from-red-400 via-orange-400 to-gray-400 bg-clip-text text-transparent">
                    DERROTA HONROSA
                  </h2>
                  <p className="text-3xl text-red-300 mb-8 font-bold">⚰️ Os espíritos sombrios prevaleceram desta vez... ⚰️</p>
                  
                  <div className="bg-gray-800/50 p-8 rounded-xl border border-red-400/50 max-w-2xl mx-auto mb-8">
                    <h3 className="text-2xl font-bold text-red-300 mb-6">📊 Estatísticas da Batalha Épica</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <Timer className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-orange-400">{formatTime(gameState.gameTime)}</div>
                        <div className="text-orange-300 text-sm">Duração</div>
                      </div>
                      <div className="text-center">
                        <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-400">{gameState.turnCount}</div>
                        <div className="text-blue-300 text-sm">Turnos</div>
                      </div>
                      <div className="text-center">
                        <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-400">{gameState.spellsCast}</div>
                        <div className="text-purple-300 text-sm">Magias</div>
                      </div>
                      <div className="text-center">
                        <Skull className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-400">{gameState.monstersDefeated}</div>
                        <div className="text-red-300 text-sm">Derrotas</div>
                      </div>
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
              </div>
              
              <div className="flex justify-center space-x-6">
                <Button
                  size="xl"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-12 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-500"
                  onClick={() => startDuel(gameState.difficulty)}
                >
                  <Sword className="w-8 h-8 mr-4" />
                  ⚔️ BUSCAR VINGANÇA!
                </Button>
                <Button
                  size="xl"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-12 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-500"
                  onClick={() => setGameState(prev => ({ ...prev, phase: 'menu' }))}
                >
                  <RotateCcw className="w-8 h-8 mr-4" />
                  🔄 MENU PRINCIPAL
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaeteLegendsNetflix;