export const ui = {
  logElement: null,
  canvas: null,
  ctx: null,

  init() {
    this.logElement = document.getElementById('game-log') || this.createLogElement();
    this.canvas = document.getElementById('game-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }
  },

  createLogElement() {
    const log = document.createElement('div');
    log.id = 'game-log';
    log.className = 'game-log';
    log.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 300px;
      max-height: 200px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 10px;
      border-radius: 8px;
      font-size: 12px;
      overflow-y: auto;
      z-index: 1000;
    `;
    document.body.appendChild(log);
    return log;
  },

  log(message) {
    if (this.logElement) {
      const entry = document.createElement('div');
      entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
      this.logElement.appendChild(entry);
      this.logElement.scrollTop = this.logElement.scrollHeight;
      
      // Limitar entradas
      while (this.logElement.children.length > 20) {
        this.logElement.removeChild(this.logElement.firstChild);
      }
    }
    console.log(message);
  },

  update(state) {
    // Atualizar HUD
    this.updateLifePoints(state.playerLifePoints, state.enemyLifePoints);
    this.updateHandCount(state.playerHand.length, state.enemyHand.length);
    this.updateTurnIndicator(state.turn, state.phase);
  },

  render(state) {
    if (!this.canvas || !this.ctx) return;
    
    this.clearCanvas();
    this.drawBoard();
    this.drawCards(state);
  },

  clearCanvas() {
    this.ctx.fillStyle = '#0b0d10';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },

  drawBoard() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Bordas do campo
    ctx.strokeStyle = '#2a2f36';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, w - 16, h - 16);
    
    // Linha central
    ctx.beginPath();
    ctx.moveTo(8, h / 2);
    ctx.lineTo(w - 8, h / 2);
    ctx.stroke();

    // Zonas do campo
    this.drawZones();
  },

  drawZones() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    const zoneWidth = (w - 16 - 60) / 5;
    const zoneHeight = 110;
    const topY = 40;
    const topBackY = topY + zoneHeight + 12;
    const bottomBackY = h - topY - zoneHeight - 12;
    const bottomY = h - topY - zoneHeight;

    // Zonas do oponente
    for (let i = 0; i < 5; i++) {
      const x = 30 + i * (zoneWidth + 6);
      this.drawZone(x, topY, `OP Criatura ${i + 1}`, null);
    }
    
    for (let i = 0; i < 3; i++) {
      const x = 60 + i * (zoneWidth + 6);
      this.drawZone(x, topBackY, `OP Magia/Armadilha ${i + 1}`, null);
    }
    
    this.drawZone(w - zoneWidth - 30, topBackY, 'OP Terreno', null);

    // Zonas do jogador
    for (let i = 0; i < 5; i++) {
      const x = 30 + i * (zoneWidth + 6);
      this.drawZone(x, bottomY, `Criatura ${i + 1}`, null);
    }
    
    for (let i = 0; i < 3; i++) {
      const x = 60 + i * (zoneWidth + 6);
      this.drawZone(x, bottomBackY, `Magia/Armadilha ${i + 1}`, null);
    }
    
    this.drawZone(w - zoneWidth - 30, bottomBackY, 'Seu Terreno', null);
  },

  drawZone(x, y, label, card) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const zoneWidth = (w - 16 - 60) / 5;
    const zoneHeight = 110;

    ctx.fillStyle = '#101316';
    ctx.strokeStyle = '#2a2f36';
    ctx.lineWidth = 1.5;
    ctx.fillRect(x, y, zoneWidth, zoneHeight);
    ctx.strokeRect(x, y, zoneWidth, zoneHeight);
    
    ctx.fillStyle = '#9aa0a6';
    ctx.font = '12px system-ui';
    ctx.fillText(label, x + 6, y + 14);
    
    if (card) {
      ctx.fillStyle = '#e8eaed';
      ctx.font = 'bold 12px system-ui';
      ctx.fillText(card.name, x + 6, y + 30);
      
      if (card.type === 'Creature') {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px system-ui';
        ctx.fillText(`Nível ${card.level} • ${card.attribute}`, x + 6, y + 46);
        ctx.fillText(`ATK ${card.attack} / DEF ${card.defense}`, x + 6, y + 62);
      } else if (card.type === 'Spell' || card.type === 'Trap') {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px system-ui';
        const subtype = card.spellType || card.trapType || card.type;
        ctx.fillText(subtype.toUpperCase(), x + 6, y + 46);
      } else if (card.type === 'Field') {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px system-ui';
        ctx.fillText('TERRENO', x + 6, y + 46);
      }
    }
  },

  drawCards(state) {
    // Desenhar criaturas do jogador
    state.playerCreatures.forEach((card, index) => {
      if (card) {
        const x = 30 + index * ((this.canvas.width - 16 - 60) / 5 + 6);
        const y = this.canvas.height - 40 - 110;
        this.drawZone(x, y, `Criatura ${index + 1}`, card);
      }
    });

    // Desenhar criaturas do oponente
    state.enemyCreatures.forEach((card, index) => {
      if (card) {
        const x = 30 + index * ((this.canvas.width - 16 - 60) / 5 + 6);
        const y = 40;
        this.drawZone(x, y, `OP Criatura ${index + 1}`, card);
      }
    });

    // Desenhar terreno do jogador
    if (state.playerFieldCard) {
      const x = this.canvas.width - ((this.canvas.width - 16 - 60) / 5) - 30;
      const y = this.canvas.height - 40 - 110 - 12 - 110;
      this.drawZone(x, y, 'Seu Terreno', state.playerFieldCard);
    }

    // Desenhar terreno do oponente
    if (state.enemyFieldCard) {
      const x = this.canvas.width - ((this.canvas.width - 16 - 60) / 5) - 30;
      const y = 40 + 110 + 12;
      this.drawZone(x, y, 'OP Terreno', state.enemyFieldCard);
    }
  },

  updateLifePoints(playerLP, enemyLP) {
    const myLP = document.getElementById('my-lp');
    const opLP = document.getElementById('op-lp');
    if (myLP) myLP.textContent = playerLP;
    if (opLP) opLP.textContent = enemyLP;
  },

  updateHandCount(playerHand, enemyHand) {
    const myHandCount = document.getElementById('my-hand-count');
    const opHandCount = document.getElementById('op-hand-count');
    if (myHandCount) myHandCount.textContent = playerHand;
    if (opHandCount) opHandCount.textContent = enemyHand;
  },

  updateTurnIndicator(turn, phase) {
    const turnIndicator = document.getElementById('turn-indicator');
    const phaseIndicator = document.getElementById('phase-indicator');
    if (turnIndicator) turnIndicator.textContent = turn === 'player' ? 'Você' : 'Oponente';
    if (phaseIndicator) phaseIndicator.textContent = phase;
  }
};