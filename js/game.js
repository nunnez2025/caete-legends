import { cardDatabase } from './cards.js';

async function loadExternalScript(sourceUrl) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = sourceUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Falha ao carregar script: ${sourceUrl}`));
    document.head.appendChild(script);
  });
}

function injectShell() {
  document.body.className = 'min-h-screen bg-gradient-to-br from-emerald-900 via-amber-900 to-red-900 text-white relative overflow-hidden';
  document.body.innerHTML = `
    <canvas id="three-canvas"></canvas>
    <div id="floating-texts"></div>
    <div class="absolute inset-0 opacity-20 pointer-events-none">
      <div class="absolute top-10 left-8 text-6xl sm:text-8xl animate-pulse">🏹</div>
      <div class="absolute top-32 right-4 sm:right-16 text-4xl sm:text-6xl animate-bounce">🪶</div>
      <div class="absolute bottom-20 left-4 sm:left-16 text-6xl sm:text-7xl animate-pulse">🌳</div>
      <div class="absolute bottom-32 right-2 sm:right-8 text-3xl sm:text-5xl animate-bounce">🐬</div>
    </div>
    <div class="relative z-10">
      <div class="border-b-4 border-yellow-400 bg-black/95 backdrop-blur-lg shadow-2xl">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 via-yellow-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse"></div>
              <div>
                <h1 class="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-300 via-yellow-300 to-red-300 bg-clip-text text-transparent">CAETÉ LEGENDS</h1>
                <h2 class="text-sm sm:text-xl font-bold text-orange-300">EDIÇÃO BRASILEIRA PRO</h2>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="text-center bg-gradient-to-br from-green-800 to-emerald-900 p-2 rounded-lg border-2 border-green-400/50">
                <div class="text-sm sm:text-lg font-bold text-green-400" id="playerWins">0</div>
                <div class="text-xs text-green-300">Vitórias</div>
              </div>
              <div class="text-center bg-gradient-to-br from-red-800 to-rose-900 p-2 rounded-lg border-2 border-red-400/50">
                <div class="text-sm sm:text-lg font-bold text-red-400" id="playerLosses">0</div>
                <div class="text-xs text-red-300">Derrotas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto p-4" id="gameContainer">
        <div id="menuScreen" class="text-center space-y-6">
          <div class="bg-black/80 rounded-3xl p-6 sm:p-12 border-4 border-yellow-400/50 shadow-2xl">
            <h2 class="text-5xl sm:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-emerald-300 via-yellow-300 to-red-300 bg-clip-text text-transparent animate-pulse">LENDAS DO BRASIL</h2>
            <p class="text-xl sm:text-2xl text-orange-300 mb-6 font-bold">🏹 Edição Brasileira Pro 🏹</p>
          </div>
          <button id="startDuelBtn" class="touch-btn bg-gradient-to-r from-emerald-600 via-yellow-600 to-red-600 hover:from-emerald-700 hover:via-yellow-700 hover:to-red-700 text-white font-black py-4 sm:py-6 px-8 sm:px-12 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-500 btn-3d">
            <span class="text-xl sm:text-2xl">⚔️ INICIAR DUELO ⚔️</span>
          </button>
        </div>

        <div id="duelScreen" class="space-y-4 hidden">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black/90 p-4 sm:p-6 rounded-2xl border-4 border-yellow-400/50 shadow-2xl">
            <div class="text-center">
              <div class="bg-green-800/50 p-3 sm:p-4 rounded-xl border border-green-400/50">
                <h4 class="text-base sm:text-lg font-bold text-green-300 mb-2">🏹 VOCÊ</h4>
                <div class="flex justify-center space-x-3">
                  <div class="text-center">
                    <div class="text-lg sm:text-xl font-bold text-green-400 hp-glow" id="playerLife">8000</div>
                    <div class="text-xs sm:text-xs text-green-300">VIDA</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg sm:text-xl font-bold text-blue-400 mana-glow" id="playerMana">4</div>
                    <div class="text-xs sm:text-xs text-blue-300">MANA</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <div class="bg-yellow-800/50 p-3 sm:p-4 rounded-xl border border-yellow-400/50">
                <div class="text-sm sm:text-lg text-yellow-300 font-bold">DUELO CAETÉ</div>
                <div class="text-xs sm:text-sm text-gray-300">Turno <span id="turnCount">1</span></div>
                <div class="text-xs sm:text-sm font-bold" id="turnIndicator">SEU TURNO</div>
              </div>
            </div>
            <div class="text-center">
              <div class="bg-red-800/50 p-3 sm:p-4 rounded-xl border border-red-400/50">
                <h4 class="text-base sm:text-lg font-bold text-red-300 mb-2">👹 INIMIGO</h4>
                <div class="flex justify-center space-x-3">
                  <div class="text-center">
                    <div class="text-lg sm:text-xl font-bold text-red-400 hp-glow" id="enemyLife">8000</div>
                    <div class="text-xs sm:text-xs text-red-300">VIDA</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg sm:text-xl font-bold text-blue-400 mana-glow" id="enemyMana">4</div>
                    <div class="text-xs sm:text-xs text-blue-300">MANA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center">
            <h4 class="text-lg sm:text-xl font-bold text-red-300 mb-2">👹 CAMPO INIMIGO</h4>
            <div class="grid grid-cols-5 gap-1 sm:gap-3" id="enemyField"></div>
          </div>

          <div class="text-center">
            <h4 class="text-lg sm:text-xl font-bold text-green-300 mb-2">🏹 SEU CAMPO</h4>
            <div class="grid grid-cols-5 gap-1 sm:gap-3" id="playerField"></div>
          </div>

          <div class="bg-black/90 p-3 rounded-xl border-2 border-green-400/50">
            <div class="flex items-center justify-between mb-2">
              <h5 class="text-base sm:text-lg font-bold text-green-300">🃏 SUA MÃO</h5>
              <div class="flex gap-2">
                <button id="battlePhaseBtn" class="touch-btn bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-3 rounded-lg btn-3d text-xs">⚔️ BATALHA</button>
                <button id="endTurnBtn" class="touch-btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg btn-3d text-xs">🔄 FIM DO TURNO</button>
              </div>
            </div>
            <div class="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2" id="playerHand"></div>
            <div class="text-[10px] text-gray-300 mt-1 text-left">Dica: arraste monstros para o seu campo. Arraste magias para o campo para ativar.</div>
          </div>

          <div class="bg-black/90 border-2 border-yellow-400/50 h-32 sm:h-48">
            <div class="p-3 h-full">
              <h5 class="text-xs sm:text-sm font-bold text-yellow-300 mb-1">📜 LOG DE BATALHA</h5>
              <div class="space-y-1 h-24 sm:h-32 overflow-y-auto text-xs sm:text-sm" id="battleLog"></div>
            </div>
          </div>
        </div>

        <div id="victoryScreen" class="text-center space-y-6 hidden">
          <div class="bg-black/90 rounded-3xl p-6 sm:p-12 border-4 border-yellow-400 shadow-2xl">
            <div class="text-6xl sm:text-8xl animate-bounce mb-4">🏆</div>
            <h2 class="text-4xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent animate-pulse">VITÓRIA ÉPICA!</h2>
            <p class="text-xl sm:text-2xl text-green-300 mb-6 font-bold">🎉 Você dominou as lendas brasileiras! 🎉</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-6">
              <div class="bg-yellow-800/50 p-3 rounded-xl border border-yellow-400/50">
                <div class="text-xl sm:text-2xl font-bold text-yellow-400" id="victoryStreak">0</div>
                <div class="text-sm sm:text-sm text-yellow-300">Sequência</div>
              </div>
              <div class="bg-purple-800/50 p-3 rounded-xl border border-purple-400/50">
                <div class="text-xl sm:text-2xl font-bold text-green-400" id="victoryTurns">0</div>
                <div class="text-sm sm:text-sm text-green-300">Turnos</div>
              </div>
              <div class="bg-green-800/50 p-3 rounded-xl border border-green-400/50">
                <div class="text-xl sm:text-2xl font-bold text-green-400">VITÓRIA</div>
                <div class="text-sm sm:text-sm text-green-300">Conquistada</div>
              </div>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 space-x-0 sm:space-x-4">
            <button id="newDuelBtn" class="touch-btn bg-green-600 hover:bg-green-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg">⚔️ NOVO DUELO</button>
            <button id="backToMenuBtn1" class="touch-btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg">🏠 MENU</button>
          </div>
        </div>

        <div id="defeatScreen" class="text-center space-y-6 hidden">
          <div class="bg-black/90 rounded-3xl p-6 sm:p-12 border-4 border-red-400 shadow-2xl">
            <div class="text-6xl sm:text-8xl animate-pulse mb-4">💀</div>
            <h2 class="text-4xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-red-400 to-gray-400 bg-clip-text text-transparent">DERROTA</h2>
            <p class="text-xl sm:text-2xl text-red-300 mb-6 font-bold">⚰️ Os espíritos sombrios prevaleceram... ⚰️</p>
            <div class="bg-gray-800/50 p-4 rounded-xl border border-red-400/50 max-w-xl mx-auto mb-6">
              <h3 class="text-base sm:text-lg font-bold text-red-300 mb-3">📊 Estatísticas</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="text-center">
                  <div class="text-lg sm:text-xl font-bold text-orange-400" id="defeatTurns">0</div>
                  <div class="text-sm sm:text-sm text-orange-300">Turnos</div>
                </div>
                <div class="text-center">
                  <div class="text-lg sm:text-xl font-bold text-purple-400" id="defeatSpells">0</div>
                  <div class="text-sm sm:text-sm text-purple-300">Magias</div>
                </div>
                <div class="text-center">
                  <div class="text-lg sm:text-xl font-bold text-blue-400" id="defeatMonsters">0</div>
                  <div class="text-sm sm:text-sm text-blue-300">Criaturas</div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 space-x-0 sm:space-x-4">
            <button id="revengeBtn" class="touch-btn bg-red-600 hover:bg-red-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg">⚔️ VINGANÇA!</button>
            <button id="backToMenuBtn2" class="touch-btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg">🔄 MENU</button>
          </div>
        </div>
      </div>
    </div>`;
}

function getDom() {
  return {
    floatingTexts: document.getElementById('floating-texts'),
    screens: {
      menu: document.getElementById('menuScreen'),
      duel: document.getElementById('duelScreen'),
      victory: document.getElementById('victoryScreen'),
      defeat: document.getElementById('defeatScreen')
    },
    elements: {
      playerLife: document.getElementById('playerLife'),
      enemyLife: document.getElementById('enemyLife'),
      playerMana: document.getElementById('playerMana'),
      enemyMana: document.getElementById('enemyMana'),
      turnCount: document.getElementById('turnCount'),
      turnIndicator: document.getElementById('turnIndicator'),
      battleLog: document.getElementById('battleLog'),
      playerField: document.getElementById('playerField'),
      enemyField: document.getElementById('enemyField'),
      playerHand: document.getElementById('playerHand'),
      endTurnBtn: document.getElementById('endTurnBtn'),
      battlePhaseBtn: document.getElementById('battlePhaseBtn'),
      playerWins: document.getElementById('playerWins'),
      playerLosses: document.getElementById('playerLosses'),
      victoryStreak: document.getElementById('victoryStreak'),
      victoryTurns: document.getElementById('victoryTurns'),
      defeatTurns: document.getElementById('defeatTurns'),
      defeatSpells: document.getElementById('defeatSpells'),
      defeatMonsters: document.getElementById('defeatMonsters')
    }
  };
}

const game = {
  state: {
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
    monstersDefeated: 0,
    attackMode: false,
    attackerIndex: null
  },
  playerDeck: [],
  enemyDeck: [],
  playerHand: [],
  enemyHand: [],
  playerField: [null, null, null, null, null],
  enemyField: [null, null, null, null, null],
  selectedCard: null,
  dragging: null,
  dom: null
};

function addFloatingText(text, color = 'text-yellow-400', x = window.innerWidth * 0.5, y = window.innerHeight * 0.6) {
  const el = document.createElement('div');
  el.textContent = text;
  el.className = `floating-text ${color}`;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  game.dom.floatingTexts.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

function getCardById(cardId) {
  const cleanId = (cardId || '').replace(/_\d+$/, '');
  return [...cardDatabase.monsters, ...cardDatabase.spells].find(c => c.id === cleanId);
}

function canAfford(card, isPlayer = true) {
  if (!card || !card.manaCost) return true;
  const mana = isPlayer ? game.state.playerMana : game.state.enemyMana;
  return mana >= card.manaCost;
}

function shuffleDeck(deck) {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

function drawCard(isPlayer, count = 1) {
  for (let i = 0; i < count; i++) {
    if (isPlayer && game.playerDeck.length > 0) {
      const drawn = game.playerDeck.shift();
      game.playerHand.push(drawn);
      renderHand();
    } else if (!isPlayer && game.enemyDeck.length > 0) {
      const drawn = game.enemyDeck.shift();
      game.enemyHand.push(drawn);
    }
  }
}

function createBalancedDeck() {
  const monsters = cardDatabase.monsters.slice();
  const spells = cardDatabase.spells.slice();
  const deck = [];
  for (let i = 0; i < 15; i++) {
    const m = monsters[Math.floor(Math.random() * monsters.length)];
    deck.push(m.id + '_' + i);
  }
  for (let i = 0; i < 5; i++) {
    const s = spells[Math.floor(Math.random() * spells.length)];
    deck.push(s.id + '_' + i);
  }
  return shuffleDeck(deck);
}

function summonMonster(cardId, position, isPlayer = true) {
  const card = getCardById(cardId);
  if (!card || card.type !== 'Monster') return false;
  if (game.state[isPlayer ? 'playerMana' : 'enemyMana'] < card.manaCost) return false;

  const field = isPlayer ? game.playerField : game.enemyField;
  if (position < 0 || position >= field.length || field[position]) return false;

  game.state[isPlayer ? 'playerMana' : 'enemyMana'] -= card.manaCost;
  const summoned = { ...card, id: cardId, attackedThisTurn: false };
  field[position] = summoned;

  const hand = isPlayer ? game.playerHand : game.enemyHand;
  const idx = hand.indexOf(cardId);
  if (idx > -1) hand.splice(idx, 1);

  addFloatingText(`✨ ${card.name} Invocado!`, 'text-blue-400');
  logBattle(`${isPlayer ? '🏹 Você invocou' : '👹 Oponente invocou'} ${card.name}!`, 'summon');
  renderField(true); renderField(false); renderHand(); updateUI();
  return true;
}

function castSpell(cardId, isPlayer = true) {
  const card = getCardById(cardId);
  if (!card || card.type !== 'Spell') return false;
  if (game.state[isPlayer ? 'playerMana' : 'enemyMana'] < card.manaCost) return false;

  game.state[isPlayer ? 'playerMana' : 'enemyMana'] -= card.manaCost;
  game.state.spellsCast++;

  const hand = isPlayer ? game.playerHand : game.enemyHand;
  const idx = hand.indexOf(cardId);
  if (idx > -1) hand.splice(idx, 1);

  if (card.id === 'canto_paje') {
    const key = isPlayer ? 'playerLifePoints' : 'enemyLifePoints';
    game.state[key] = Math.min(8000, game.state[key] + 1000);
    drawCard(isPlayer, 1);
    addFloatingText('💚 +1000 LP!', 'text-green-400');
  } else if (card.id === 'furia_floresta') {
    const field = isPlayer ? game.playerField : game.enemyField;
    field.forEach(m => { if (m) m.attack += 300; });
    addFloatingText('🌳 +300 ATK (time)!', 'text-green-300');
    setTimeout(() => { field.forEach(m => { if (m) m.attack -= 300; }); }, 2000);
  }

  logBattle(`${isPlayer ? '🧙 Você lançou' : '🧙‍♂️ Inimigo lançou'} ${card.name}!`, 'spell');
  renderHand(); updateUI();
  return true;
}

function toggleBattlePhase() {
  if (game.state.turn !== 'player') return;
  game.state.attackMode = !game.state.attackMode;
  game.state.attackerIndex = null;
  highlightAttackState();
  const btn = game.dom.elements.battlePhaseBtn;
  if (btn) btn.textContent = game.state.attackMode ? '✅ ATACAR (ATIVO)' : '⚔️ BATALHA';
  if (game.state.attackMode) addFloatingText('⚔️ Selecione um atacante', 'text-amber-300');
}

function resolveCombat(attackerIdx, defenderIdx) {
  const attacker = game.playerField[attackerIdx];
  if (!attacker || attacker.attackedThisTurn) return;
  const defender = game.enemyField[defenderIdx];

  if (defender) {
    const diff = attacker.attack - defender.attack;
    if (diff > 0) {
      game.enemyField[defenderIdx] = null;
      game.state.enemyLifePoints -= diff;
      game.state.monstersDefeated++;
      addFloatingText(`💥 ${attacker.name} venceu! -${diff} LP`, 'text-red-400');
      logBattle(`⚔️ ${attacker.name} derrotou ${defender.name} (dano excedente ${diff}).`, 'combat');
    } else if (diff < 0) {
      game.playerField[attackerIdx] = null;
      game.state.playerLifePoints -= Math.abs(diff);
      addFloatingText(`💥 ${defender.name} resistiu! -${Math.abs(diff)} LP`, 'text-red-400');
      logBattle(`⚔️ ${attacker.name} foi destruído por ${defender.name} (recebeu ${Math.abs(diff)}).`, 'combat');
    } else {
      game.enemyField[defenderIdx] = null;
      game.playerField[attackerIdx] = null;
      logBattle('⚔️ Choque de forças! Ambos destruídos.', 'combat');
      addFloatingText('💥💥', 'text-amber-300');
    }
  } else {
    game.state.enemyLifePoints -= attacker.attack;
    addFloatingText(`🗡️ -${attacker.attack} (direto)`, 'text-red-400');
    logBattle(`🗡️ Ataque direto com ${attacker.name} por ${attacker.attack} de dano.`, 'direct_attack');
  }

  attacker.attackedThisTurn = true;
  game.state.attackerIndex = null;
  updateUI(); renderField(true); renderField(false); checkGameOver();
}

function highlightAttackState() {
  document.querySelectorAll('[data-player-slot]').forEach(el => el.classList.remove('attacker-ready'));
  document.querySelectorAll('[data-enemy-slot], #enemyField').forEach(el => el.classList.remove('enemy-targetable'));
  if (!game.state.attackMode) return;
  game.playerField.forEach((m, i) => {
    const slot = document.querySelector(`[data-player-slot="${i}"]`);
    if (m && !m.attackedThisTurn && slot) slot.classList.add('attacker-ready');
  });
  if (game.state.attackerIndex !== null) {
    document.querySelectorAll('[data-enemy-slot]').forEach(el => el.classList.add('enemy-targetable'));
    const enemyFieldEl = game.dom.elements.enemyField; if (enemyFieldEl) enemyFieldEl.classList.add('enemy-targetable');
  }
}

function logBattle(message, type = 'default') {
  game.state.battleLog.unshift({ id: Date.now() + Math.random(), message, type, timestamp: Date.now() });
  renderBattleLog();
}

function renderBattleLog() {
  const c = game.dom.elements.battleLog; c.innerHTML = '';
  game.state.battleLog.slice(0, 8).forEach(entry => {
    const div = document.createElement('div');
    div.className = `p-1 sm:p-2 rounded border-l-2 text-xs sm:text-sm ${
      entry.type === 'combat' ? 'bg-red-900/30 border-red-400 text-red-200' :
      entry.type === 'summon' ? 'bg-green-900/30 border-green-400 text-green-200' :
      entry.type === 'direct_attack' ? 'bg-orange-900/30 border-orange-400 text-orange-200' :
      entry.type === 'spell' ? 'bg-purple-900/30 border-purple-400 text-purple-200' :
      'bg-blue-900/30 border-blue-400 text-blue-200'}`;
    div.innerHTML = `<div class="font-semibold">${entry.message}</div>`;
    c.appendChild(div);
  });
}

function rarityClass(r) {
  const c = {
    common: 'border-gray-400 bg-gradient-to-br from-gray-800 to-gray-900',
    rare: 'border-blue-400 bg-gradient-to-br from-blue-800 to-blue-900',
    super_rare: 'border-purple-400 bg-gradient-to-br from-purple-800 to-purple-900',
    legendary: 'border-red-400 bg-gradient-to-br from-red-800 via-orange-800 to-yellow-800 animate-pulse'
  }; return c[r] || c.common;
}

function elementIcon(e) {
  const icons = {
    Terra: '<span class="text-amber-500">⬣</span>',
    Água: '<span class="text-blue-400">◈</span>',
    Fogo: '<span class="text-red-500">⬢</span>',
    Floresta: '<span class="text-green-500">⬥</span>',
    Vento: '<span class="text-cyan-400">◇</span>',
    Espírito: '<span class="text-purple-400">⬡</span>'
  }; return icons[e] || '<span class="text-gray-400">○</span>';
}

function renderField(isPlayer) {
  const container = isPlayer ? game.dom.elements.playerField : game.dom.elements.enemyField;
  const field = isPlayer ? game.playerField : game.enemyField;
  container.innerHTML = '';
  field.forEach((monster, index) => {
    const slot = document.createElement('div');
    slot.dataset[isPlayer ? 'playerSlot' : 'enemySlot'] = index;
    slot.className = `h-20 sm:h-32 flex items-center justify-center border-2 text-xs sm:text-sm transition-all duration-200 card-glow cursor-pointer ${monster ? rarityClass(monster.rarity) : 'border-dashed border-gray-600 bg-gray-800/20'}`;
    if (monster) {
      const content = document.createElement('div');
      content.className = 'text-center p-1 sm:p-2 select-none';
      content.innerHTML = `
        <div class="text-2xl sm:text-3xl mb-1">${monster.art}</div>
        <div class="text-[10px] sm:text-xs font-bold text-white mb-1">${monster.name}</div>
        <div class="flex justify-center space-x-1 text-[10px]">
          <span class="text-red-400">${monster.attack}</span>
          <span class="text-blue-400">${monster.defense}</span>
        </div>
        <div class="flex justify-center mt-1">${elementIcon(monster.element)}</div>`;
      slot.appendChild(content);
      if (isPlayer) slot.addEventListener('click', () => { if (game.state.attackMode && monster && !monster.attackedThisTurn) { game.state.attackerIndex = index; highlightAttackState(); addFloatingText('🎯 Selecione o alvo', 'text-amber-300'); } });
    } else {
      if (isPlayer && game.selectedCard && getCardById(game.selectedCard)?.type === 'Monster' && canAfford(getCardById(game.selectedCard))) slot.classList.add('droppable','droppable-ok');
      const content = document.createElement('div'); content.className = 'text-gray-500 text-center select-none'; content.innerHTML = `<div class="text-xl sm:text-2xl mb-1">⭕</div><div class="text-[10px]">Vazio</div>`; slot.appendChild(content);
    }
    if (!isPlayer) slot.addEventListener('click', () => { if (game.state.attackMode && game.state.attackerIndex !== null) { resolveCombat(game.state.attackerIndex, index); highlightAttackState(); } });
    container.appendChild(slot);
  });
  if (!isPlayer) container.addEventListener('click', () => { if (game.state.attackMode && game.state.attackerIndex !== null && !game.enemyField.some(m => !!m)) resolveCombat(game.state.attackerIndex, -1); }, { once: true });
}

function renderHand() {
  const hand = game.dom.elements.playerHand; hand.innerHTML = '';
  game.playerHand.forEach((cardId) => {
    const card = getCardById(cardId); if (!card) return;
    const affordable = canAfford(card);
    const el = document.createElement('div');
    el.className = `min-w-[80px] sm:min-w-[140px] h-32 sm:h-48 p-1 sm:p-2 transition-all duration-150 ${rarityClass(card.rarity)} ${!affordable ? 'opacity-50 grayscale' : ''} card-glow relative select-none`;
    el.dataset.cardId = cardId;
    el.innerHTML = `
      <div class="text-center h-full flex flex-col justify-between">
        <div class="flex justify-between items-start mb-0.5"><div class="flex items-center"><span class="text-xs sm:text-xs text-blue-300 ml-0.5">${card.manaCost}</span></div></div>
        <div class="flex-1 flex flex-col justify-center">
          <div class="text-2xl sm:text-3xl mb-1">${card.art}</div>
          <div class="text-[10px] sm:text-xs font-bold text-white mb-0.5">${card.name}</div>
          ${card.type === 'Monster' ? `<div class="flex justify-center space-x-1 text-[10px]"><span class="text-red-400">${card.attack}</span><span class="text-blue-400">${card.defense}</span></div>` : ''}
        </div>
        <div class="text-center"><div class="flex justify-center mb-0.5">${elementIcon(card.element)}</div><div class="text-[9px] sm:text-[11px] ${card.type === 'Monster' ? 'bg-red-600' : 'bg-purple-600'} rounded-full px-1 py-0.5 inline-block">${card.type}</div></div>
      </div>
      ${!affordable ? `<div class="absolute inset-0 bg-red-900/60 rounded flex items-center justify-center"><div class="text-center"><div class="text-[10px] sm:text-xs text-red-200 font-bold">MANA INSUFICIENTE</div></div></div>` : ''}`;
    if (affordable) attachDrag(el);
    hand.appendChild(el);
  });
}

function updateUI() {
  const e = game.dom.elements;
  e.playerLife.textContent = Math.max(0, game.state.playerLifePoints);
  e.enemyLife.textContent = Math.max(0, game.state.enemyLifePoints);
  e.playerMana.textContent = game.state.playerMana;
  e.enemyMana.textContent = game.state.enemyMana;
  e.turnCount.textContent = game.state.turnCount;
  e.turnIndicator.textContent = game.state.turn === 'player' ? 'SEU TURNO' : 'TURNO INIMIGO';
  e.turnIndicator.className = `text-xs sm:text-sm font-bold ${game.state.turn === 'player' ? 'text-green-400' : 'text-red-400'}`;
  e.playerWins.textContent = game.state.playerWins;
  e.playerLosses.textContent = game.state.playerLosses;
  e.battlePhaseBtn.disabled = game.state.turn !== 'player';
  e.endTurnBtn.disabled = game.state.turn !== 'player';
}

function showScreen(name) {
  const s = game.dom.screens; Object.keys(s).forEach(k => s[k].classList.add('hidden')); s[name].classList.remove('hidden');
}

function startDuel() {
  game.playerDeck = createBalancedDeck(); game.enemyDeck = createBalancedDeck();
  game.playerHand = []; game.enemyHand = [];
  game.playerField = [null, null, null, null, null]; game.enemyField = [null, null, null, null, null];
  game.selectedCard = null;
  game.state = { ...game.state, phase: 'duel', turn: 'player', turnCount: 1, playerLifePoints: 8000, enemyLifePoints: 8000, playerMana: 4, enemyMana: 4, maxMana: 4, battleLog: [{ id: 1, message: '🏹⚔️ O duelo sagrado entre as tribos Caeté se inicia!', timestamp: Date.now(), type: 'game_start' }], spellsCast: 0, monstersDefeated: 0, attackMode: false, attackerIndex: null };
  renderField(true); renderField(false); renderHand(); updateUI(); renderBattleLog(); logBattle('🎴 Cartas distribuídas!', 'summon');
  setTimeout(() => { drawCard(true, 5); drawCard(false, 5); }, 200);
  showScreen('duel');
}

function endTurn() {
  if (game.state.turn !== 'player') return;
  game.state.turn = 'enemy'; game.state.attackMode = false; game.state.attackerIndex = null;
  game.playerField.forEach(m => { if (m) m.attackedThisTurn = false; });
  addFloatingText('🔄 Seu turno terminou', 'text-blue-400'); updateUI(); setTimeout(enemyTurn, 800);
}

function enemyTurn() {
  game.state.enemyMana = Math.min(10, game.state.maxMana + Math.floor(game.state.turnCount / 2));
  drawCard(false, 1);
  const monstersInHand = game.enemyHand.map(id => ({ id, card: getCardById(id) })).filter(x => x.card && x.card.type === 'Monster' && x.card.manaCost <= game.state.enemyMana);
  if (monstersInHand.length > 0) { const emptySlot = game.enemyField.findIndex(s => s === null); if (emptySlot !== -1) summonMonster(monstersInHand[0].id, emptySlot, false); }
  setTimeout(() => {
    let didSomething = false; const yourFirst = game.playerField.findIndex(m => !!m);
    game.enemyField.forEach((m, idx) => {
      if (!m) return;
      if (yourFirst === -1) { game.state.playerLifePoints -= m.attack; logBattle(`💀 Inimigo atacou direto com ${m.name} por ${m.attack}.`, 'direct_attack'); addFloatingText(`-${m.attack} HP`, 'text-red-400'); didSomething = true; }
      else { const mine = game.playerField[yourFirst]; if (!mine) return; const diff = m.attack - mine.attack; if (diff > 0) { game.playerField[yourFirst] = null; game.state.playerLifePoints -= diff; logBattle(`⚔️ ${m.name} derrotou ${mine.name} (você levou ${diff}).`, 'combat'); didSomething = true; } else if (diff < 0) { game.enemyField[idx] = null; game.state.enemyLifePoints -= Math.abs(diff); logBattle(`⚔️ ${mine.name} resistiu! Inimigo levou ${Math.abs(diff)}.`, 'combat'); didSomething = true; } else { game.enemyField[idx] = null; game.playerField[yourFirst] = null; logBattle('⚔️ Choque de forças! Ambos destruídos.', 'combat'); didSomething = true; } }
    });
    setTimeout(() => { game.state.turn = 'player'; game.state.turnCount++; game.state.playerMana = Math.min(10, game.state.maxMana + Math.floor(game.state.turnCount / 2)); drawCard(true, 1); game.enemyField.forEach(m => { if (m) m.attackedThisTurn = false; }); renderField(true); renderField(false); updateUI(); checkGameOver(); }, didSomething ? 700 : 300);
  }, 500);
}

function checkGameOver() {
  if (game.state.playerLifePoints <= 0) { game.state.phase = 'defeat'; game.state.playerLosses++; game.state.streak = 0; game.dom.elements.defeatTurns.textContent = game.state.turnCount; game.dom.elements.defeatSpells.textContent = game.state.spellsCast; game.dom.elements.defeatMonsters.textContent = game.state.monstersDefeated; showScreen('defeat'); }
  else if (game.state.enemyLifePoints <= 0) { game.state.phase = 'victory'; game.state.playerWins++; game.state.streak++; game.dom.elements.victoryStreak.textContent = game.state.streak; game.dom.elements.victoryTurns.textContent = game.state.turnCount; showScreen('victory'); }
}

function createGhost(cardEl) { const ghost = cardEl.cloneNode(true); ghost.classList.add('drag-ghost'); ghost.style.left = '0px'; ghost.style.top = '0px'; return ghost; }
function moveGhost(x, y) { if (!game.dragging) return; game.dragging.ghostEl.style.left = (x - game.dragging.offsetX) + 'px'; game.dragging.ghostEl.style.top = (y - game.dragging.offsetY) + 'px'; }
function findAncestorWithAttr(el, attr) { while (el) { if (el.hasAttribute && el.hasAttribute(attr)) return el; el = el.parentElement; } return null; }
function highlightDroppables(cardId) { const card = getCardById(cardId); if (!card) return; if (card.type === 'Monster') { document.querySelectorAll('[data-player-slot]').forEach(el => { const idx = parseInt(el.getAttribute('data-player-slot'), 10); if (!game.playerField[idx] && canAfford(card)) el.classList.add('droppable','droppable-ok'); }); } else { game.dom.elements.playerField.classList.add('droppable','droppable-ok'); } }
function cleanupHighlights() { document.querySelectorAll('.droppable, .droppable-ok').forEach(el => el.classList.remove('droppable','droppable-ok')); }
function shake(el) { el.animate([{ transform: 'translate(-50%, -50%) translateX(0px)' },{ transform: 'translate(-50%, -50%) translateX(-10px)' },{ transform: 'translate(-50%, -50%) translateX(10px)' },{ transform: 'translate(-50%, -50%) translateX(0px)' }], { duration: 250, iterations: 1 }); }

function attachDrag(cardEl) {
  const start = (x, y) => { const r = cardEl.getBoundingClientRect(); game.dragging = { cardId: cardEl.dataset.cardId, offsetX: x - (r.left + r.width/2), offsetY: y - (r.top + r.height/2), ghostEl: createGhost(cardEl) }; document.body.appendChild(game.dragging.ghostEl); moveGhost(x, y); highlightDroppables(game.dragging.cardId); };
  const move = (x, y) => { if (!game.dragging) return; moveGhost(x, y); };
  const end = (x, y) => { if (!game.dragging) return; const el = document.elementFromPoint(x, y); const cardId = game.dragging.cardId; const card = getCardById(cardId); const ghost = game.dragging.ghostEl; cleanupHighlights(); if (card.type === 'Monster') { const slotEl = findAncestorWithAttr(el, 'data-player-slot'); if (slotEl) { const pos = parseInt(slotEl.getAttribute('data-player-slot'), 10); const ok = summonMonster(cardId, pos, true); if (!ok) shake(ghost); } else { shake(ghost); } } else if (card.type === 'Spell') { const arena = game.dom.elements.playerField; const r = arena.getBoundingClientRect(); if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) castSpell(cardId, true); else shake(ghost); } ghost.remove(); game.dragging = null; };
  cardEl.addEventListener('pointerdown', e => { if (game.state.turn !== 'player') return; e.preventDefault(); cardEl.setPointerCapture(e.pointerId); start(e.clientX, e.clientY); });
  cardEl.addEventListener('pointermove', e => { if (game.dragging) move(e.clientX, e.clientY); });
  cardEl.addEventListener('pointerup', e => { if (game.dragging) end(e.clientX, e.clientY); });
  cardEl.addEventListener('pointercancel', () => { if (game.dragging) { game.dragging.ghostEl.remove(); game.dragging = null; cleanupHighlights(); } });
}

function initThree() {
  const THREE = window.THREE; const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), alpha: true, antialias: true }); renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const geom = new THREE.BufferGeometry(); const count = 120; const pos = new Float32Array(count*3); for (let i=0;i<count*3;i+=3){ pos[i]=(Math.random()-0.5)*10; pos[i+1]=(Math.random()-0.5)*10; pos[i+2]=(Math.random()-0.5)*10; } geom.setAttribute('position', new THREE.BufferAttribute(pos,3)); const mat = new THREE.PointsMaterial({ size: 0.02, color: 0xff69b4, transparent: true, opacity: 0.8 }); const mesh = new THREE.Points(geom, mat); scene.add(mesh); camera.position.z=5; (function animate(){ requestAnimationFrame(animate); mesh.rotation.x+=0.001; mesh.rotation.y+=0.001; renderer.render(scene,camera); })(); window.addEventListener('resize',()=>{ camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
}

(async function bootstrap(){
  await loadExternalScript('https://cdn.tailwindcss.com');
  await loadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
  injectShell();
  game.dom = getDom();
  document.getElementById('startDuelBtn').onclick = startDuel;
  game.dom.elements.endTurnBtn.onclick = endTurn;
  game.dom.elements.battlePhaseBtn.onclick = toggleBattlePhase;
  document.getElementById('newDuelBtn').onclick = startDuel;
  document.getElementById('revengeBtn').onclick = startDuel;
  document.getElementById('backToMenuBtn1').onclick = () => showScreen('menu');
  document.getElementById('backToMenuBtn2').onclick = () => showScreen('menu');
  initThree();
  showScreen('menu');
  let lastTouch=0; document.addEventListener('touchend',(e)=>{ const now=Date.now(); if (now-lastTouch<=300) e.preventDefault(); lastTouch=now; },{ passive:false });
})();

