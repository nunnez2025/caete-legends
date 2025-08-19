import { cardDatabase } from './cards.js';
import { setLightByTurn } from './three-scene.js';
import { ui } from './ui.js';
import { customizationSystem } from './customization.js';

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
      <div class="stats-row">
        <span class="stat-label">Você:</span>
        <span class="stat-value" id="playerLife">8000</span>
      </div>
      <div class="stats-row">
        <span class="stat-label">Mana:</span>
        <span class="stat-value" id="playerMana">4</span>
      </div>
      <div class="stats-row">
        <span class="stat-label">Inimigo:</span>
        <span class="stat-value" id="enemyLife">8000</span>
      </div>
      <div class="stats-row">
        <span class="stat-label">Mana Inimiga:</span>
        <span class="stat-value" id="enemyMana">4</span>
      </div>
      <div id="turnIndicator">SEU TURNO</div>
      <div id="battleLog"></div>
    </div>
  `;

  ui.init();
  customizationSystem.init();
  
  ui.log('🎴 Duelo iniciado!');
  ui.log('🎨 Use o botão "Personalizar Cartas" para customizar suas cartas!');
  ui.log('💰 Ganhe moedas vencendo duelos!');
  
  setLightByTurn(true);
  ui.update(gameState);
  
  // Simulate earning currency for demonstration
  setTimeout(() => {
    customizationSystem.addCurrency(200);
    ui.log('💰 +200 moedas por iniciar o jogo!');
  }, 2000);
}

// Enhanced game functions with customization integration
function playCard(cardId) {
  const customizedCard = customizationSystem.getCustomizedCard(
    cardDatabase.monsters.find(card => card.id === cardId) ||
    cardDatabase.spells.find(card => card.id === cardId)
  );
  
  if (customizedCard) {
    ui.log(`🃏 ${customizedCard.name} invocado com melhorias!`);
    if (customizedCard.attack > cardDatabase.monsters.find(c => c.id === cardId)?.attack) {
      ui.log(`⚔️ Ataque aumentado para ${customizedCard.attack}!`);
    }
  }
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