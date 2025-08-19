export type RenderData = {
  playerLifePoints: number;
  enemyLifePoints: number;
  playerMana: number;
  enemyMana: number;
  turn: 'player' | 'enemy';
  playerHand: Array<any>;
  playerField: Array<any>;
  enemyField: Array<any>;
};

type Handlers = {
  onEndTurn: () => void;
  onAttack: () => void;
  onPlayFromHand: (index: number) => void;
};

export const ui = {
  playerLife: null as HTMLElement | null,
  enemyLife: null as HTMLElement | null,
  playerMana: null as HTMLElement | null,
  enemyMana: null as HTMLElement | null,
  turnIndicator: null as HTMLElement | null,
  battleLog: null as HTMLElement | null,
  playerHandEl: null as HTMLElement | null,
  playerFieldEl: null as HTMLElement | null,
  enemyFieldEl: null as HTMLElement | null,
  handlers: null as Handlers | null,

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
  },

  bindHandlers(handlers: Handlers) {
    this.handlers = handlers;
    const endTurnBtn = document.getElementById('endTurnBtn');
    const attackBtn = document.getElementById('attackBtn');
    if (endTurnBtn) endTurnBtn.onclick = () => this.handlers?.onEndTurn();
    if (attackBtn) attackBtn.onclick = () => this.handlers?.onAttack();
  },

  update(data: RenderData) {
    if (!this.playerLife || !this.enemyLife || !this.playerMana || !this.enemyMana || !this.turnIndicator) return;
    this.playerLife.textContent = String(data.playerLifePoints);
    this.enemyLife.textContent = String(data.enemyLifePoints);
    this.playerMana.textContent = String(data.playerMana);
    this.enemyMana.textContent = String(data.enemyMana);
    this.turnIndicator.textContent = data.turn === 'player' ? 'SEU TURNO' : 'TURNO INIMIGO';
  },

  log(message: string) {
    if (!this.battleLog) return;
    const div = document.createElement('div');
    div.textContent = message;
    this.battleLog.prepend(div);
  },

  render(data: RenderData) {
    if (!this.enemyFieldEl || !this.playerFieldEl || !this.playerHandEl) return;
    const renderSlot = (card: any) => {
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
    data.enemyField.forEach(card => this.enemyFieldEl!.appendChild(renderSlot(card)));

    this.playerFieldEl.innerHTML = '';
    data.playerField.forEach(card => this.playerFieldEl!.appendChild(renderSlot(card)));

    this.playerHandEl.innerHTML = '';
    data.playerHand.forEach((card, index) => {
      const btn = document.createElement('button');
      btn.className = 'hand-card';
      btn.innerHTML = `${card.art || '🂠'} ${card.name} <span class="cost">💎 ${card.manaCost || 0}</span>`;
      btn.disabled = !(data.turn === 'player');
      btn.onclick = () => this.handlers?.onPlayFromHand(index);
      this.playerHandEl!.appendChild(btn);
    });
  }
};

