import { AnyCard } from './brazilian-folklore-cards';

export type GamePhase = 'draw' | 'main' | 'battle' | 'end';
export type BattleResult = 'victory' | 'defeat' | 'draw';

export interface GameStats {
  totalGamesPlayed: number;
  winRate: number;
  averageGameTime: number;
  favoriteCard: string;
  longestWinStreak: number;
  totalDamageDealt: number;
  totalHealingDone: number;
  perfectGames: number; // Vitórias sem perder LP
}

export interface BattleEffect {
  id: string;
  name: string;
  description: string;
  duration: number; // turnos
  target: 'player' | 'enemy' | 'field' | 'all';
  type: 'buff' | 'debuff' | 'neutral';
  icon: string;
}

export interface CreatureInstance extends AnyCard {
  instanceId: string;
  summoned: boolean;
  canAttack: boolean;
  attackedThisTurn: boolean;
  currentAttack: number;
  currentDefense: number;
  effects: BattleEffect[];
  position: number;
}

export class AdvancedGameEngine {
  // Sistema de combo
  static calculateComboMultiplier(cardsPlayed: AnyCard[]): number {
    if (cardsPlayed.length < 2) return 1;

    // Combo por elemento
    const elements = cardsPlayed.map(c => c.attribute).filter(Boolean);
    const elementCounts = elements.reduce((acc, el) => {
      acc[el] = (acc[el] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const maxElementCount = Math.max(...Object.values(elementCounts));
    
    // Combo por região
    const regions = cardsPlayed.map(c => c.region).filter(Boolean);
    const regionCounts = regions.reduce((acc, reg) => {
      acc[reg] = (acc[reg] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const maxRegionCount = Math.max(...Object.values(regionCounts));

    // Calcular multiplicador
    let multiplier = 1;
    if (maxElementCount >= 3) multiplier += 0.5;
    if (maxRegionCount >= 2) multiplier += 0.3;
    if (cardsPlayed.length >= 4) multiplier += 0.2;

    return Math.min(multiplier, 2.5); // Cap no multiplicador
  }

  // Sistema de chain de ataques
  static calculateChainDamage(attackingCreatures: CreatureInstance[]): number {
    if (attackingCreatures.length <= 1) return 0;

    const baseDamage = attackingCreatures.reduce((sum, c) => sum + c.attack, 0);
    const chainBonus = (attackingCreatures.length - 1) * 200;
    
    return Math.floor(baseDamage * 0.1 + chainBonus);
  }

  // Sistema de elementos
  static getElementalAdvantage(attacker: string, defender: string): number {
    const advantages: Record<string, string[]> = {
      'Fogo': ['Floresta', 'Vento'],
      'Água': ['Fogo', 'Terra'],
      'Floresta': ['Água', 'Terra'],
      'Terra': ['Vento', 'Sombra'],
      'Vento': ['Água', 'Espírito'],
      'Sombra': ['Luz', 'Espírito'],
      'Espírito': ['Sombra', 'Fogo'],
      'Luz': ['Sombra', 'Espírito']
    };

    if (advantages[attacker]?.includes(defender)) {
      return 1.3; // 30% de bônus
    } else if (advantages[defender]?.includes(attacker)) {
      return 0.7; // 30% de penalidade
    }
    
    return 1.0; // Neutro
  }

  // Sistema de evolução de cartas
  static canEvolveCard(card: AnyCard, field: CreatureInstance[]): boolean {
    if (card.type !== 'Criatura') return false;

    // Verificar se há cartas base no campo
    const baseCards = field.filter(c => 
      c && c.attribute === card.attribute && c.level < card.level
    );

    return baseCards.length > 0;
  }

  // Calcular dano de batalha
  static calculateBattleDamage(
    attacker: CreatureInstance, 
    defender: CreatureInstance
  ): { attackerDamage: number; defenderDamage: number; effects: string[] } {
    const elementalMod = this.getElementalAdvantage(attacker.attribute || '', defender.attribute || '');
    
    const attackerDamage = Math.max(0, Math.floor(attacker.currentAttack * elementalMod) - defender.currentDefense);
    const defenderDamage = Math.max(0, defender.currentAttack - attacker.currentDefense);

    const effects: string[] = [];
    
    if (elementalMod > 1) {
      effects.push(`⚡ Vantagem Elemental! +${Math.floor((elementalMod - 1) * 100)}% dano`);
    } else if (elementalMod < 1) {
      effects.push(`🛡️ Resistência Elemental! ${Math.floor((1 - elementalMod) * 100)}% menos dano`);
    }

    return { attackerDamage, defenderDamage, effects };
  }

  // Sistema de AI estratégica
  static evaluateGameState(
    playerField: CreatureInstance[],
    enemyField: CreatureInstance[],
    playerLP: number,
    enemyLP: number,
    difficulty: string
  ): 'aggressive' | 'defensive' | 'balanced' | 'desperate' {
    const playerPower = playerField.reduce((sum, c) => sum + (c?.attack || 0), 0);
    const enemyPower = enemyField.reduce((sum, c) => sum + (c?.attack || 0), 0);
    
    const lpRatio = enemyLP / playerLP;
    const powerRatio = enemyPower / Math.max(playerPower, 1);

    // IA desesperada quando com pouca vida
    if (enemyLP < 2000) return 'desperate';
    
    // Estratégia baseada na dificuldade
    switch (difficulty) {
      case 'Lendário':
        if (lpRatio < 0.6 || powerRatio < 0.7) return 'aggressive';
        if (lpRatio > 1.5 && powerRatio > 1.3) return 'defensive';
        return 'balanced';
        
      case 'Difícil':
        if (lpRatio < 0.8) return 'aggressive';
        if (lpRatio > 1.2) return 'defensive';
        return 'balanced';
        
      default:
        return Math.random() > 0.5 ? 'balanced' : 'aggressive';
    }
  }

  // Calcular prioridade de cartas para IA
  static calculateCardPriority(
    card: AnyCard,
    gameState: any,
    strategy: string
  ): number {
    let priority = 0;

    // Prioridade base por tipo
    if (card.type === 'Criatura') {
      priority += card.attack + card.defense;
      
      // Bônus por raridade
      const rarityBonus = {
        'Comum': 0,
        'Rara': 200,
        'Super Rara': 400,
        'Ultra Rara': 600,
        'Lendária': 800,
        'Mítica': 1000
      };
      priority += rarityBonus[card.rarity] || 0;
    } else if (card.type === 'Magia') {
      priority += 300; // Magias são sempre úteis
      
      // Bônus estratégico
      if (strategy === 'aggressive') priority += 200;
      if (strategy === 'desperate') priority += 400;
    }

    // Penalidade por custo alto
    priority -= card.manaCost * 50;

    // Bônus por situação específica
    if (strategy === 'defensive' && card.type === 'Criatura') {
      priority += card.defense * 0.5;
    }

    return Math.max(0, priority);
  }
}

// Efeitos especiais das cartas
export const cardEffects = {
  // Efeitos de criaturas
  saci_effect: (card: CreatureInstance, gameState: any) => {
    return {
      onSummon: () => ({
        message: "🌪️ Saci embaralhou uma carta do oponente!",
        effect: () => {
          // Embaralhar carta aleatória da mão do oponente no deck
        }
      }),
      onAttack: () => ({
        message: "💨 Saci ataca com velocidade do vento!",
        canAttackDirectly: true,
        damageModifier: 0.5
      })
    };
  },

  boitata_effect: (card: CreatureInstance, gameState: any) => {
    return {
      onSummon: () => ({
        message: "🐍🔥 Boitatá purifica o campo com fogo sagrado!",
        effect: () => {
          // Destruir todas as magias e armadilhas
        }
      }),
      passive: () => ({
        message: "🔥 Imune a magias de Água",
        immuneTo: ['Água']
      })
    };
  },

  cuca_effect: (card: CreatureInstance, gameState: any) => {
    return {
      onSummon: () => ({
        message: "🧙‍♀️ Cuca rouba o controle de uma criatura!",
        effect: () => {
          // Roubar controle de criatura inimiga
        }
      })
    };
  },

  iara_effect: (card: CreatureInstance, gameState: any) => {
    return {
      passive: () => ({
        message: "🧜‍♀️ Iara fortalece criaturas aquáticas",
        fieldBonus: { attribute: 'Água', attack: 300, defense: 300 }
      }),
      oncePerTurn: () => ({
        message: "💙 Iara cura com águas sagradas",
        healing: 500
      })
    };
  },

  curupira_effect: (card: CreatureInstance, gameState: any) => {
    return {
      onAttacked: () => ({
        message: "👣 Curupira confunde o atacante!",
        effect: () => {
          // Trocar ATK/DEF até o fim do turno
          const temp = card.currentAttack;
          card.currentAttack = card.currentDefense;
          card.currentDefense = temp;
        }
      })
    };
  }
};

// Sistema de conquistas
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (gameState: any) => boolean;
  reward?: string;
}

export const achievements: Achievement[] = [
  {
    id: 'first_victory',
    name: 'Primeira Vitória',
    description: 'Vença seu primeiro duelo',
    icon: '🏆',
    condition: (gameState) => gameState.playerWins >= 1
  },
  {
    id: 'legend_summoner',
    name: 'Invocador de Lendas',
    description: 'Invoque 3 criaturas Lendárias em uma partida',
    icon: '👑',
    condition: (gameState) => gameState.legendariesSummoned >= 3
  },
  {
    id: 'combo_master',
    name: 'Mestre dos Combos',
    description: 'Execute um combo de 5 cartas',
    icon: '⚡',
    condition: (gameState) => gameState.maxCombo >= 5
  },
  {
    id: 'perfect_game',
    name: 'Jogo Perfeito',
    description: 'Vença sem perder pontos de vida',
    icon: '💎',
    condition: (gameState) => gameState.playerWins > 0 && gameState.playerLifePoints === 8000
  },
  {
    id: 'folklore_master',
    name: 'Mestre do Folclore',
    description: 'Vença 10 duelos consecutivos',
    icon: '🌟',
    condition: (gameState) => gameState.streak >= 10
  },
  {
    id: 'legendary_challenger',
    name: 'Desafiante Lendário',
    description: 'Vença na dificuldade Lendária',
    icon: '👹',
    condition: (gameState) => gameState.difficulty === 'Lendário' && gameState.phase === 'victory'
  }
];

// Sistema de deck building inteligente
export class DeckBuilder {
  static createThematicDeck(theme: 'Norte' | 'Nordeste' | 'Sul' | 'Balanced'): string[] {
    // Implementar criação de decks temáticos por região
    const deck: string[] = [];
    // ... lógica de construção de deck
    return deck;
  }

  static analyzeDeckBalance(deck: string[]): {
    score: number;
    suggestions: string[];
    strengths: string[];
    weaknesses: string[];
  } {
    // Analisar balanceamento do deck
    return {
      score: 85,
      suggestions: ['Adicionar mais criaturas de baixo custo', 'Incluir magias de controle'],
      strengths: ['Boa distribuição de elementos', 'Criaturas poderosas'],
      weaknesses: ['Poucas opções defensivas', 'Custo médio alto']
    };
  }
}

// Sistema de temporadas e ranking
export interface SeasonData {
  id: string;
  name: string;
  theme: string;
  startDate: Date;
  endDate: Date;
  rewards: {
    bronze: string[];
    silver: string[];
    gold: string[];
    diamond: string[];
    legend: string[];
  };
}

export class RankingSystem {
  static calculateRank(wins: number, losses: number, streak: number): {
    rank: string;
    tier: number;
    points: number;
    nextRankPoints: number;
  } {
    const winRate = wins / Math.max(wins + losses, 1);
    let points = wins * 100 - losses * 50 + streak * 25;
    
    // Bônus por win rate
    if (winRate > 0.7) points += 500;
    else if (winRate > 0.5) points += 200;

    let rank = 'Bronze';
    let tier = 1;

    if (points >= 2000) { rank = 'Lenda'; tier = 1; }
    else if (points >= 1500) { rank = 'Diamante'; tier = Math.floor((points - 1500) / 100) + 1; }
    else if (points >= 1000) { rank = 'Ouro'; tier = Math.floor((points - 1000) / 100) + 1; }
    else if (points >= 500) { rank = 'Prata'; tier = Math.floor((points - 500) / 100) + 1; }
    else { rank = 'Bronze'; tier = Math.floor(points / 100) + 1; }

    const nextRankPoints = rank === 'Lenda' ? points : 
      rank === 'Diamante' ? 2000 :
      rank === 'Ouro' ? 1500 :
      rank === 'Prata' ? 1000 : 500;

    return { rank, tier: Math.min(tier, 5), points, nextRankPoints };
  }
}

// Sistema de meteorologia que afeta o jogo
export interface WeatherEffect {
  name: string;
  icon: string;
  description: string;
  effects: {
    element?: string;
    attackBonus?: number;
    defenseBonus?: number;
    manaBonus?: number;
    healingBonus?: number;
  };
}

export const weatherEffects: WeatherEffect[] = [
  {
    name: 'Chuva Amazônica',
    icon: '🌧️',
    description: 'Criaturas de Água ganham +300 ATK/DEF',
    effects: { element: 'Água', attackBonus: 300, defenseBonus: 300 }
  },
  {
    name: 'Sol Escaldante',
    icon: '☀️',
    description: 'Criaturas de Fogo ganham +400 ATK, outras perdem -100 DEF',
    effects: { element: 'Fogo', attackBonus: 400 }
  },
  {
    name: 'Vento Forte',
    icon: '💨',
    description: 'Criaturas de Vento podem atacar duas vezes',
    effects: { element: 'Vento' }
  },
  {
    name: 'Lua Cheia',
    icon: '🌕',
    description: 'Criaturas de Sombra ganham +500 ATK durante a noite',
    effects: { element: 'Sombra', attackBonus: 500 }
  },
  {
    name: 'Floresta Densa',
    icon: '🌳',
    description: 'Criaturas de Floresta ganham +200 DEF e curam 200 LP por turno',
    effects: { element: 'Floresta', defenseBonus: 200, healingBonus: 200 }
  }
];

// Sistema de eventos especiais
export interface SpecialEvent {
  id: string;
  name: string;
  description: string;
  icon: string;
  trigger: 'turnStart' | 'turnEnd' | 'summon' | 'attack' | 'spell';
  condition: (gameState: any) => boolean;
  effect: (gameState: any) => any;
}

export const specialEvents: SpecialEvent[] = [
  {
    id: 'festival_junino',
    name: 'Festival Junino',
    description: 'Durante os turnos 6-10, todas as criaturas ganham +200 ATK',
    icon: '🎪',
    trigger: 'turnStart',
    condition: (gameState) => gameState.turnCount >= 6 && gameState.turnCount <= 10,
    effect: (gameState) => ({
      fieldBonus: { attack: 200 },
      message: '🎪 Festival Junino! Todas as criaturas ficam mais fortes!'
    })
  },
  {
    id: 'eclipse_solar',
    name: 'Eclipse Solar',
    description: 'Criaturas de Sombra ganham +500 ATK/DEF por 3 turnos',
    icon: '🌑',
    trigger: 'turnStart',
    condition: (gameState) => gameState.turnCount === 8,
    effect: (gameState) => ({
      elementalBonus: { element: 'Sombra', attack: 500, defense: 500, duration: 3 },
      message: '🌑 Eclipse Solar! As sombras se fortalecem!'
    })
  }
];

export default AdvancedGameEngine;