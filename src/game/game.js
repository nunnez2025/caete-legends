import { cardDatabase } from './cards.js';
import { setLightByTurn } from './three-scene.js';
import { ui } from './ui.js';
import { customizationSystem } from './customization.js';

const MAX_MONSTER_SLOTS = 5;
const MAX_ST_SLOTS = 5;

export const gameState = {
  turn: 'player',
  playerLifePoints: 8000,
  enemyLifePoints: 8000,
  phase: 'Draw',
  normalSummonUsed: false,
  playerDeck: [],
  enemyDeck: [],
  playerHand: [],
  enemyHand: [],
  playerCreatures: Array.from({ length: MAX_MONSTER_SLOTS }, () => null),
  playerSpellsTraps: Array.from({ length: MAX_ST_SLOTS }, () => null),
  playerFieldCard: null,
  enemyCreatures: Array.from({ length: MAX_MONSTER_SLOTS }, () => null),
  enemySpellsTraps: Array.from({ length: MAX_ST_SLOTS }, () => null),
  enemyFieldCard: null,
  winner: null,
  cardDatabase
};

function buildDeck() {
  const base = [];
  cardDatabase.creatures.forEach(card => { 
    base.push({ ...card }); 
    base.push({ ...card }); 
  });
  cardDatabase.spells.forEach(card => { 
    base.push({ ...card }); 
  });
  cardDatabase.traps.forEach(card => { 
    base.push({ ...card }); 
  });
  cardDatabase.fields.forEach(card => { 
    base.push({ ...card }); 
  });
  return shuffle(base);
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function drawCard(forPlayer) {
  if (forPlayer === 'player') {
    if (gameState.playerDeck.length > 0) gameState.playerHand.push(gameState.playerDeck.pop());
  } else {
    if (gameState.enemyDeck.length > 0) gameState.enemyHand.push(gameState.enemyDeck.pop());
  }
}

function firstEmptySlot(arr) { 
  return arr.findIndex(s => s === null); 
}

function canNormalSummon(creature, side) {
  const level = creature.level;
  const field = side === 'player' ? gameState.playerCreatures : gameState.enemyCreatures;
  const empty = firstEmptySlot(field) !== -1;
  if (!empty) return { ok: false, tributesNeeded: 0 };
  if (level <= 4) return { ok: true, tributesNeeded: 0 };
  if (level <= 6) return { ok: true, tributesNeeded: 1 };
  if (level <= 8) return { ok: true, tributesNeeded: 2 };
  return { ok: true, tributesNeeded: 3 };
}

function startTurn(forPlayer) {
  gameState.turn = forPlayer;
  gameState.phase = 'Draw';
  gameState.normalSummonUsed = false;
  setLightByTurn(forPlayer === 'player');
  if (forPlayer === 'player') { 
    drawCard('player'); 
    ui.log('➕ Você comprou uma carta.'); 
  } else { 
    drawCard('enemy'); 
    ui.log('🤖 Inimigo comprou uma carta.'); 
    setTimeout(enemyTurn, 750); 
  }
  ui.update(toRender());
  ui.render(toRender());
}

export function endTurn() {
  if (gameState.winner || gameState.turn !== 'player') return;
  ui.log('🔁 Você terminou seu turno.');
  startTurn('enemy');
}

export function playCardFromHand(index) {
  if (gameState.winner || gameState.turn !== 'player') return;
  const baseCard = gameState.playerHand[index];
  if (!baseCard) return;
  const customizedCard = customizationSystem.getCustomizedCard(baseCard);
  
  if (customizedCard.type === 'Creature') {
    if (gameState.phase !== 'Main1' && gameState.phase !== 'Main2') { 
      ui.log('⛔ Só é possível invocar em Main Phase.'); 
      return; 
    }
    if (gameState.normalSummonUsed) { 
      ui.log('⛔ Invocação Normal já usada neste turno.'); 
      return; 
    }
    const { ok, tributesNeeded } = canNormalSummon(customizedCard, 'player');
    if (!ok) { 
      ui.log('⛔ Campo cheio.'); 
      return; 
    }
    if (tributesNeeded > 0) {
      // Sacrificar automaticamente as primeiras criaturas disponíveis (simplificado)
      const indices = gameState.playerCreatures.map((c, i) => c ? i : -1).filter(i => i !== -1).slice(0, tributesNeeded);
      if (indices.length < tributesNeeded) { 
        ui.log('⛔ Tributos insuficientes.'); 
        return; 
      }
      indices.forEach(i => gameState.playerCreatures[i] = null);
    }
    
    const slot = firstEmptySlot(gameState.playerCreatures);
    gameState.playerCreatures[slot] = customizedCard;
    gameState.playerHand.splice(index, 1);
    gameState.normalSummonUsed = true;
    ui.log(`🎭 Você invocou ${customizedCard.name}!`);
    
  } else if (customizedCard.type === 'Spell') {
    if (gameState.phase !== 'Main1' && gameState.phase !== 'Main2') { 
      ui.log('⛔ Só é possível ativar magias em Main Phase.'); 
      return; 
    }
    
    if (customizedCard.spellType === 'Ritual') {
      // Implementar ritual
      ui.log(`🔮 Ritual ${customizedCard.name} ativado!`);
    } else {
      ui.log(`✨ ${customizedCard.name} ativada!`);
    }
    gameState.playerHand.splice(index, 1);
    
  } else if (customizedCard.type === 'Trap') {
    const slot = firstEmptySlot(gameState.playerSpellsTraps);
    if (slot === -1) { 
      ui.log('⛔ Zona de magias/armadilhas cheia.'); 
      return; 
    }
    gameState.playerSpellsTraps[slot] = customizedCard;
    gameState.playerHand.splice(index, 1);
    ui.log(`🕳️ ${customizedCard.name} foi definida.`);
    
  } else if (customizedCard.type === 'Field') {
    if (gameState.playerFieldCard) {
      ui.log('⛔ Já existe um terreno ativo.');
      return;
    }
    gameState.playerFieldCard = customizedCard;
    gameState.playerHand.splice(index, 1);
    ui.log(`🌍 ${customizedCard.name} ativado!`);
  }
  
  ui.update(toRender());
  ui.render(toRender());
}

export function attack(attackerIndex, targetIndex) {
  if (gameState.winner || gameState.turn !== 'player') return;
  if (gameState.phase !== 'Battle') { 
    ui.log('⛔ Só é possível atacar na Fase de Batalha.'); 
    return; 
  }
  
  const attacker = gameState.playerCreatures[attackerIndex];
  if (!attacker) { 
    ui.log('⛔ Criatura atacante não encontrada.'); 
    return; 
  }
  
  const target = gameState.enemyCreatures[targetIndex];
  if (!target) { 
    ui.log('⛔ Alvo não encontrado.'); 
    return; 
  }
  
  // Calcular batalha
  if (attacker.attack > target.defense) {
    gameState.enemyCreatures[targetIndex] = null;
    const damage = attacker.attack - target.defense;
    gameState.enemyLifePoints -= damage;
    ui.log(`⚔️ ${attacker.name} destruiu ${target.name}! Dano: ${damage}`);
  } else if (attacker.attack < target.defense) {
    const damage = target.defense - attacker.attack;
    gameState.playerLifePoints -= damage;
    ui.log(`💥 ${attacker.name} foi derrotado! Dano: ${damage}`);
  } else {
    ui.log(`🤝 Empate entre ${attacker.name} e ${target.name}!`);
  }
  
  ui.update(toRender());
  ui.render(toRender());
}

function enemyTurn() {
  if (gameState.winner) return;
  
  // IA simples: jogar primeira carta disponível
  if (gameState.enemyHand.length > 0) {
    const card = gameState.enemyHand[0];
    if (card.type === 'Creature' && !gameState.normalSummonUsed) {
      const { ok } = canNormalSummon(card, 'enemy');
      if (ok) {
        const slot = firstEmptySlot(gameState.enemyCreatures);
        gameState.enemyCreatures[slot] = card;
        gameState.enemyHand.splice(0, 1);
        gameState.normalSummonUsed = true;
        ui.log(`🤖 Inimigo invocou ${card.name}!`);
      }
    }
  }
  
  // Ataque simples
  for (let i = 0; i < gameState.enemyCreatures.length; i++) {
    const attacker = gameState.enemyCreatures[i];
    if (attacker) {
      for (let j = 0; j < gameState.playerCreatures.length; j++) {
        const target = gameState.playerCreatures[j];
        if (target) {
          if (attacker.attack > target.defense) {
            gameState.playerCreatures[j] = null;
            const damage = attacker.attack - target.defense;
            gameState.playerLifePoints -= damage;
            ui.log(`⚔️ ${attacker.name} atacou ${target.name}! Dano: ${damage}`);
          }
          break;
        }
      }
    }
  }
  
  setTimeout(() => {
    ui.log('🔁 Turno do inimigo terminado.');
    startTurn('player');
  }, 1000);
}

export function startGame() {
  // Construir decks
  gameState.playerDeck = buildDeck();
  gameState.enemyDeck = buildDeck();
  
  // Embaralhar
  gameState.playerDeck = shuffle(gameState.playerDeck);
  gameState.enemyDeck = shuffle(gameState.enemyDeck);
  
  // Comprar 5 cartas cada
  for (let i = 0; i < 5; i++) {
    drawCard('player');
    drawCard('enemy');
  }
  
  // Iniciar primeiro turno
  startTurn('player');
  
  ui.log('🎮 Jogo iniciado! Seu turno.');
}

export function toRender() {
  return {
    playerLifePoints: gameState.playerLifePoints,
    enemyLifePoints: gameState.enemyLifePoints,
    playerHand: gameState.playerHand,
    enemyHand: gameState.enemyHand,
    playerCreatures: gameState.playerCreatures,
    enemyCreatures: gameState.enemyCreatures,
    playerSpellsTraps: gameState.playerSpellsTraps,
    enemySpellsTraps: gameState.enemySpellsTraps,
    playerFieldCard: gameState.playerFieldCard,
    enemyFieldCard: gameState.enemyFieldCard,
    turn: gameState.turn,
    phase: gameState.phase,
    winner: gameState.winner
  };
}