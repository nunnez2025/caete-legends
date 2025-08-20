import { useState, useCallback, useEffect, useRef } from 'react';
import { getCardById, createBalancedDeck } from '../game/brazilian-folklore-cards';
import { AdvancedGameEngine } from '../game/advanced-game-mechanics';
import { soundSystem } from '../game/sound-system';

export interface GameState {
  phase: 'menu' | 'duel' | 'victory' | 'defeat' | 'settings' | 'tutorial';
  turn: 'player' | 'enemy';
  turnCount: number;
  playerLifePoints: number;
  enemyLifePoints: number;
  playerMana: number;
  enemyMana: number;
  maxMana: number;
  battleLog: BattleLogEntry[];
  playerWins: number;
  playerLosses: number;
  streak: number;
  spellsCast: number;
  monstersDefeated: number;
  gameTime: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Lendário';
  soundEnabled: boolean;
  musicEnabled: boolean;
  animationsEnabled: boolean;
  currentWeather?: string;
  specialEvents: string[];
  combo: number;
  maxCombo: number;
  legendariesSummoned: number;
}

export interface BattleLogEntry {
  id: number;
  message: string;
  timestamp: number;
  type: 'game_start' | 'summon' | 'attack' | 'spell' | 'effect' | 'weather' | 'combo';
  rarity?: string;
  element?: string;
  damage?: number;
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'menu',
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
    difficulty: 'Médio',
    soundEnabled: true,
    musicEnabled: true,
    animationsEnabled: true,
    specialEvents: [],
    combo: 0,
    maxCombo: 0,
    legendariesSummoned: 0
  });

  const [playerDeck, setPlayerDeck] = useState<string[]>([]);
  const [enemyDeck, setEnemyDeck] = useState<string[]>([]);
  const [playerHand, setPlayerHand] = useState<string[]>([]);
  const [enemyHand, setEnemyHand] = useState<string[]>([]);
  const [playerField, setPlayerField] = useState<any[]>([null, null, null, null, null]);
  const [enemyField, setEnemyField] = useState<any[]>([null, null, null, null, null]);
  const [gameTimer, setGameTimer] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'draw' | 'main' | 'battle' | 'end'>('draw');

  const timerRef = useRef<NodeJS.Timeout>();

  // Inicializar sistema de som
  useEffect(() => {
    soundSystem.loadSounds();
  }, []);

  // Timer do jogo
  useEffect(() => {
    if (gameState.phase === 'duel') {
      timerRef.current = setInterval(() => {
        setGameTimer(prev => prev + 1);
        setGameState(prev => ({ ...prev, gameTime: prev.gameTime + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.phase]);

  // Adicionar entrada no log de batalha
  const addBattleLog = useCallback((entry: Omit<BattleLogEntry, 'id' | 'timestamp'>) => {
    setGameState(prev => ({
      ...prev,
      battleLog: [...prev.battleLog, {
        ...entry,
        id: Date.now(),
        timestamp: Date.now()
      }]
    }));
  }, []);

  // Comprar carta
  const drawCard = useCallback((isPlayer: boolean, count: number = 1) => {
    for (let i = 0; i < count; i++) {
      if (isPlayer && playerDeck.length > 0) {
        setPlayerDeck(prev => {
          const newDeck = [...prev];
          const drawnCard = newDeck.shift();
          if (drawnCard) {
            setPlayerHand(hand => {
              if (hand.length >= 7) {
                addBattleLog({
                  message: '❌ Mão cheia! Carta descartada',
                  type: 'effect'
                });
                return hand;
              }
              return [...hand, drawnCard];
            });
          }
          return newDeck;
        });
        if (gameState.soundEnabled) soundSystem.playSound('draw_card');
      } else if (!isPlayer && enemyDeck.length > 0) {
        setEnemyDeck(prev => {
          const newDeck = [...prev];
          const drawnCard = newDeck.shift();
          if (drawnCard) {
            setEnemyHand(hand => [...hand, drawnCard]);
          }
          return newDeck;
        });
      }
    }
  }, [playerDeck, enemyDeck, gameState.soundEnabled, addBattleLog]);

  // Verificar se pode pagar o custo
  const canAfford = useCallback((card: any, isPlayer: boolean = true) => {
    if (!card || !card.manaCost) return true;
    const mana = isPlayer ? gameState.playerMana : gameState.enemyMana;
    return mana >= card.manaCost;
  }, [gameState.playerMana, gameState.enemyMana]);

  // Invocar criatura com mecânicas avançadas
  const summonCreature = useCallback((cardId: string, position: number, isPlayer: boolean = true) => {
    const card = getCardById(cardId);
    if (!card || card.type !== 'Criatura') return false;

    if (!canAfford(card, isPlayer)) return false;

    // Verificar tributos necessários
    const tributesNeeded = Math.max(0, card.level - 4);
    if (tributesNeeded > 0) {
      const field = isPlayer ? playerField : enemyField;
      const availableCreatures = field.filter(c => c !== null);
      
      if (availableCreatures.length < tributesNeeded) {
        if (isPlayer) {
          addBattleLog({
            message: `❌ Precisa de ${tributesNeeded} tributos para invocar ${card.name}!`,
            type: 'effect'
          });
        }
        return false;
      }
      
      // Remover tributos
      const fieldSetter = isPlayer ? setPlayerField : setEnemyField;
      fieldSetter(prev => {
        const newField = [...prev];
        let tributesRemoved = 0;
        for (let i = 0; i < newField.length && tributesRemoved < tributesNeeded; i++) {
          if (newField[i] !== null) {
            addBattleLog({
              message: `💀 ${newField[i].name} foi oferecido como tributo`,
              type: 'effect'
            });
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
        prev[isPlayer ? 'playerMana' : 'enemyMana'] - card.manaCost,
      legendariesSummoned: card.rarity === 'Lendária' || card.rarity === 'Mítica' ? 
        prev.legendariesSummoned + 1 : prev.legendariesSummoned
    }));

    // Criar instância da criatura
    const summoned = { 
      ...card, 
      id: cardId,
      instanceId: `${cardId}_${Date.now()}`,
      summoned: true,
      canAttack: false,
      attackedThisTurn: false,
      currentAttack: card.attack,
      currentDefense: card.defense,
      effects: [],
      position
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

    // Efeitos sonoros e visuais
    if (gameState.soundEnabled) soundSystem.playSound('summon');
    
    // Log de batalha com detalhes
    addBattleLog({
      message: `${isPlayer ? '🏹 Você invocou' : '👹 Oponente invocou'} ${card.name}! (ATK: ${card.attack}/DEF: ${card.defense})`,
      type: 'summon',
      rarity: card.rarity,
      element: card.attribute
    });

    return true;
  }, [gameState, playerField, enemyField, canAfford, addBattleLog]);

  // Lançar magia com efeitos avançados
  const castSpell = useCallback((cardId: string, isPlayer: boolean = true) => {
    const card = getCardById(cardId);
    if (!card || card.type !== 'Magia') return false;

    if (!canAfford(card, isPlayer)) return false;

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

    // Som e log
    if (gameState.soundEnabled) soundSystem.playSound('cast_spell');
    addBattleLog({
      message: `🔮 ${isPlayer ? 'Você lançou' : 'Oponente lançou'} ${card.name}!`,
      type: 'spell',
      rarity: card.rarity,
      element: card.attribute
    });

    return true;
  }, [gameState, canAfford, addBattleLog]);

  // Aplicar efeitos das magias
  const applySpellEffects = useCallback((card: any, isPlayer: boolean) => {
    switch (card.id) {
      case 'ritual_paje':
        // Implementar ritual do pajé
        addBattleLog({
          message: '🔥 Os ancestrais respondem ao chamado!',
          type: 'effect',
          element: 'Espírito'
        });
        break;
        
      case 'encanto_iara':
        addBattleLog({
          message: '🧜‍♀️ O canto hipnótico ecoa pelas águas...',
          type: 'effect',
          element: 'Água'
        });
        break;
        
      case 'furia_boitata':
        const damage = 1000;
        setGameState(prev => ({
          ...prev,
          [isPlayer ? 'enemyLifePoints' : 'playerLifePoints']: 
            prev[isPlayer ? 'enemyLifePoints' : 'playerLifePoints'] - damage
        }));
        addBattleLog({
          message: `🐍🔥 Fúria do Boitatá causa ${damage} de dano!`,
          type: 'spell',
          damage,
          element: 'Fogo'
        });
        break;
        
      default:
        addBattleLog({
          message: `✨ ${card.name} foi lançada com sucesso!`,
          type: 'spell'
        });
    }
  }, [addBattleLog]);

  // Atacar com criatura
  const attackWithCreature = useCallback((attackerIndex: number, targetIndex: number | null = null) => {
    const attacker = playerField[attackerIndex];
    if (!attacker || !attacker.canAttack || attacker.attackedThisTurn) {
      addBattleLog({
        message: '❌ Esta criatura não pode atacar agora!',
        type: 'effect'
      });
      return false;
    }

    if (targetIndex === null) {
      // Ataque direto
      const damage = attacker.currentAttack;
      setGameState(prev => ({
        ...prev,
        enemyLifePoints: prev.enemyLifePoints - damage
      }));
      
      addBattleLog({
        message: `⚔️ ${attacker.name} atacou diretamente causando ${damage} de dano!`,
        type: 'attack',
        damage,
        element: attacker.attribute
      });
      
    } else {
      // Ataque contra criatura
      const target = enemyField[targetIndex];
      if (!target) return false;

      const battleResult = AdvancedGameEngine.calculateBattleDamage(attacker, target);
      
      addBattleLog({
        message: `⚔️ ${attacker.name} ataca ${target.name}!`,
        type: 'attack',
        element: attacker.attribute
      });

      // Aplicar dano e remover criaturas destruídas
      if (battleResult.attackerDamage > 0) {
        setEnemyField(prev => {
          const newField = [...prev];
          newField[targetIndex] = null;
          return newField;
        });
        addBattleLog({
          message: `💀 ${target.name} foi destruído!`,
          type: 'effect'
        });
        setGameState(prev => ({ ...prev, monstersDefeated: prev.monstersDefeated + 1 }));
      }
      
      if (battleResult.defenderDamage > 0) {
        setPlayerField(prev => {
          const newField = [...prev];
          newField[attackerIndex] = null;
          return newField;
        });
        addBattleLog({
          message: `💀 ${attacker.name} foi destruído!`,
          type: 'effect'
        });
      }

      // Adicionar efeitos especiais ao log
      battleResult.effects.forEach(effect => {
        addBattleLog({
          message: effect,
          type: 'effect'
        });
      });
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

    if (gameState.soundEnabled) {
      soundSystem.playSound(targetIndex === null ? 'attack' : 'battle');
    }

    return true;
  }, [playerField, enemyField, gameState.soundEnabled, addBattleLog]);

  // Finalizar turno
  const endTurn = useCallback(() => {
    // Resetar status de ataque das criaturas
    setPlayerField(prev => prev.map(c => c ? { 
      ...c, 
      canAttack: true, 
      attackedThisTurn: false 
    } : c));
    
    setGameState(prev => ({
      ...prev,
      turn: 'enemy',
      enemyMana: Math.min(prev.maxMana, 4 + Math.floor(prev.turnCount / 2)),
      combo: 0 // Reset combo no fim do turno
    }));
    
    drawCard(false, 1);
    setCurrentPhase('draw');
    
    if (gameState.soundEnabled) soundSystem.playSound('end_turn');
    
    addBattleLog({
      message: '🔄 Turno finalizado',
      type: 'effect'
    });
  }, [drawCard, gameState.soundEnabled, addBattleLog]);

  // Iniciar duelo
  const startDuel = useCallback((difficulty: string = 'Médio') => {
    const newPlayerDeck = createBalancedDeck();
    const newEnemyDeck = createBalancedDeck();
    
    setPlayerDeck(newPlayerDeck);
    setEnemyDeck(newEnemyDeck);
    
    // Selecionar clima aleatório
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
      maxMana: 10,
      difficulty,
      currentWeather: randomWeather,
      battleLog: [{
        id: 1,
        message: `🏹⚔️ O duelo épico das lendas brasileiras se inicia sob ${randomWeather}! Que os espíritos ancestrais guiem sua batalha!`,
        type: 'game_start'
      }],
      spellsCast: 0,
      monstersDefeated: 0,
      gameTime: 0,
      combo: 0,
      maxCombo: 0,
      legendariesSummoned: 0,
      specialEvents: []
    }));

    // Reset completo
    setPlayerHand([]);
    setEnemyHand([]);
    setPlayerField([null, null, null, null, null]);
    setEnemyField([null, null, null, null, null]);
    setCurrentPhase('draw');
    setGameTimer(0);

    // Música de batalha
    if (gameState.musicEnabled) soundSystem.playMusic('battle_theme');

    // Distribuir cartas iniciais
    setTimeout(() => {
      drawCard(true, 5);
      drawCard(false, 5);
    }, 500);
  }, [drawCard, gameState.musicEnabled]);

  // Verificar condições de vitória
  useEffect(() => {
    if (gameState.phase === 'duel') {
      if (gameState.playerLifePoints <= 0) {
        setGameState(prev => ({ 
          ...prev, 
          phase: 'defeat',
          playerLosses: prev.playerLosses + 1,
          streak: 0
        }));
        if (gameState.musicEnabled) soundSystem.playMusic('defeat');
      } else if (gameState.enemyLifePoints <= 0) {
        setGameState(prev => ({ 
          ...prev, 
          phase: 'victory',
          playerWins: prev.playerWins + 1,
          streak: prev.streak + 1
        }));
        if (gameState.musicEnabled) soundSystem.playMusic('victory');
      }
    }
  }, [gameState.playerLifePoints, gameState.enemyLifePoints, gameState.phase, gameState.musicEnabled]);

  // Atualizar configurações
  const updateSettings = useCallback((newSettings: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...newSettings }));
    
    // Aplicar configurações de áudio
    if ('soundEnabled' in newSettings || 'musicEnabled' in newSettings) {
      if (!newSettings.soundEnabled) soundSystem.setSfxVolume(0);
      if (!newSettings.musicEnabled) soundSystem.stopMusic();
    }
  }, []);

  // Resetar jogo
  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'menu',
      playerLifePoints: 8000,
      enemyLifePoints: 8000,
      turnCount: 1,
      gameTime: 0,
      battleLog: [],
      combo: 0,
      maxCombo: 0,
      legendariesSummoned: 0
    }));
    
    setPlayerDeck([]);
    setEnemyDeck([]);
    setPlayerHand([]);
    setEnemyHand([]);
    setPlayerField([null, null, null, null, null]);
    setEnemyField([null, null, null, null, null]);
    setGameTimer(0);
    setCurrentPhase('draw');
    
    soundSystem.stopMusic();
  }, []);

  return {
    // Estado
    gameState,
    playerDeck,
    enemyDeck,
    playerHand,
    enemyHand,
    playerField,
    enemyField,
    gameTimer,
    currentPhase,
    
    // Ações
    drawCard,
    canAfford,
    summonCreature,
    castSpell,
    attackWithCreature,
    endTurn,
    startDuel,
    updateSettings,
    resetGame,
    addBattleLog,
    
    // Setters para componentes externos
    setCurrentPhase,
    setGameState,
    setPlayerField,
    setEnemyField
  };
};

export default useGameState;