import { cardDatabase, AnyCard } from './cards';
import { ui } from './ui';

type Enhancements = Partial<{
  attack: number;
  defense: number;
  manaReduction: number;
  special: number;
}>;

type Customization = {
  enhancements: Enhancements;
  visuals: string[];
};

export const customizationSystem = {
  enhancementTypes: {
    attack: { name: 'Ataque', description: 'Aumenta o poder de ataque', icon: '⚔️', maxLevel: 5, cost: (l: number) => l * 100, effect: (l: number) => l * 200 },
    defense: { name: 'Defesa', description: 'Aumenta a defesa', icon: '🛡️', maxLevel: 5, cost: (l: number) => l * 100, effect: (l: number) => l * 150 },
    manaReduction: { name: 'Eficiência', description: 'Reduz custo de mana', icon: '💎', maxLevel: 3, cost: (l: number) => l * 200, effect: (l: number) => l },
    special: { name: 'Habilidade Especial', description: 'Adiciona efeitos únicos', icon: '✨', maxLevel: 1, cost: (_: number) => 500, effect: (l: number) => l }
  },

  visualCustomizations: {
    holographic: { name: 'Holográfico', description: 'Efeito visual brilhante', icon: '🌟', cost: 300, cssClass: 'holographic-effect' },
    animated: { name: 'Animado', description: 'Animação constante', icon: '🎭', cost: 250, cssClass: 'animated-card' },
    legendary: { name: 'Aura Lendária', description: 'Borda dourada especial', icon: '👑', cost: 500, cssClass: 'legendary-aura' }
  },

  playerCustomizations: new Map<string, Customization>(),
  selectedCard: null as AnyCard | null,
  currentCustomization: { enhancements: {}, visuals: [] } as Customization,

  init() {
    this.loadCustomizations();
    this.createCustomizationUI();
  },

  loadCustomizations() {
    const saved = localStorage.getItem('caete_customizations');
    if (saved) this.playerCustomizations = new Map(JSON.parse(saved));
  },

  saveCustomizations() {
    localStorage.setItem('caete_customizations', JSON.stringify(Array.from(this.playerCustomizations.entries())));
  },

  createCustomizationUI() {
    const customizationPanel = document.createElement('div');
    customizationPanel.id = 'customization-panel';
    customizationPanel.className = 'customization-panel hidden';
    customizationPanel.innerHTML = `
      <div class="customization-header">
        <h2>🎨 Personalização de Cartas</h2>
        <button id="close-customization" class="close-btn">✕</button>
      </div>
      <div class="customization-content">
        <div class="card-selection">
          <h3>Selecione uma Carta:</h3>
          <div id="card-list" class="card-grid"></div>
        </div>
        <div class="customization-options">
          <div class="enhancement-section">
            <h3>⚡ Melhorias</h3>
            <div id="enhancement-options"></div>
          </div>
          <div class="visual-section">
            <h3>🎨 Visuais</h3>
            <div id="visual-options"></div>
          </div>
          <div class="preview-section">
            <h3>👀 Prévia</h3>
            <div id="card-preview"></div>
          </div>
        </div>
      </div>
      <div class="customization-footer">
        <div class="currency">💰 Moedas: <span id="player-currency">1000</span></div>
        <button id="apply-customization" class="apply-btn">Aplicar Mudanças</button>
      </div>`;

    document.body.appendChild(customizationPanel);
    const currencyEl = document.getElementById('player-currency');
    if (currencyEl) currencyEl.textContent = this.getPlayerCurrency().toString();
    this.bindCustomizationEvents();
    this.populateCardList();
  },

  bindCustomizationEvents() {
    const closeBtn = document.getElementById('close-customization');
    const applyBtn = document.getElementById('apply-customization');
    if (closeBtn) closeBtn.onclick = () => this.hideCustomizationPanel();
    if (applyBtn) applyBtn.onclick = () => this.applyCustomization();
  },

  showCustomizationPanel() {
    document.getElementById('customization-panel')?.classList.remove('hidden');
    this.populateCardList();
  },

  hideCustomizationPanel() {
    document.getElementById('customization-panel')?.classList.add('hidden');
  },

  populateCardList() {
    const cardList = document.getElementById('card-list');
    if (!cardList) return;
    cardList.innerHTML = '';
    [...cardDatabase.monsters, ...cardDatabase.spells].forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'customizable-card';
      cardElement.innerHTML = `
        <div class="card-art">${card.art}</div>
        <div class="card-name">${card.name}</div>
        <div class="card-stats">
          ${'attack' in card ? `ATK: ${card.attack}` : ''}
          ${'defense' in card ? `DEF: ${card.defense}` : ''}
        </div>`;
      cardElement.onclick = (e) => this.selectCard(card, e);
      cardList.appendChild(cardElement);
    });
  },

  selectCard(card: AnyCard, ev: MouseEvent) {
    this.selectedCard = card;
    this.currentCustomization = this.playerCustomizations.get(card.id) || { enhancements: {}, visuals: [] };
    document.querySelectorAll('.customizable-card').forEach(el => el.classList.remove('selected'));
    (ev.target as HTMLElement)?.closest('.customizable-card')?.classList.add('selected');
    this.populateEnhancementOptions();
    this.populateVisualOptions();
    this.updatePreview();
  },

  populateEnhancementOptions() {
    const enhancementOptions = document.getElementById('enhancement-options');
    if (!enhancementOptions) return;
    enhancementOptions.innerHTML = '';
    Object.entries(this.enhancementTypes).forEach(([type, enhancement]) => {
      const currentLevel = (this.currentCustomization.enhancements as any)[type] || 0;
      const nextLevel = currentLevel + 1;
      const canUpgrade = nextLevel <= (enhancement as any).maxLevel;
      const cost = canUpgrade ? (enhancement as any).cost(nextLevel) : 0;
      const el = document.createElement('div');
      el.className = 'enhancement-option';
      el.innerHTML = `
        <div class="enhancement-info">
          <span class="enhancement-icon">${(enhancement as any).icon}</span>
          <div class="enhancement-details">
            <div class="enhancement-name">${(enhancement as any).name}</div>
            <div class="enhancement-description">${(enhancement as any).description}</div>
            <div class="enhancement-level">Nível: ${currentLevel}/${(enhancement as any).maxLevel}</div>
          </div>
        </div>
        <button class="upgrade-btn ${!canUpgrade ? 'disabled' : ''}" ${!canUpgrade ? 'disabled' : ''} data-type="${type}" data-cost="${cost}">
          ${canUpgrade ? `Melhorar (${cost} 💰)` : 'Máximo'}
        </button>`;
      el.querySelector('.upgrade-btn')!.addEventListener('click', () => {
        if (canUpgrade) this.upgradeEnhancement(type as keyof Enhancements, cost);
      });
      enhancementOptions.appendChild(el);
    });
  },

  populateVisualOptions() {
    const visualOptions = document.getElementById('visual-options');
    if (!visualOptions) return;
    visualOptions.innerHTML = '';
    Object.entries(this.visualCustomizations).forEach(([type, visual]) => {
      const isOwned = this.currentCustomization.visuals.includes(type);
      const el = document.createElement('div');
      el.className = 'visual-option';
      el.innerHTML = `
        <div class="visual-info">
          <span class="visual-icon">${visual.icon}</span>
          <div class="visual-details">
            <div class="visual-name">${visual.name}</div>
            <div class="visual-description">${visual.description}</div>
          </div>
        </div>
        <button class="visual-btn ${isOwned ? 'owned' : ''}" data-type="${type}" data-cost="${visual.cost}">
          ${isOwned ? 'Possuído ✓' : `Comprar (${visual.cost} 💰)`}
        </button>`;
      el.querySelector('.visual-btn')!.addEventListener('click', () => {
        if (!isOwned) this.purchaseVisual(type, visual.cost);
      });
      visualOptions.appendChild(el);
    });
  },

  upgradeEnhancement(type: keyof Enhancements, cost: number) {
    const playerCurrency = this.getPlayerCurrency();
    if (playerCurrency < cost) return ui.log('💰 Moedas insuficientes!');
    const current = this.currentCustomization.enhancements[type] || 0;
    this.currentCustomization.enhancements[type] = current + 1;
    this.spendCurrency(cost);
    this.populateEnhancementOptions();
    this.updatePreview();
    ui.log(`🔧 ${(this.enhancementTypes as any)[type].name} melhorado!`);
  },

  purchaseVisual(type: string, cost: number) {
    const playerCurrency = this.getPlayerCurrency();
    if (playerCurrency < cost) return ui.log('💰 Moedas insuficientes!');
    if (!this.currentCustomization.visuals.includes(type)) this.currentCustomization.visuals.push(type);
    this.spendCurrency(cost);
    this.populateVisualOptions();
    this.updatePreview();
    ui.log(`🎨 ${(this.visualCustomizations as any)[type].name} adquirido!`);
  },

  updatePreview() {
    if (!this.selectedCard) return;
    const preview = document.getElementById('card-preview');
    if (!preview) return;
    const customizedCard = this.getCustomizedCard(this.selectedCard);
    let visualClasses = '';
    this.currentCustomization.visuals.forEach(visual => {
      visualClasses += ` ${(this.visualCustomizations as any)[visual].cssClass}`;
    });
    preview.innerHTML = `
      <div class="preview-card ${visualClasses}">
        <div class="card-header">
          <div class="card-name">${customizedCard.name}</div>
          <div class="card-cost">💎 ${customizedCard.manaCost}</div>
        </div>
        <div class="card-art-large">${customizedCard.art}</div>
        <div class="card-type">${customizedCard.type} - ${customizedCard.element}</div>
        ${'attack' in customizedCard ? `
          <div class="card-stats-preview">
            <div class="stat">ATK: ${(customizedCard as any).attack}</div>
            <div class="stat">DEF: ${(customizedCard as any).defense}</div>
          </div>
        ` : ''}
        <div class="card-effects">${this.getEnhancementDescriptions()}</div>
      </div>`;
  },

  getEnhancementDescriptions() {
    const descriptions: string[] = [];
    Object.entries(this.currentCustomization.enhancements).forEach(([type, level]) => {
      if ((level || 0) > 0) descriptions.push(`${(this.enhancementTypes as any)[type].icon} ${(this.enhancementTypes as any)[type].name} +${level}`);
    });
    return descriptions.length > 0 ? `<div class="enhancements">${descriptions.join('<br>')}</div>` : '';
  },

  applyCustomization() {
    if (!this.selectedCard) return;
    this.playerCustomizations.set(this.selectedCard.id, { ...this.currentCustomization });
    this.saveCustomizations();
    ui.log(`✅ Personalização aplicada em ${this.selectedCard.name}!`);
    this.hideCustomizationPanel();
  },

  getCustomizedCard(baseCard: AnyCard): AnyCard {
    const customization = this.playerCustomizations.get(baseCard.id);
    if (!customization) return { ...baseCard } as AnyCard;
    const customizedCard: any = { ...baseCard };
    if (customization.enhancements.attack && 'attack' in customizedCard) customizedCard.attack += this.enhancementTypes.attack.effect(customization.enhancements.attack);
    if (customization.enhancements.defense && 'defense' in customizedCard) customizedCard.defense += this.enhancementTypes.defense.effect(customization.enhancements.defense);
    if (customization.enhancements.manaReduction) customizedCard.manaCost = Math.max(1, customizedCard.manaCost - this.enhancementTypes.manaReduction.effect(customization.enhancements.manaReduction));
    return customizedCard as AnyCard;
  },

  getPlayerCurrency() {
    return parseInt(localStorage.getItem('caete_currency') || '1000');
  },
  spendCurrency(amount: number) {
    const current = this.getPlayerCurrency();
    localStorage.setItem('caete_currency', String(current - amount));
    const el = document.getElementById('player-currency');
    if (el) el.textContent = String(current - amount);
  },
  addCurrency(amount: number) {
    const current = this.getPlayerCurrency();
    localStorage.setItem('caete_currency', String(current + amount));
    const el = document.getElementById('player-currency');
    if (el) el.textContent = String(current + amount);
  }
};

