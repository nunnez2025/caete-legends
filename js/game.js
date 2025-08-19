import { cardDatabase } from './cards.js';
import { setLightByTurn } from './three-scene.js';
import { ui } from './ui.js';
import { customizationSystem } from './customization.js';

const MAX_FIELD_SLOTS = 5;

const gameState = {
  turn: 'player',
  playerLifePoints: 8000,
  enemyLifePoints: 8000,
  playerMana: 1,
  enemyMana: 1,
  playerDeck: [],
  enemyDeck: [],
  playerHand: [],
  enemyHand: [],
  playerField: Array.from({ length: MAX_FIELD_SLOTS }, () => null),
  enemyField: Array.from({ length: MAX_FIELD_SLOTS }, () => null),
  winner: null
};

function buildDeck() {
  const base = [];
  // Simple deck: 2x each monster, 2x each spell
  cardDatabase.monsters.forEach(card => {
    base.push({ ...card });
    base.push({ ...card });
  });
  cardDatabase.spells.forEach(card => {
    base.push({ ...card });
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
    if (gameState.playerDeck.length > 0) {
      gameState.playerHand.push(gameState.playerDeck.pop());
    }
  } else {
    if (gameState.enemyDeck.length > 0) {
      gameState.enemyHand.push(gameState.enemyDeck.pop());
    }
  }
}

function firstEmptySlot(fieldArray) {
  return fieldArray.findIndex(slot => slot === null);
}

function canPlay(card, forPlayer) {
  const mana = forPlayer === 'player' ? gameState.playerMana : gameState.enemyMana;
  const field = forPlayer === 'player' ? gameState.playerField : gameState.enemyField;
  return mana >= (card.manaCost || 0) && firstEmptySlot(field) !== -1;
}

function spendMana(amount, forPlayer) {
  if (forPlayer === 'player') {
    gameState.playerMana = Math.max(0, gameState.playerMana - amount);
  } else {
    gameState.enemyMana = Math.max(0, gameState.enemyMana - amount);
  }
}

function startTurn(forPlayer) {
  gameState.turn = forPlayer;
  setLightByTurn(forPlayer === 'player');
  if (forPlayer === 'player') {
    gameState.playerMana = Math.min(10, gameState.playerMana + 1);
    drawCard('player');
    ui.log('➕ Você comprou uma carta.');
  } else {
    gameState.enemyMana = Math.min(10, gameState.enemyMana + 1);
    drawCard('enemy');
    ui.log('🤖 Inimigo comprou uma carta.');
    setTimeout(enemyTurn, 750);
  }
  ui.update(gameState);
  ui.render(gameState);
}

function endTurn() {
  if (gameState.winner) return;
  if (gameState.turn !== 'player') return;
  ui.log('🔁 Você terminou seu turno.');
  startTurn('enemy');
}

function playCardFromHand(index) {
  if (gameState.winner) return;
  if (gameState.turn !== 'player') return;
  const baseCard = gameState.playerHand[index];
  if (!baseCard) return;

  // Apply customizations when playing
  const customizedCard = customizationSystem.getCustomizedCard(baseCard);

  if (!canPlay(customizedCard, 'player')) {
    ui.log('⛔ Mana insuficiente ou campo cheio.');
    return;
  }

  const slotIndex = firstEmptySlot(gameState.playerField);
  gameState.playerField[slotIndex] = { ...customizedCard };
  spendMana(customizedCard.manaCost || 0, 'player');
  gameState.playerHand.splice(index, 1);
  ui.log(`🃏 Você invocou ${customizedCard.name}.`);
  ui.update(gameState);
  ui.render(gameState);
}

function resolveBattlePhase(attackerSide) {
  const isPlayer = attackerSide === 'player';
  const attackers = isPlayer ? gameState.playerField : gameState.enemyField;
  const defenders = isPlayer ? gameState.enemyField : gameState.playerField;

  attackers.forEach((card, i) => {
    if (!card) return;
    const defender = defenders[i];
    if (card.type === 'Spell') {
      // Simple spell effect: direct damage 500 and then goes to grave (remove)
      if (isPlayer) {
        gameState.enemyLifePoints = Math.max(0, gameState.enemyLifePoints - 500);
        ui.log(`✨ ${card.name} causa 500 de dano direto!`);
      } else {
        gameState.playerLifePoints = Math.max(0, gameState.playerLifePoints - 500);
        ui.log(`✨ ${card.name} do inimigo causa 500 de dano direto!`);
      }
      attackers[i] = null;
      return;
    }

    if (!defender) {
      // Direct attack
      if (isPlayer) {
        gameState.enemyLifePoints = Math.max(0, gameState.enemyLifePoints - (card.attack || 0));
        ui.log(`⚔️ ${card.name} ataca diretamente (${card.attack}).`);
      } else {
        gameState.playerLifePoints = Math.max(0, gameState.playerLifePoints - (card.attack || 0));
        ui.log(`⚔️ ${card.name} do inimigo ataca diretamente (${card.attack}).`);
      }
      return;
    }

    // Monster vs monster
    const attackA = card.attack || 0;
    const attackB = defender.attack || 0;
    if (attackA > attackB) {
      const diff = attackA - attackB;
      defenders[i] = null;
      if (isPlayer) {
        gameState.enemyLifePoints = Math.max(0, gameState.enemyLifePoints - diff);
        ui.log(`💥 ${card.name} destrói ${defender.name} e causa ${diff}.`);
      } else {
        gameState.playerLifePoints = Math.max(0, gameState.playerLifePoints - diff);
        ui.log(`💥 ${card.name} destrói ${defender.name} e causa ${diff}.`);
      }
    } else if (attackB > attackA) {
      const diff = attackB - attackA;
      attackers[i] = null;
      if (isPlayer) {
        gameState.playerLifePoints = Math.max(0, gameState.playerLifePoints - diff);
        ui.log(`💥 ${defender.name} derrota ${card.name}; você sofre ${diff}.`);
      } else {
        gameState.enemyLifePoints = Math.max(0, gameState.enemyLifePoints - diff);
        ui.log(`💥 ${defender.name} derrota ${card.name} do inimigo; ele sofre ${diff}.`);
      }
    } else {
      // tie: both destroyed
      attackers[i] = null;
      defenders[i] = null;
      ui.log('💥 Confronto empatado: ambas as cartas são destruídas.');
    }
  });

  checkWinner();
}

function checkWinner() {
  if (gameState.playerLifePoints <= 0 && !gameState.winner) {
    gameState.winner = 'enemy';
    ui.log('❌ Você perdeu!');
  }
  if (gameState.enemyLifePoints <= 0 && !gameState.winner) {
    gameState.winner = 'player';
    ui.log('🏆 Você venceu! +500 moedas');
    customizationSystem.addCurrency(500);
  }
  ui.update(gameState);
  ui.render(gameState);
}

function attackAndEndTurn() {
  if (gameState.winner) return;
  if (gameState.turn !== 'player') return;
  resolveBattlePhase('player');
  if (!gameState.winner) {
    startTurn('enemy');
  }
}

function enemyTurn() {
  if (gameState.winner) return;
  if (gameState.turn !== 'enemy') return;

  // Try to play best affordable card
  let bestIndex = -1;
  let bestScore = -1;
  for (let i = 0; i < gameState.enemyHand.length; i++) {
    const card = gameState.enemyHand[i];
    if (!canPlay(card, 'enemy')) continue;
    const score = (card.type === 'Monster' ? (card.attack || 0) : 300) - (card.manaCost || 0) * 10;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }
  if (bestIndex !== -1) {
    const card = gameState.enemyHand[bestIndex];
    const slotIndex = firstEmptySlot(gameState.enemyField);
    gameState.enemyField[slotIndex] = { ...card };
    spendMana(card.manaCost || 0, 'enemy');
    gameState.enemyHand.splice(bestIndex, 1);
    ui.log(`🤖 Inimigo invoca ${card.name}.`);
  }

  // Attack
  resolveBattlePhase('enemy');
  if (!gameState.winner) {
    ui.log('🔁 Inimigo termina o turno.');
    startTurn('player');
  }
}

function startGame() {
  document.body.innerHTML += `
    <div id="game-ui" class="game-ui">
      <div class="stats-row">
        <span class="stat-label">Você:</span>
        <span class="stat-value" id="playerLife">8000</span>
      </div>
      <div class="stats-row">
        <span class="stat-label">Mana:</span>
        <span class="stat-value" id="playerMana">1</span>
      </div>
      <div class="stats-row">
        <span class="stat-label">Inimigo:</span>
        <span class="stat-value" id="enemyLife">8000</span>
      </div>
      <div class="stats-row">
        <span class="stat-label">Mana Inimiga:</span>
        <span class="stat-value" id="enemyMana">1</span>
      </div>
      <div id="turnIndicator">SEU TURNO</div>
      <div class="board">
        <div class="field-row" id="enemyField"></div>
        <div class="field-row" id="playerField"></div>
        <div class="hand-row">
          <div id="playerHand" class="hand"></div>
          <div class="actions">
            <button id="attackBtn" class="end-turn-btn">Atacar & Encerrar</button>
            <button id="endTurnBtn" class="end-turn-btn alt">Encerrar Turno</button>
          </div>
        </div>
      </div>
      <div id="battleLog"></div>
    </div>
  `;

  ui.init();
  ui.bindHandlers({ onEndTurn: endTurn, onAttack: attackAndEndTurn, onPlayFromHand: playCardFromHand });
  customizationSystem.init();

  // Build decks and draw initial hands
  gameState.playerDeck = buildDeck();
  gameState.enemyDeck = buildDeck();
  for (let i = 0; i < 5; i++) {
    drawCard('player');
    drawCard('enemy');
  }
  ui.log('🎴 Duelo iniciado!');
  ui.log('🎨 Use o botão "Personalizar Cartas" para customizar suas cartas!');
  ui.log('💰 Ganhe moedas vencendo duelos!');

  setLightByTurn(true);
  ui.update(gameState);
  ui.render(gameState);

  // Small initial bonus to encourage customization
  setTimeout(() => {
    customizationSystem.addCurrency(200);
    ui.log('💰 +200 moedas por iniciar o jogo!');
  }, 1500);
}

// Optional helper to quickly play a card by id (dev tool)
function playCard(cardId) {
  const handIndex = gameState.playerHand.findIndex(c => c.id === cardId);
  if (handIndex !== -1) playCardFromHand(handIndex);
}

// Award currency for game actions
function awardCurrency(amount, reason) {
  customizationSystem.addCurrency(amount);
  ui.log(`💰 +${amount} moedas: ${reason}`);
}

startGame();

// Export functions for potential use
window.gameUtils = {
  playCard,
  awardCurrency,
  gameState
};