import { cardDatabase } from './cards.js';
import { setLightByTurn } from './three-scene.js';
import { ui } from './ui.js';

const gameState = {
  turn: 'player',
  playerLifePoints: 8000,
  enemyLifePoints: 8000,
  playerMana: 4,
  enemyMana: 4,
  playerHand: [],
  playerField: [null, null, null, null, null],
  enemyField: [null, null, null, null, null],
};

function startGame() {
  document.body.innerHTML += `
    <div id="game-ui" class="game-ui">
      <div>Você: <span id="playerLife">8000</span> | Mana: <span id="playerMana">4</span></div>
      <div>Inimigo: <span id="enemyLife">8000</span> | Mana: <span id="enemyMana">4</span></div>
      <div id="turnIndicator">SEU TURNO</div>
      <div id="battleLog" style="height: 100px; overflow-y: auto; background: #0008; color: #0f0; font-size: 10px;"></div>
    </div>
  `;
  ui.init();
  ui.log('🎴 Duelo iniciado!');
  setLightByTurn(true);
  ui.update(gameState);
}

startGame();
