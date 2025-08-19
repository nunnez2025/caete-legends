import { gameState, startGame, playCardFromHand, endTurn, attack, toRender } from './game/game.js';
import { ui } from './game/ui.js';
import { customizationSystem } from './game/customization.js';

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  // Configurar botões do menu
  setupMenuButtons();
  
  // Configurar botões do jogo
  setupGameButtons();
  
  // Inicializar interface
  ui.init();
  
  // Mostrar menu inicial
  showScreen('menu');
});

function setupMenuButtons() {
  // Botões do menu principal
  document.getElementById('btn-iniciar-rapido')?.addEventListener('click', () => {
    startGame();
    showScreen('game');
  });
  
  document.getElementById('btn-abrir-deckbuilder')?.addEventListener('click', () => {
    showScreen('deck');
    populateDeckBuilder();
  });
  
  document.getElementById('btn-iniciar-campanha')?.addEventListener('click', () => {
    showScreen('campaign');
  });
  
  // Botões de voltar
  document.getElementById('btn-voltar-menu')?.addEventListener('click', () => showScreen('menu'));
  document.getElementById('btn-voltar-menu-2')?.addEventListener('click', () => showScreen('menu'));
  document.getElementById('btn-voltar-menu-3')?.addEventListener('click', () => showScreen('menu'));
}

function setupGameButtons() {
  // Botões do jogo
  document.getElementById('btn-finalizar')?.addEventListener('click', () => {
    endTurn();
  });
  
  document.getElementById('btn-atacar')?.addEventListener('click', () => {
    // Implementar ataque automático
    const state = toRender();
    if (state.playerCreatures.some(c => c)) {
      attack(0, 0); // Ataque simples
    }
  });
  
  // Configurar painel de mão
  const handPanel = document.getElementById('hand-panel');
  if (handPanel) {
    handPanel.addEventListener('click', (e) => {
      const cardElement = e.target.closest('.card-thumb');
      if (cardElement) {
        const index = parseInt(cardElement.dataset.index);
        if (!isNaN(index)) {
          playCardFromHand(index);
        }
      }
    });
  }
}

function showScreen(screenName) {
  // Esconder todas as telas
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('visible');
  });
  
  // Mostrar a tela selecionada
  const targetScreen = document.getElementById(`${screenName}-screen`);
  if (targetScreen) {
    targetScreen.classList.add('visible');
  }
}

function populateDeckBuilder() {
  // Implementar deck builder
  const catalog = document.getElementById('card-catalog');
  const deckGrid = document.getElementById('deck-grid');
  
  if (catalog && deckGrid) {
    // Limpar conteúdo anterior
    catalog.innerHTML = '';
    deckGrid.innerHTML = '';
    
    // Adicionar cartas ao catálogo
    const allCards = [
      ...gameState.cardDatabase.creatures,
      ...gameState.cardDatabase.spells,
      ...gameState.cardDatabase.traps,
      ...gameState.cardDatabase.fields
    ];
    
    allCards.forEach((card, index) => {
      const cardElement = createCardElement(card, index);
      catalog.appendChild(cardElement);
    });
  }
}

function createCardElement(card, index) {
  const div = document.createElement('div');
  div.className = `card-thumb rarity-${card.rarity.toLowerCase().replace(' ', '-')}`;
  div.dataset.index = index;
  
  div.innerHTML = `
    <div style="font-weight: 600;">${card.name}</div>
    <div class="pill attr-${card.attribute || ''}">${card.attribute || card.type}</div>
    <div style="font-size: 12px; color: #9aa0a6;">
      ${card.type === 'Creature' ? `Nível ${card.level} • ATK ${card.attack} / DEF ${card.defense}` : card.type}
    </div>
  `;
  
  return div;
}

// Função para renderizar a mão do jogador
function renderHand() {
  const handPanel = document.getElementById('hand-panel');
  if (!handPanel) return;
  
  handPanel.innerHTML = '';
  
  gameState.playerHand.forEach((card, index) => {
    const cardElement = createCardElement(card, index);
    handPanel.appendChild(cardElement);
  });
  
  // Atualizar contadores
  updateHUD();
}

function updateHUD() {
  // Atualizar pontos de vida
  const myLP = document.getElementById('my-lp');
  const opLP = document.getElementById('op-lp');
  if (myLP) myLP.textContent = gameState.playerLifePoints;
  if (opLP) opLP.textContent = gameState.enemyLifePoints;
  
  // Atualizar contagem de mão
  const myHandCount = document.getElementById('my-hand-count');
  const opHandCount = document.getElementById('op-hand-count');
  if (myHandCount) myHandCount.textContent = gameState.playerHand.length;
  if (opHandCount) opHandCount.textContent = gameState.enemyHand.length;
  
  // Atualizar indicadores de turno e fase
  const turnIndicator = document.getElementById('turn-indicator');
  const phaseIndicator = document.getElementById('phase-indicator');
  if (turnIndicator) turnIndicator.textContent = gameState.turn === 'player' ? 'Você' : 'Oponente';
  if (phaseIndicator) phaseIndicator.textContent = gameState.phase;
}

// Loop de renderização
function gameLoop() {
  if (document.getElementById('game-screen')?.classList.contains('visible')) {
    renderHand();
    ui.render(toRender());
  }
  requestAnimationFrame(gameLoop);
}

// Iniciar loop do jogo
gameLoop();

