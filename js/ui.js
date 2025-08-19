export const ui = {
  playerLife: null,
  enemyLife: null,
  playerMana: null,
  enemyMana: null,
  turnIndicator: null,
  battleLog: null,

  init() {
    this.playerLife = document.getElementById('playerLife');
    this.enemyLife = document.getElementById('enemyLife');
    this.playerMana = document.getElementById('playerMana');
    this.enemyMana = document.getElementById('enemyMana');
    this.turnIndicator = document.getElementById('turnIndicator');
    this.battleLog = document.getElementById('battleLog');
    
    // Add customization button to UI
    this.addCustomizationButton();
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
  }
};