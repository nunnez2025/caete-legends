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
