export const ui = {
  playerLife: null,
  enemyLife: null,
  playerMana: null,
  enemyMana: null,
  turnIndicator: null,
  battleLog: null,
  playerHandEl: null,
  playerFieldEl: null,
  enemyFieldEl: null,
  onEndTurn: null,
  onAttack: null,
  onPlayFromHand: null,

  init() {
    this.playerLife = document.getElementById('playerLife');
    this.enemyLife = document.getElementById('enemyLife');
    this.playerMana = document.getElementById('playerMana');
    this.enemyMana = document.getElementById('enemyMana');
    this.turnIndicator = document.getElementById('turnIndicator');
    this.battleLog = document.getElementById('battleLog');
    this.playerHandEl = document.getElementById('playerHand');
    this.playerFieldEl = document.getElementById('playerField');
    this.enemyFieldEl = document.getElementById('enemyField');
    
    // Add customization button to UI
    this.addCustomizationButton();
  },

  bindHandlers(handlers) {
    this.onEndTurn = handlers.onEndTurn;
    this.onAttack = handlers.onAttack;
    this.onPlayFromHand = handlers.onPlayFromHand;

    const endTurnBtn = document.getElementById('endTurnBtn');
    const attackBtn = document.getElementById('attackBtn');
    if (endTurnBtn) endTurnBtn.onclick = () => this.onEndTurn && this.onEndTurn();
    if (attackBtn) attackBtn.onclick = () => this.onAttack && this.onAttack();
  },

  addCustomizationButton() {
    const gameUI = document.getElementById('game-ui');
    const customizationBtn = document.createElement('button');
    customizationBtn.id = 'customization-btn';
    customizationBtn.innerHTML = '🎨 Personalizar Cartas';
    customizationBtn.className = 'customization-trigger-btn';
    customizationBtn.onclick = () => {
      // Import and show customization panel
      import('./customization.js').then(module => {
        module.customizationSystem.showCustomizationPanel();
      });
    };
    
    gameUI.appendChild(customizationBtn);
  },

  update(data) {
    this.playerLife.textContent = data.playerLifePoints;
    this.enemyLife.textContent = data.enemyLifePoints;
    this.playerMana.textContent = data.playerMana;
    this.enemyMana.textContent = data.enemyMana;
    this.turnIndicator.textContent = data.turn === 'player' ? 'SEU TURNO' : 'TURNO INIMIGO';
  },

  log(message) {
    const div = document.createElement('div');
    div.textContent = message;
    this.battleLog.prepend(div);
  },

  render(data) {
    // Render fields
    const renderSlot = (card) => {
      const div = document.createElement('div');
      div.className = `slot ${card ? 'filled' : 'empty'}`;
      if (card) {
        div.innerHTML = `
          <div class="card">
            <div class="art">${card.art || '🂠'}</div>
            <div class="name">${card.name}</div>
            ${card.attack ? `<div class="stats">ATK ${card.attack}</div>` : ''}
          </div>
        `;
      }
      return div;
    };

    this.enemyFieldEl.innerHTML = '';
    data.enemyField.forEach(card => this.enemyFieldEl.appendChild(renderSlot(card)));

    this.playerFieldEl.innerHTML = '';
    data.playerField.forEach(card => this.playerFieldEl.appendChild(renderSlot(card)));

    // Render hand
    this.playerHandEl.innerHTML = '';
    data.playerHand.forEach((card, index) => {
      const btn = document.createElement('button');
      btn.className = 'hand-card';
      btn.innerHTML = `${card.art || '🂠'} ${card.name} <span class="cost">💎 ${card.manaCost || 0}</span>`;
      btn.disabled = !(data.turn === 'player');
      btn.onclick = () => {
        if (this.onPlayFromHand) this.onPlayFromHand(index);
      };
      this.playerHandEl.appendChild(btn);
    });
  }
};