import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Scene3D from '../3d/Scene3D';
import Card3D from '../3d/Card3D';
import { audioManager } from '../../services/audio';
import { gameAPI } from '../../services/api';
import { 
  Sword, Shield, Zap, Heart, Star, Flame, 
  Crown, Skull, Mountain, TreePine, Fish, Bird, 
  Sparkles, Target, Timer, Volume2, 
  RotateCcw, PlayCircle, Trophy, Gem, Moon, Sun,
  Settings, Check, Lock, Waves, Wind, Eye,
  Leaf, Feather, VolumeX, Volume1
} from 'lucide-react';

const CaeteCardGameMobile = () => {
  const [gameState, setGameState] = useState({
    phase: 'menu',
    turn: 'player',
    turnCount: 1,
    playerLifePoints: 8000,
    enemyLifePoints: 8000,
    playerMana: 4,
    enemyMana: 4,
    maxMana: 4,
    battleLog: [],
    playerWins: 0,
    playerLosses: 0,
    streak: 0,
    spellsCast: 0,
    monstersDefeated: 0
  });

  const [settings, setSettings] = useState({
    soundEnabled: true,
    musicEnabled: true,
    volume: 0.7,
    musicVolume: 0.5,
    show3D: true,
    showEffects: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Banco de dados de cartas expandido
  const cardDatabase = {
    monsters: [
      {
        id: 'caete_warrior',
        name: 'Guerreiro Caeté',
        type: 'Monster',
        element: 'Terra',
        attack: 1400,
        defense: 1000,
        manaCost: 3,
        rarity: 'common',
        art: '🏹',
        description: 'Valente guerreiro da tribo Caeté'
      },
      {
        id: 'curupira',
        name: 'Curupira Guardião',
        type: 'Monster',
        element: 'Floresta',
        attack: 2400,
        defense: 2100,
        manaCost: 6,
        rarity: 'legendary',
        art: '👣',
        description: 'Protetor das florestas brasileiras'
      },
      {
        id: 'saci',
        name: 'Saci Pererê',
        type: 'Monster',
        element: 'Vento',
        attack: 1100,
        defense: 800,
        manaCost: 3,
        rarity: 'common',
        art: '🌪️',
        description: 'Travesso espírito do vento'
      },
      {
        id: 'iara',
        name: 'Iara Sedutora',
        type: 'Monster',
        element: 'Água',
        attack: 2600,
        defense: 2200,
        manaCost: 7,
        rarity: 'legendary',
        art: '🧜‍♀️',
        description: 'Sereia sedutora dos rios'
      },
      {
        id: 'boto',
        name: 'Boto Cor-de-Rosa',
        type: 'Monster',
        element: 'Água',
        attack: 1800,
        defense: 1500,
        manaCost: 5,
        rarity: 'rare',
        art: '🐬',
        description: 'Golfinho mágico amazônico'
      },
      {
        id: 'mapinguari',
        name: 'Mapinguari',
        type: 'Monster',
        element: 'Terra',
        attack: 3000,
        defense: 2800,
        manaCost: 8,
        rarity: 'legendary',
        art: '🦍',
        description: 'Gigante da floresta amazônica'
      }
    ],
    spells: [
      {
        id: 'canto_paje',
        name: 'Canto do Pajé',
        type: 'Spell',
        element: 'Espírito',
        manaCost: 2,
        rarity: 'common',
        art: '🎵',
        description: 'Restaura 1000 pontos de vida'
      },
      {
        id: 'furia_floresta',
        name: 'Fúria da Floresta',
        type: 'Spell',
        element: 'Floresta',
        manaCost: 4,
        rarity: 'rare',
        art: '🌳',
        description: 'Aumenta o ataque de todos os monstros'
      },
      {
        id: 'chuva_amazonica',
        name: 'Chuva Amazônica',
        type: 'Spell',
        element: 'Água',
        manaCost: 3,
        rarity: 'common',
        art: '🌧️',
        description: 'Cura 500 pontos de vida por turno'
      },
      {
        id: 'vento_sertao',
        name: 'Vento do Sertão',
        type: 'Spell',
        element: 'Vento',
        manaCost: 2,
        rarity: 'common',
        art: '💨',
        description: 'Permite jogar uma carta adicional'
      }
    ]
  };

  const [playerDeck, setPlayerDeck] = useState([]);
  const [enemyDeck, setEnemyDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [enemyHand, setEnemyHand] = useState([]);
  const [playerField, setPlayerField] = useState([null, null, null, null, null]);
  const [enemyField, setEnemyField] = useState([null, null, null, null, null]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);

  // Funções utilitárias
  const addFloatingText = useCallback((text, color = 'text-yellow-400') => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { 
      id, 
      text, 
      color, 
      position: { x: 50, y: 50 }, 
      opacity: 1 
    }]);
    
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const getCardById = useCallback((cardId) => {
    const cleanId = cardId.replace(/_\d+$/, '');
    return [...cardDatabase.monsters, ...cardDatabase.spells].find(c => c.id === cleanId);
  }, []);

  const canAfford = useCallback((card, isPlayer = true) => {
    if (!card || !card.manaCost) return true;
    const mana = isPlayer ? gameState.playerMana : gameState.enemyMana;
    return mana >= card.manaCost;
  }, [gameState.playerMana, gameState.enemyMana]);

  const shuffleDeck = useCallback((deck) => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  }, []);

  const drawCard = useCallback((isPlayer, count = 1) => {
    for (let i = 0; i < count; i++) {
      if (isPlayer && playerDeck.length > 0) {
        setPlayerDeck(prev => {
          const newDeck = [...prev];
          const drawnCard = newDeck.shift();
          setPlayerHand(hand => [...hand, drawnCard]);
          return newDeck;
        });
        audioManager.playGameEvent('card_draw');
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

  const createBalancedDeck = useCallback(() => {
    const monsters = cardDatabase.monsters.slice();
    const spells = cardDatabase.spells.slice();
    const deck = [];
    
    for (let i = 0; i < 15; i++) {
      const randomMonster = monsters[Math.floor(Math.random() * monsters.length)];
      deck.push(randomMonster.id + '_' + i);
    }
    
    for (let i = 0; i < 5; i++) {
      const randomSpell = spells[Math.floor(Math.random() * spells.length)];
      deck.push(randomSpell.id + '_' + i);
    }

    return shuffleDeck(deck);
  }, [shuffleDeck]);

  // Funções de jogo
  const summonMonster = useCallback((cardId, position, isPlayer = true) => {
    const card = getCardById(cardId);
    if (!card || card.type !== 'Monster') return false;

    const currentMana = isPlayer ? gameState.playerMana : gameState.enemyMana;
    if (currentMana < card.manaCost) return false;

    setGameState(prev => ({
      ...prev,
      [isPlayer ? 'playerMana' : 'enemyMana']: 
        prev[isPlayer ? 'playerMana' : 'enemyMana'] - card.manaCost
    }));

    const summoned = { ...card, id: cardId };

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

    addFloatingText(`✨ ${card.name} Invocado!`, 'text-blue-400');
    audioManager.playGameEvent('summon');

    setGameState(prev => ({
      ...prev,
      battleLog: [...prev.battleLog, {
        id: Date.now(),
        message: `${isPlayer ? '🏹 Você invocou' : '👹 Oponente invocou'} ${card.name}!`,
        timestamp: Date.now(),
        type: 'summon'
      }]
    }));

    return true;
  }, [getCardById, gameState.playerMana, gameState.enemyMana, addFloatingText]);

  const castSpell = useCallback((cardId, isPlayer = true) => {
    const card = getCardById(cardId);
    if (!card || card.type !== 'Spell') return false;

    const currentMana = isPlayer ? gameState.playerMana : gameState.enemyMana;
    if (currentMana < card.manaCost) return false;

    setGameState(prev => ({
      ...prev,
      [isPlayer ? 'playerMana' : 'enemyMana']: 
        prev[isPlayer ? 'playerMana' : 'enemyMana'] - card.manaCost,
      spellsCast: prev.spellsCast + 1
    }));

    if (isPlayer) {
      setPlayerHand(prev => prev.filter(c => c !== cardId));
    } else {
      setEnemyHand(prev => prev.filter(c => c !== cardId));
    }

    audioManager.playGameEvent('magic');

    // Efeitos das magias
    if (card.id === 'canto_paje') {
      setGameState(prev => ({
        ...prev,
        [isPlayer ? 'playerLifePoints' : 'enemyLifePoints']: 
          Math.min(8000, prev[isPlayer ? 'playerLifePoints' : 'enemyLifePoints'] + 1000)
      }));
      drawCard(isPlayer, 1);
      addFloatingText('💚 +1000 LP!', 'text-green-400');
      audioManager.playGameEvent('heal');
    }

    return true;
  }, [getCardById, gameState.playerMana, gameState.enemyMana, drawCard, addFloatingText]);

  // IA inteligente
  const smartAI = useCallback(() => {
    if (gameState.turn !== 'enemy' || gameState.phase !== 'duel') return;

    setTimeout(() => {
      const monstersInHand = enemyHand
        .map(cardId => getCardById(cardId))
        .filter(card => card && card.type === 'Monster' && canAfford(card, false));

      if (monstersInHand.length > 0 && gameState.enemyMana >= 3) {
        const emptySlot = enemyField.findIndex(slot => slot === null);
        if (emptySlot !== -1) {
          const chosenMonster = monstersInHand[0];
          const cardId = enemyHand.find(id => getCardById(id).id === chosenMonster.id);
          summonMonster(cardId, emptySlot, false);
        }
      }

      setTimeout(() => {
        const enemyMonstersOnField = enemyField.filter(monster => monster !== null);

        if (enemyMonstersOnField.length > 0) {
          enemyMonstersOnField.forEach((monster) => {
            const directDamage = monster.attack;
            
            setGameState(prev => ({
              ...prev,
              playerLifePoints: prev.playerLifePoints - directDamage,
              battleLog: [...prev.battleLog, {
                id: Date.now(),
                message: `💀 ${monster.name} atacou diretamente! ${directDamage} de dano!`,
                timestamp: Date.now(),
                type: 'direct_attack'
              }]
            }));
            audioManager.playGameEvent('damage');
          });
        }

        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            turn: 'player',
            turnCount: prev.turnCount + 1,
            playerMana: Math.min(10, prev.maxMana + Math.floor(prev.turnCount / 2)),
            enemyMana: Math.min(10, prev.maxMana + Math.floor(prev.turnCount / 2))
          }));
          drawCard(true, 1);
        }, 1500);
      }, 1000);
    }, 2000);
  }, [gameState, enemyHand, enemyField, getCardById, canAfford, summonMonster, drawCard]);

  // Finalizar turno
  const endTurn = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      turn: 'enemy',
      enemyMana: Math.min(10, prev.maxMana + Math.floor(prev.turnCount / 2))
    }));
    
    drawCard(false, 1);
    addFloatingText('🔄 Turno Finalizado', 'text-blue-400');
    audioManager.playGameEvent('button_click');
  }, [drawCard, addFloatingText]);

  // Iniciar duelo
  const startDuel = useCallback(() => {
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
      maxMana: 4,
      battleLog: [{
        id: 1,
        message: '🏹⚔️ O duelo sagrado entre as tribos Caeté se inicia!',
        timestamp: Date.now(),
        type: 'game_start'
      }],
      spellsCast: 0,
      monstersDefeated: 0
    }));

    setPlayerHand([]);
    setEnemyHand([]);
    setPlayerField([null, null, null, null, null]);
    setEnemyField([null, null, null, null, null]);
    setSelectedCard(null);
    setFloatingTexts([]);

    audioManager.playBattleMusic();

    setTimeout(() => {
      drawCard(true, 5);
      drawCard(false, 5);
      addFloatingText('🎴 Cartas Distribuídas!', 'text-cyan-400');
    }, 500);
  }, [createBalancedDeck, drawCard, addFloatingText]);

  // Efeitos
  useEffect(() => {
    if (gameState.playerLifePoints <= 0) {
      setGameState(prev => ({ 
        ...prev, 
        phase: 'defeat',
        playerLosses: prev.playerLosses + 1,
        streak: 0
      }));
      audioManager.playGameEvent('defeat');
    } else if (gameState.enemyLifePoints <= 0) {
      setGameState(prev => ({ 
        ...prev, 
        phase: 'victory',
        playerWins: prev.playerWins + 1,
        streak: prev.streak + 1
      }));
      audioManager.playGameEvent('victory');
    }
  }, [gameState.playerLifePoints, gameState.enemyLifePoints]);

  useEffect(() => {
    if (gameState.turn === 'enemy') {
      smartAI();
    }
  }, [gameState.turn, smartAI]);

  // Inicialização
  useEffect(() => {
    audioManager.playMenuMusic();
  }, []);

  // Funções utilitárias para UI
  const getRarityColor = (rarity) => {
    const colors = {
      common: 'border-gray-400 bg-gradient-to-br from-gray-800 to-gray-900',
      rare: 'border-blue-400 bg-gradient-to-br from-blue-800 to-blue-900',
      super_rare: 'border-purple-400 bg-gradient-to-br from-purple-800 to-purple-900',
      legendary: 'border-red-400 bg-gradient-to-br from-red-800 via-orange-800 to-yellow-800 animate-pulse'
    };
    return colors[rarity] || colors.common;
  };

  const getElementIcon = (element) => {
    const icons = {
      Terra: <Mountain className="w-4 h-4 text-amber-500" />,
      Água: <Waves className="w-4 h-4 text-blue-400" />,
      Fogo: <Flame className="w-4 h-4 text-red-500" />,
      Floresta: <TreePine className="w-4 h-4 text-green-500" />,
      Vento: <Wind className="w-4 h-4 text-cyan-400" />,
      Espírito: <Eye className="w-4 h-4 text-purple-400" />
    };
    return icons[element] || <Star className="w-4 h-4 text-gray-400" />;
  };

  // Renderização condicional baseada na fase do jogo
  if (gameState.phase === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-amber-900 to-red-900 text-white relative overflow-hidden">
        {/* Cena 3D de fundo */}
        {settings.show3D && (
          <div className="absolute inset-0 z-0">
            <Scene3D gameState={gameState} />
          </div>
        )}

        {/* Interface do menu */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
          <div className="text-center space-y-8">
            <div className="bg-black/80 rounded-3xl p-12 border-4 border-yellow-400/50 shadow-2xl">
              <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-emerald-300 via-yellow-300 to-red-300 bg-clip-text text-transparent animate-pulse">
                CAETÉ LEGENDS
              </h1>
              <p className="text-2xl text-orange-300 mb-8 font-bold">
                🏹 Edição Brasileira Pro 🏹
              </p>
            </div>

            <Button
              size="xl"
              className="bg-gradient-to-r from-emerald-600 via-yellow-600 to-red-600 hover:from-emerald-700 hover:via-yellow-700 hover:to-red-700 text-white font-black py-6 px-12 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-500"
              onClick={startDuel}
            >
              <PlayCircle className="w-8 h-8 mr-4" />
              <span className="text-2xl">⚔️ INICIAR DUELO ⚔️</span>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-6 h-6 mr-2" />
              Configurações
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.phase === 'victory') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-amber-900 to-red-900 text-white relative overflow-hidden">
        {settings.show3D && (
          <div className="absolute inset-0 z-0">
            <Scene3D gameState={gameState} />
          </div>
        )}

        <div className="relative z-10 text-center space-y-8 flex items-center justify-center min-h-screen p-6">
          <div className="w-full">
            <div className="bg-black/90 rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl max-w-2xl mx-auto">
              <div className="text-7xl animate-bounce mb-6">🏆</div>
              <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent animate-pulse">
                VITÓRIA ÉPICA!
              </h2>
              <p className="text-xl text-green-300 mb-6 font-bold">🎉 Você dominou as lendas brasileiras! 🎉</p>

              <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-6">
                <div className="bg-yellow-800/50 p-4 rounded-xl border border-yellow-400/50">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-400">VITÓRIA</div>
                  <div className="text-yellow-300">Épica!</div>
                </div>
                <div className="bg-purple-800/50 p-4 rounded-xl border border-purple-400/50">
                  <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-400">{gameState.streak}</div>
                  <div className="text-purple-300">Sequência</div>
                </div>
                <div className="bg-green-800/50 p-4 rounded-xl border border-green-400/50">
                  <Star className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400">{gameState.turnCount}</div>
                  <div className="text-green-300">Turnos</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-500"
                onClick={startDuel}
              >
                <RotateCcw className="w-6 h-6 mr-3" />
                ⚔️ NOVO DUELO
              </Button>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-500"
                onClick={() => setGameState(prev => ({ ...prev, phase: 'menu' }))}
              >
                <Crown className="w-6 h-6 mr-3" />
                🏠 MENU PRINCIPAL
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.phase === 'defeat') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-amber-900 to-red-900 text-white relative overflow-hidden">
        {settings.show3D && (
          <div className="absolute inset-0 z-0">
            <Scene3D gameState={gameState} />
          </div>
        )}

        <div className="relative z-10 text-center space-y-8 flex items-center justify-center min-h-screen p-6">
          <div className="w-full">
            <div className="bg-black/90 rounded-3xl p-8 border-4 border-red-400 shadow-2xl max-w-2xl mx-auto">
              <div className="text-7xl animate-pulse mb-6">💀</div>
              <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-red-400 to-gray-400 bg-clip-text text-transparent">
                DERROTA
              </h2>
              <p className="text-xl text-red-300 mb-6 font-bold">⚰️ Os espíritos sombrios prevaleceram... ⚰️</p>

              <div className="bg-gray-800/50 p-4 rounded-xl border border-red-400/50 max-w-xl mx-auto mb-6">
                <h3 className="text-lg font-bold text-red-300 mb-3">📊 Estatísticas da Batalha</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-400">{gameState.turnCount}</div>
                    <div className="text-orange-300 text-sm">Turnos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400">{gameState.spellsCast}</div>
                    <div className="text-purple-300 text-sm">Magias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">{gameState.monstersDefeated}</div>
                    <div className="text-blue-300 text-sm">Criaturas</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-500"
                onClick={startDuel}
              >
                <Sword className="w-6 h-6 mr-3" />
                ⚔️ VINGANÇA!
              </Button>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-500"
                onClick={() => setGameState(prev => ({ ...prev, phase: 'menu' }))}
              >
                <RotateCcw className="w-6 h-6 mr-3" />
                🔄 MENU PRINCIPAL
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderização do jogo em andamento
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-amber-900 to-red-900 text-white relative overflow-hidden">
      {/* Cena 3D de fundo */}
      {settings.show3D && (
        <div className="absolute inset-0 z-0">
          <Scene3D gameState={gameState} />
        </div>
      )}

      {/* Interface do jogo */}
      <div className="relative z-10 p-4">
        {/* Header com estatísticas */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-800/50 p-4 rounded-xl border border-green-400/50">
            <h4 className="text-lg font-bold text-green-300 mb-2">🏹 VOCÊ</h4>
            <div className="flex justify-center space-x-4">
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
          </div>

          <div className="bg-yellow-800/50 p-4 rounded-xl border border-yellow-400/50">
            <div className="text-4xl font-bold text-yellow-400 mb-2">⚔️</div>
            <div className="text-lg text-yellow-300 font-bold">DUELO CAETÉ</div>
            <div className="text-sm text-gray-300">Turno {gameState.turnCount}</div>
            <div className={`text-sm font-bold ${gameState.turn === 'player' ? 'text-green-400' : 'text-red-400'}`}>
              {gameState.turn === 'player' ? 'SEU TURNO' : 'TURNO INIMIGO'}
            </div>
          </div>

          <div className="bg-red-800/50 p-4 rounded-xl border border-red-400/50">
            <h4 className="text-lg font-bold text-red-300 mb-2">👹 INIMIGO</h4>
            <div className="flex justify-center space-x-4">
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
          </div>
        </div>

        {/* Campos de batalha */}
        <div className="space-y-4 mb-6">
          {/* Campo inimigo */}
          <div className="text-center">
            <h4 className="text-lg font-bold text-red-300 mb-2">👹 CAMPO INIMIGO</h4>
            <div className="grid grid-cols-5 gap-2">
              {enemyField.map((monster, index) => (
                <Card 
                  key={`enemy-${index}`}
                  className={`h-24 flex items-center justify-center border-2 ${
                    monster 
                      ? `${getRarityColor(monster.rarity)} hover:scale-105` 
                      : 'border-dashed border-gray-600 bg-gray-800/20'
                  } transition-all duration-300`}
                >
                  {monster ? (
                    <div className="text-center p-1">
                      <div className="text-2xl mb-1">{monster.art}</div>
                      <div className="text-xs font-bold text-white mb-1">{monster.name}</div>
                      <div className="flex justify-center space-x-1 text-xs">
                        <span className="text-red-400 flex items-center">
                          <Sword className="w-3 h-3 mr-1" />{monster.attack}
                        </span>
                        <span className="text-blue-400 flex items-center">
                          <Shield className="w-3 h-3 mr-1" />{monster.defense}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center">
                      <div className="text-xl mb-1">⭕</div>
                      <div className="text-xs">Vazio</div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Campo do jogador */}
          <div className="text-center">
            <h4 className="text-lg font-bold text-green-300 mb-2">🏹 SEU CAMPO</h4>
            <div className="grid grid-cols-5 gap-2">
              {playerField.map((monster, index) => (
                <Card 
                  key={`player-${index}`}
                  className={`h-24 flex items-center justify-center border-2 cursor-pointer ${
                    monster 
                      ? `${getRarityColor(monster.rarity)} hover:scale-105` 
                      : 'border-dashed border-gray-600 bg-gray-800/20 hover:bg-gray-700/40'
                  } ${
                    selectedCard && !monster && getCardById(selectedCard)?.type === 'Monster' && 
                    canAfford(getCardById(selectedCard))
                      ? 'border-green-400 bg-green-800/30 animate-pulse' : ''
                  } transition-all duration-300`}
                  onClick={() => {
                    if (!monster && selectedCard && getCardById(selectedCard)?.type === 'Monster') {
                      const card = getCardById(selectedCard);
                      if (card && canAfford(card)) {
                        summonMonster(selectedCard, index, true);
                        setSelectedCard(null);
                      }
                    }
                  }}
                >
                  {monster ? (
                    <div className="text-center p-1">
                      <div className="text-2xl mb-1">{monster.art}</div>
                      <div className="text-xs font-bold text-white mb-1">{monster.name}</div>
                      <div className="flex justify-center space-x-1 text-xs">
                        <span className="text-red-400 flex items-center">
                          <Sword className="w-3 h-3 mr-1" />{monster.attack}
                        </span>
                        <span className="text-blue-400 flex items-center">
                          <Shield className="w-3 h-3 mr-1" />{monster.defense}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center">
                      <div className="text-xl mb-1">⭕</div>
                      <div className="text-xs">
                        {selectedCard && getCardById(selectedCard)?.type === 'Monster' && 
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
        </div>

        {/* Mão do jogador */}
        <div className="bg-black/90 p-4 rounded-xl border-2 border-green-400/50 mb-4">
          <h5 className="text-lg font-bold text-green-300 mb-3">🃏 SUA MÃO</h5>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {playerHand.map((cardId, index) => {
              const card = getCardById(cardId);
              if (!card) return null;
              
              const affordable = canAfford(card);
              const isSelected = selectedCard === cardId;
              
              return (
                <Card
                  key={`hand-${index}`}
                  className={`min-w-[120px] h-36 p-2 cursor-pointer transition-all duration-300 ${
                    getRarityColor(card.rarity)
                  } ${
                    isSelected 
                      ? 'ring-2 ring-yellow-400 scale-105' 
                      : 'hover:scale-105'
                  } ${
                    !affordable ? 'opacity-50 grayscale' : ''
                  }`}
                  onClick={() => {
                    if (affordable) {
                      setSelectedCard(isSelected ? null : cardId);
                      audioManager.playGameEvent('button_click');
                    }
                  }}
                >
                  <div className="text-center h-full flex flex-col justify-between">
                    {/* Custo de Mana */}
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center">
                        <Gem className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-blue-400 ml-1">{card.manaCost}</span>
                      </div>
                    </div>
                    
                    {/* Arte da Carta */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-2xl mb-1">{card.art}</div>
                      <div className="text-xs font-bold text-white mb-1">{card.name}</div>
                      
                      {/* Stats para Monstros */}
                      {card.type === 'Monster' && (
                        <div className="flex justify-center space-x-1 text-xs mb-1">
                          <span className="text-red-400 flex items-center">
                            <Sword className="w-3 h-3 mr-1" />{card.attack}
                          </span>
                          <span className="text-blue-400 flex items-center">
                            <Shield className="w-3 h-3 mr-1" />{card.defense}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Tipo e Elemento */}
                    <div className="text-center">
                      <div className="flex justify-center mb-1">
                        {getElementIcon(card.element)}
                      </div>
                      <Badge className={`text-xs ${
                        card.type === 'Monster' ? 'bg-red-600' : 'bg-purple-600'
                      }`}>
                        {card.type}
                      </Badge>
                    </div>

                    {/* Bloqueio por Mana */}
                    {!affordable && (
                      <div className="absolute inset-0 bg-red-900/70 rounded flex items-center justify-center">
                        <div className="text-center">
                          <Lock className="w-4 h-4 text-red-400 mx-auto mb-1" />
                          <div className="text-xs text-red-300 font-bold">MANA INSUFICIENTE</div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Botões de ação */}
        {gameState.turn === 'player' && (
          <div className="flex justify-center space-x-3 mb-4">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
              disabled={!selectedCard || getCardById(selectedCard)?.type !== 'Spell' || !canAfford(getCardById(selectedCard))}
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={endTurn}
            >
              <Timer className="w-4 h-4 mr-2" />
              🔄 FINALIZAR TURNO
            </Button>
          </div>
        )}

        {/* Log de Batalha */}
        <Card className="bg-black/90 border-2 border-yellow-400/50 h-32">
          <div className="p-3 h-full">
            <h5 className="text-sm font-bold text-yellow-300 mb-2">📜 LOG DE BATALHA</h5>
            <div className="space-y-1 h-24 overflow-y-auto text-xs">
              {gameState.battleLog.slice(-8).reverse().map((entry) => (
                <div 
                  key={entry.id} 
                  className={`p-1 rounded border-l-2 ${
                    entry.type === 'combat' ? 'bg-red-900/30 border-red-400 text-red-200' :
                    entry.type === 'summon' ? 'bg-green-900/30 border-green-400 text-green-200' :
                    entry.type === 'direct_attack' ? 'bg-orange-900/30 border-orange-400 text-orange-200' :
                    'bg-blue-900/30 border-blue-400 text-blue-200'
                  }`}
                >
                  <div className="font-semibold">{entry.message}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Textos flutuantes */}
      {floatingTexts.map(text => (
        <div
          key={text.id}
          className={`fixed z-50 pointer-events-none ${text.color} font-bold text-lg animate-bounce`}
          style={{
            left: `${text.position.x}%`,
            top: `${text.position.y}%`,
            opacity: text.opacity
          }}
        >
          {text.text}
        </div>
      ))}
    </div>
  );
};

export default CaeteCardGameMobile;