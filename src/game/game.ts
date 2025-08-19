import { cardDatabase, AnyCard, CreatureCard } from './cards';
import { setLightByTurn } from './three-scene';
import { ui } from './ui';
import { customizationSystem } from './customization';

const MAX_MONSTER_SLOTS = 5;
const MAX_ST_SLOTS = 5;

type TurnSide = 'player' | 'enemy';

const gameState = {
  turn: 'player' as TurnSide,
  playerLifePoints: 8000,
  enemyLifePoints: 8000,
  phase: 'Draw' as 'Draw' | 'Main1' | 'Battle' | 'Main2' | 'End',
  normalSummonUsed: false,
  playerDeck: [] as AnyCard[],
  enemyDeck: [] as AnyCard[],
  playerHand: [] as AnyCard[],
  enemyHand: [] as AnyCard[],
  playerCreatures: Array.from({ length: MAX_MONSTER_SLOTS }, () => null as AnyCard | null),
  playerSpellsTraps: Array.from({ length: MAX_ST_SLOTS }, () => null as AnyCard | null),
  playerFieldCard: null as AnyCard | null,
  enemyCreatures: Array.from({ length: MAX_MONSTER_SLOTS }, () => null as AnyCard | null),
  enemySpellsTraps: Array.from({ length: MAX_ST_SLOTS }, () => null as AnyCard | null),
  enemyFieldCard: null as AnyCard | null,
  winner: null as TurnSide | null
};

function buildDeck(): AnyCard[] {
  const base: AnyCard[] = [];
  cardDatabase.creatures.forEach(card => { base.push({ ...card }); base.push({ ...card }); });
  cardDatabase.spells.forEach(card => { base.push({ ...card }); });
  cardDatabase.traps.forEach(card => { base.push({ ...card }); });
  cardDatabase.fields.forEach(card => { base.push({ ...card }); });
  return shuffle(base);
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function drawCard(forPlayer: TurnSide) {
  if (forPlayer === 'player') {
    if (gameState.playerDeck.length > 0) gameState.playerHand.push(gameState.playerDeck.pop()!);
  } else {
    if (gameState.enemyDeck.length > 0) gameState.enemyHand.push(gameState.enemyDeck.pop()!);
  }
}

function firstEmptySlot(arr: Array<AnyCard | null>) { return arr.findIndex(s => s === null); }

function canNormalSummon(creature: CreatureCard, side: TurnSide): { ok: boolean; tributesNeeded: number } {
  const level = creature.level;
  const field = side === 'player' ? gameState.playerCreatures : gameState.enemyCreatures;
  const empty = firstEmptySlot(field) !== -1;
  if (!empty) return { ok: false, tributesNeeded: 0 };
  if (level <= 4) return { ok: true, tributesNeeded: 0 };
  if (level <= 6) return { ok: true, tributesNeeded: 1 };
  if (level <= 8) return { ok: true, tributesNeeded: 2 };
  return { ok: true, tributesNeeded: 3 };
}

function startTurn(forPlayer: TurnSide) {
  gameState.turn = forPlayer;
  gameState.phase = 'Draw';
  gameState.normalSummonUsed = false;
  setLightByTurn(forPlayer === 'player');
  if (forPlayer === 'player') { drawCard('player'); ui.log('➕ Você comprou uma carta.'); }
  else { drawCard('enemy'); ui.log('🤖 Inimigo comprou uma carta.'); setTimeout(enemyTurn, 750); }
  ui.update(toRender());
  ui.render(toRender());
}

function endTurn() {
  if (gameState.winner || gameState.turn !== 'player') return;
  ui.log('🔁 Você terminou seu turno.');
  startTurn('enemy');
}

function playCardFromHand(index: number) {
  if (gameState.winner || gameState.turn !== 'player') return;
  const baseCard = gameState.playerHand[index];
  if (!baseCard) return;
  const customizedCard = customizationSystem.getCustomizedCard(baseCard);
  if (customizedCard.type === 'Creature') {
    if (gameState.phase !== 'Main1' && gameState.phase !== 'Main2') { ui.log('⛔ Só é possível invocar em Main Phase.'); return; }
    if (gameState.normalSummonUsed) { ui.log('⛔ Invocação Normal já usada neste turno.'); return; }
    const { ok, tributesNeeded } = canNormalSummon(customizedCard as CreatureCard, 'player');
    if (!ok) { ui.log('⛔ Campo cheio.'); return; }
    if (tributesNeeded > 0) {
      // Sacrificar automaticamente as primeiras criaturas disponíveis (simplificado)
      const indices = gameState.playerCreatures.map((c, i) => c ? i : -1).filter(i => i !== -1).slice(0, tributesNeeded);
      if (indices.length < tributesNeeded) { ui.log('⛔ Tributos insuficientes.'); return; }
      indices.forEach(i => gameState.playerCreatures[i] = null);
    }
    const slot = firstEmptySlot(gameState.playerCreatures);
    gameState.playerCreatures[slot] = { ...(customizedCard as AnyCard) };
    gameState.playerHand.splice(index, 1);
    gameState.normalSummonUsed = true;
    ui.log(`🃏 Você invocou ${customizedCard.name}.`);
  } else if (customizedCard.type === 'Spell' || customizedCard.type === 'Trap') {
    const row = gameState.playerSpellsTraps;
    const slot = firstEmptySlot(row);
    if (slot === -1) { ui.log('⛔ Sem espaço para Magias/Armadilhas.'); return; }
    row[slot] = { ...(customizedCard as AnyCard) };
    gameState.playerHand.splice(index, 1);
    ui.log(`✨ Você posicionou ${customizedCard.name}.`);
  } else if (customizedCard.type === 'Field') {
    gameState.playerFieldCard = { ...(customizedCard as AnyCard) };
    gameState.playerHand.splice(index, 1);
    ui.log(`🌳 Campo ativado: ${customizedCard.name}.`);
  }
  ui.update(toRender());
  ui.render(toRender());
}

function resolveBattlePhase(attackerSide: TurnSide) {
  const isPlayer = attackerSide === 'player';
  const attackers = isPlayer ? gameState.playerCreatures : gameState.enemyCreatures;
  const defenders = isPlayer ? gameState.enemyCreatures : gameState.playerCreatures;
  attackers.forEach((card, i) => {
    if (!card) return;
    const defender = defenders[i];
    if (!defender) {
      if (isPlayer) { gameState.enemyLifePoints = Math.max(0, gameState.enemyLifePoints - ((card as any).attack || 0)); ui.log(`⚔️ ${card.name} ataca diretamente (${(card as any).attack}).`); }
      else { gameState.playerLifePoints = Math.max(0, gameState.playerLifePoints - ((card as any).attack || 0)); ui.log(`⚔️ ${card.name} do inimigo ataca diretamente (${(card as any).attack}).`); }
      return;
    }
    const attackA = (card as any).attack || 0;
    const attackB = (defender as any).attack || 0;
    if (attackA > attackB) {
      const diff = attackA - attackB; defenders[i] = null;
      if (isPlayer) { gameState.enemyLifePoints = Math.max(0, gameState.enemyLifePoints - diff); ui.log(`💥 ${card.name} destrói ${defender.name} e causa ${diff}.`); }
      else { gameState.playerLifePoints = Math.max(0, gameState.playerLifePoints - diff); ui.log(`💥 ${card.name} destrói ${defender.name} e causa ${diff}.`); }
    } else if (attackB > attackA) {
      const diff = attackB - attackA; attackers[i] = null;
      if (isPlayer) { gameState.playerLifePoints = Math.max(0, gameState.playerLifePoints - diff); ui.log(`💥 ${defender.name} derrota ${card.name}; você sofre ${diff}.`); }
      else { gameState.enemyLifePoints = Math.max(0, gameState.enemyLifePoints - diff); ui.log(`💥 ${defender.name} derrota ${card.name} do inimigo; ele sofre ${diff}.`); }
    } else {
      attackers[i] = null; defenders[i] = null; ui.log('💥 Confronto empatado: ambas as cartas são destruídas.');
    }
  });
  checkWinner();
}

function checkWinner() {
  if (gameState.playerLifePoints <= 0 && !gameState.winner) { gameState.winner = 'enemy'; ui.log('❌ Você perdeu!'); }
  if (gameState.enemyLifePoints <= 0 && !gameState.winner) { gameState.winner = 'player'; ui.log('🏆 Você venceu! +500 moedas'); customizationSystem.addCurrency(500); }
  ui.update(gameState as any); ui.render(gameState as any);
}

function attackAndEndTurn() {
  if (gameState.winner || gameState.turn !== 'player') return;
  resolveBattlePhase('player');
  if (!gameState.winner) startTurn('enemy');
}

function enemyTurn() {
  if (gameState.winner || gameState.turn !== 'enemy') return;
  let bestIndex = -1; let bestScore = -1;
  for (let i = 0; i < gameState.enemyHand.length; i++) {
    const card = gameState.enemyHand[i];
    let score = 0;
    if (card.type === 'Creature') {
      const { ok } = canNormalSummon(card as CreatureCard, 'enemy');
      if (!ok) continue;
      score = ((card as any).attack || 0) + 100;
    } else if (card.type === 'Spell' || card.type === 'Trap') {
      score = 300;
    } else if (card.type === 'Field') {
      score = 200;
    }
    if (score > bestScore) { bestScore = score; bestIndex = i; }
  }
  if (bestIndex !== -1) {
    const card = gameState.enemyHand[bestIndex];
    if (card.type === 'Creature') {
      const { tributesNeeded } = canNormalSummon(card as CreatureCard, 'enemy');
      if (tributesNeeded > 0) {
        const indices = gameState.enemyCreatures.map((c, i) => c ? i : -1).filter(i => i !== -1).slice(0, tributesNeeded);
        indices.forEach(i => gameState.enemyCreatures[i] = null);
      }
      const slotIndex = firstEmptySlot(gameState.enemyCreatures);
      gameState.enemyCreatures[slotIndex] = { ...card };
      ui.log(`🤖 Inimigo invoca ${card.name}.`);
    } else if (card.type === 'Spell' || card.type === 'Trap') {
      const row = gameState.enemySpellsTraps;
      const slot = firstEmptySlot(row);
      if (slot !== -1) { row[slot] = { ...card }; ui.log(`🤖 Inimigo posiciona ${card.name}.`); }
    } else if (card.type === 'Field') {
      gameState.enemyFieldCard = { ...card }; ui.log(`🤖 Campo ativado: ${card.name}.`);
    }
    gameState.enemyHand.splice(bestIndex, 1);
  }
  resolveBattlePhase('enemy');
  if (!gameState.winner) { ui.log('🔁 Inimigo termina o turno.'); startTurn('player'); }
}

function mountUI() {
  document.body.insertAdjacentHTML('beforeend', `
    <div id="game-ui" class="game-ui">
      <div class="stats-row">
        <span class="stat-label">Você:</span>
        <span class="stat-value" id="playerLife">8000</span>
      </div>
      <div class="stats-row">
        <span class="stat-label">Inimigo:</span>
        <span class="stat-value" id="enemyLife">8000</span>
      </div>
      <div class="stats-row">
        <span class="stat-label">Fase:</span>
        <span class="stat-value" id="phaseLabel">Draw</span>
      </div>
      <div id="turnIndicator">SEU TURNO</div>
      <div class="board">
        <div class="field-row" id="enemyFieldRow">
          <div id="enemyFieldZone" class="slot"></div>
        </div>
        <div class="field-row" id="enemySpellsTraps"></div>
        <div class="field-row" id="enemyCreatures"></div>
        <hr />
        <div class="field-row" id="playerCreatures"></div>
        <div class="field-row" id="playerSpellsTraps"></div>
        <div class="field-row" id="playerFieldRow">
          <div id="playerFieldZone" class="slot"></div>
        </div>
        <div class="hand-row">
          <div id="playerHand" class="hand"></div>
          <div class="actions">
            <button id="attackBtn" class="end-turn-btn">Atacar & Encerrar</button>
            <button id="endTurnBtn" class="end-turn-btn alt">Encerrar Turno</button>
            <button id="nextPhaseBtn" class="end-turn-btn alt">Próxima Fase</button>
          </div>
        </div>
      </div>
      <div id="battleLog"></div>
    </div>`);
}

function startGame() {
  mountUI();
  ui.init();
  ui.bindHandlers({ onEndTurn: endTurn, onAttack: attackAndEndTurn, onPlayFromHand: playCardFromHand });
  customizationSystem.init();
  gameState.playerDeck = buildDeck();
  gameState.enemyDeck = buildDeck();
  for (let i = 0; i < 5; i++) { drawCard('player'); drawCard('enemy'); }
  ui.log('🎴 Duelo iniciado!');
  ui.log('🎨 Use o botão "Personalizar Cartas" para customizar suas cartas!');
  ui.log('💰 Ganhe moedas vencendo duelos!');
  setLightByTurn(true);
  ui.update(gameState as any);
  ui.render(toRender());
  setTimeout(() => { customizationSystem.addCurrency(200); ui.log('💰 +200 moedas por iniciar o jogo!'); }, 1500);
}

startGame();

(window as any).gameUtils = { gameState };

function toRender() {
  return {
    playerLifePoints: gameState.playerLifePoints,
    enemyLifePoints: gameState.enemyLifePoints,
    turn: gameState.turn,
    phase: gameState.phase,
    normalSummonUsed: gameState.normalSummonUsed,
    playerHand: gameState.playerHand,
    playerCreatures: gameState.playerCreatures,
    playerSpellsTraps: gameState.playerSpellsTraps,
    playerFieldCard: gameState.playerFieldCard,
    enemyCreatures: gameState.enemyCreatures,
    enemySpellsTraps: gameState.enemySpellsTraps,
    enemyFieldCard: gameState.enemyFieldCard
  } as any;
}

