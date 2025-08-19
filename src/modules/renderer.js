export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hoveredZone = null;
  }

  clear() {
    const ctx = this.ctx;
    ctx.fillStyle = '#0b0d10';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBoard(state) {
    this.clear();
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Board split
    ctx.strokeStyle = '#2a2f36';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, w - 16, h - 16);
    ctx.beginPath();
    ctx.moveTo(8, h / 2);
    ctx.lineTo(w - 8, h / 2);
    ctx.stroke();

    // Zones layout constants
    const zoneWidth = (w - 16 - 60) / 5; // 5 creature zones
    const zoneHeight = 110;
    const topY = 40;
    const topBackY = topY + zoneHeight + 12;
    const bottomBackY = h - topY - zoneHeight - 12;
    const bottomY = h - topY - zoneHeight;

    // Helper draw zone
    const drawZone = (x, y, label, card) => {
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
        const display = `${card.name}`;
        ctx.fillText(display, x + 6, y + 30);
        if (card.type === 'creature') {
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '12px system-ui';
          ctx.fillText(`Nível ${card.level} • ${card.attribute}`, x + 6, y + 46);
          ctx.fillText(`ATK ${card.currentATK} / DEF ${card.currentDEF}`, x + 6, y + 62);
        } else if (card.type === 'spell' || card.type === 'trap') {
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '12px system-ui';
          ctx.fillText(`${card.subtype ? card.subtype : card.type}`.toUpperCase(), x + 6, y + 46);
        } else if (card.type === 'field') {
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '12px system-ui';
          ctx.fillText('TERRENO', x + 6, y + 46);
        }
      }
    };

    // Opponent zones
    for (let i = 0; i < 5; i++) {
      const x = 30 + i * (zoneWidth + 6);
      drawZone(x, topY, `OP Criatura ${i + 1}`, state.opponent.field.creatures[i]);
    }
    for (let i = 0; i < 3; i++) {
      const x = 60 + i * (zoneWidth + 6);
      drawZone(x, topBackY, `OP Magia/Armadilha ${i + 1}`, state.opponent.field.backrow[i]);
    }
    drawZone(w - zoneWidth - 30, topBackY, 'OP Terreno', state.opponent.field.fieldZone);

    // Player zones
    for (let i = 0; i < 5; i++) {
      const x = 30 + i * (zoneWidth + 6);
      drawZone(x, bottomY, `Criatura ${i + 1}`, state.player.field.creatures[i]);
    }
    for (let i = 0; i < 3; i++) {
      const x = 60 + i * (zoneWidth + 6);
      drawZone(x, bottomBackY, `Magia/Armadilha ${i + 1}`, state.player.field.backrow[i]);
    }
    drawZone(w - zoneWidth - 30, bottomBackY, 'Seu Terreno', state.player.field.fieldZone);
  }
}

