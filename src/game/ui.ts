export type RenderData = {
  playerLifePoints: number;
  enemyLifePoints: number;
  turn: 'player' | 'enemy';
  phase: 'Draw' | 'Main1' | 'Battle' | 'Main2' | 'End';
  normalSummonUsed: boolean;
  playerHand: Array<any>;
  playerCreatures: Array<any>;
  playerSpellsTraps: Array<any>;
  playerFieldCard: any | null;
  enemyCreatures: Array<any>;
  enemySpellsTraps: Array<any>;
  enemyFieldCard: any | null;
};

type Handlers = {
  onEndTurn: () => void;
  onAttack: () => void;
  onPlayFromHand: (index: number) => void;
  onNextPhase: () => void;
  onSelectTarget?: (zone: 'player' | 'enemy', row: 'creature' | 'spelltrap', index: number) => void;
};

export const ui = {
  playerLife: null as HTMLElement | null,
  enemyLife: null as HTMLElement | null,
  turnIndicator: null as HTMLElement | null,
  battleLog: null as HTMLElement | null,
  playerHandEl: null as HTMLElement | null,
  playerCreatureRow: null as HTMLElement | null,
  enemyCreatureRow: null as HTMLElement | null,
  playerSpellTrapRow: null as HTMLElement | null,
  enemySpellTrapRow: null as HTMLElement | null,
  playerFieldZone: null as HTMLElement | null,
  enemyFieldZone: null as HTMLElement | null,
  handlers: null as Handlers | null,
  selectingTarget: false,

  init() {
    this.playerLife = document.getElementById('playerLife');
    this.enemyLife = document.getElementById('enemyLife');
    this.turnIndicator = document.getElementById('turnIndicator');
    this.battleLog = document.getElementById('battleLog');
    this.playerHandEl = document.getElementById('playerHand');
    this.playerCreatureRow = document.getElementById('playerCreatures');
    this.enemyCreatureRow = document.getElementById('enemyCreatures');
    this.playerSpellTrapRow = document.getElementById('playerSpellsTraps');
    this.enemySpellTrapRow = document.getElementById('enemySpellsTraps');
    this.playerFieldZone = document.getElementById('playerFieldZone');
    this.enemyFieldZone = document.getElementById('enemyFieldZone');
  },

  bindHandlers(handlers: Handlers) {
    this.handlers = handlers;
    const endTurnBtn = document.getElementById('endTurnBtn');
    const attackBtn = document.getElementById('attackBtn');
    const nextPhaseBtn = document.getElementById('nextPhaseBtn');
    if (endTurnBtn) endTurnBtn.onclick = () => this.handlers?.onEndTurn();
    if (attackBtn) attackBtn.onclick = () => this.handlers?.onAttack();
    if (nextPhaseBtn) nextPhaseBtn.onclick = () => this.handlers?.onNextPhase();
  },

  update(data: RenderData) {
    if (!this.playerLife || !this.enemyLife || !this.turnIndicator) return;
    this.playerLife.textContent = String(data.playerLifePoints);
    this.enemyLife.textContent = String(data.enemyLifePoints);
    this.turnIndicator.textContent = `${data.turn === 'player' ? 'SEU TURNO' : 'TURNO INIMIGO'} • Fase: ${data.phase}${data.turn === 'player' ? (data.normalSummonUsed ? '' : ' • Invocação Normal disponível') : ''}`;
  },

  log(message: string) {
    if (!this.battleLog) return;
    const div = document.createElement('div');
    div.textContent = message;
    this.battleLog.prepend(div);
  },

  render(data: RenderData) {
    if (!this.enemyCreatureRow || !this.playerCreatureRow || !this.playerHandEl || !this.playerSpellTrapRow || !this.enemySpellTrapRow || !this.playerFieldZone || !this.enemyFieldZone) return;
    const renderSlot = (card: any, click?: () => void) => {
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
      if (click) div.onclick = () => click();
      return div;
    };

    // Enemy rows
    this.enemyFieldZone.innerHTML = '';
    this.enemyFieldZone.appendChild(renderSlot(data.enemyFieldCard));
    this.enemySpellTrapRow.innerHTML = '';
    data.enemySpellsTraps.forEach((card, i) => this.enemySpellTrapRow!.appendChild(renderSlot(card)));
    this.enemyCreatureRow.innerHTML = '';
    data.enemyCreatures.forEach((card, i) => this.enemyCreatureRow!.appendChild(renderSlot(card, () => {
      if (this.selectingTarget) this.handlers?.onSelectTarget?.('enemy', 'creature', i);
    })));

    // Player rows
    this.playerFieldZone.innerHTML = '';
    this.playerFieldZone.appendChild(renderSlot(data.playerFieldCard));
    this.playerSpellTrapRow.innerHTML = '';
    data.playerSpellsTraps.forEach((card, i) => this.playerSpellTrapRow!.appendChild(renderSlot(card, () => {
      if (this.selectingTarget) this.handlers?.onSelectTarget?.('player', 'spelltrap', i);
    })));
    this.playerCreatureRow.innerHTML = '';
    data.playerCreatures.forEach((card, i) => this.playerCreatureRow!.appendChild(renderSlot(card, () => {
      if (this.selectingTarget) this.handlers?.onSelectTarget?.('player', 'creature', i);
    })));

    // Render hand
    this.playerHandEl.innerHTML = '';
    data.playerHand.forEach((card, index) => {
      const btn = document.createElement('button');
      btn.className = 'hand-card';
      const extra = card.type === 'Creature' ? `⭐ ${card.level}` : card.type;
      btn.innerHTML = `${card.art || '🂠'} ${card.name} <span class="cost">${extra}</span>`;
      btn.disabled = !(data.turn === 'player');
      btn.onclick = () => this.handlers?.onPlayFromHand(index);
      this.playerHandEl!.appendChild(btn);
    });
  }
};