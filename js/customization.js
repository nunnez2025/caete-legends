import { cardDatabase } from './cards.js';
import { ui } from './ui.js';

export const customizationSystem = {
  // Available enhancement types
  enhancementTypes: {
    attack: {
      name: 'Ataque',
      description: 'Aumenta o poder de ataque',
      icon: '⚔️',
      maxLevel: 5,
      cost: (level) => level * 100,
      effect: (level) => level * 200
    },
    defense: {
      name: 'Defesa',
      description: 'Aumenta a defesa',
      icon: '🛡️',
      maxLevel: 5,
      cost: (level) => level * 100,
      effect: (level) => level * 150
    },
    manaReduction: {
      name: 'Eficiência',
      description: 'Reduz custo de mana',
      icon: '💎',
      maxLevel: 3,
      cost: (level) => level * 200,
      effect: (level) => level
    },
    special: {
      name: 'Habilidade Especial',
      description: 'Adiciona efeitos únicos',
      icon: '✨',
      maxLevel: 1,
      cost: (level) => 500,
      effect: (level) => level
    }
  },

  // Visual customizations
  visualCustomizations: {
    holographic: {
      name: 'Holográfico',
      description: 'Efeito visual brilhante',
      icon: '🌟',
      cost: 300,
      cssClass: 'holographic-effect'
    },
    animated: {
      name: 'Animado',
      description: 'Animação constante',
      icon: '🎭',
      cost: 250,
      cssClass: 'animated-card'
    },
    legendary: {
      name: 'Aura Lendária',
      description: 'Borda dourada especial',
      icon: '👑',
      cost: 500,
      cssClass: 'legendary-aura'
    }
  },

  // Player's customized cards storage
  playerCustomizations: new Map(),

  // Initialize customization system
  init() {
    this.loadCustomizations();
    this.createCustomizationUI();
  },

  // Load saved customizations
  loadCustomizations() {
    const saved = localStorage.getItem('caete_customizations');
    if (saved) {
      const data = JSON.parse(saved);
      this.playerCustomizations = new Map(data);
    }
  },

  // Save customizations
  saveCustomizations() {
    const data = Array.from(this.playerCustomizations.entries());
    localStorage.setItem('caete_customizations', JSON.stringify(data));
  },

  // Create customization UI
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
      </div>
    `;

    document.body.appendChild(customizationPanel);
    this.bindCustomizationEvents();
    this.populateCardList();
  },

  // Bind event listeners
  bindCustomizationEvents() {
    document.getElementById('close-customization').onclick = () => {
      this.hideCustomizationPanel();
    };

    document.getElementById('apply-customization').onclick = () => {
      this.applyCustomization();
    };
  },

  // Show customization panel
  showCustomizationPanel() {
    document.getElementById('customization-panel').classList.remove('hidden');
    this.populateCardList();
  },

  // Hide customization panel
  hideCustomizationPanel() {
    document.getElementById('customization-panel').classList.add('hidden');
  },

  // Populate card list
  populateCardList() {
    const cardList = document.getElementById('card-list');
    cardList.innerHTML = '';

    [...cardDatabase.monsters, ...cardDatabase.spells].forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'customizable-card';
      cardElement.innerHTML = `
        <div class="card-art">${card.art}</div>
        <div class="card-name">${card.name}</div>
        <div class="card-stats">
          ${card.attack ? `ATK: ${card.attack}` : ''}
          ${card.defense ? `DEF: ${card.defense}` : ''}
        </div>
      `;
      
      cardElement.onclick = () => this.selectCard(card);
      cardList.appendChild(cardElement);
    });
  },

  // Select card for customization
  selectCard(card) {
    this.selectedCard = card;
    this.currentCustomization = this.playerCustomizations.get(card.id) || {
      enhancements: {},
      visuals: []
    };

    // Highlight selected card
    document.querySelectorAll('.customizable-card').forEach(el => {
      el.classList.remove('selected');
    });
    event.target.closest('.customizable-card').classList.add('selected');

    this.populateEnhancementOptions();
    this.populateVisualOptions();
    this.updatePreview();
  },

  // Populate enhancement options
  populateEnhancementOptions() {
    const enhancementOptions = document.getElementById('enhancement-options');
    enhancementOptions.innerHTML = '';

    Object.entries(this.enhancementTypes).forEach(([type, enhancement]) => {
      const currentLevel = this.currentCustomization.enhancements[type] || 0;
      const nextLevel = currentLevel + 1;
      const canUpgrade = nextLevel <= enhancement.maxLevel;
      const cost = canUpgrade ? enhancement.cost(nextLevel) : 0;

      const enhancementElement = document.createElement('div');
      enhancementElement.className = 'enhancement-option';
      enhancementElement.innerHTML = `
        <div class="enhancement-info">
          <span class="enhancement-icon">${enhancement.icon}</span>
          <div class="enhancement-details">
            <div class="enhancement-name">${enhancement.name}</div>
            <div class="enhancement-description">${enhancement.description}</div>
            <div class="enhancement-level">Nível: ${currentLevel}/${enhancement.maxLevel}</div>
          </div>
        </div>
        <button class="upgrade-btn ${!canUpgrade ? 'disabled' : ''}" 
                ${!canUpgrade ? 'disabled' : ''} 
                data-type="${type}" 
                data-cost="${cost}">
          ${canUpgrade ? `Melhorar (${cost} 💰)` : 'Máximo'}
        </button>
      `;

      enhancementElement.querySelector('.upgrade-btn').onclick = (e) => {
        if (!e.target.disabled) {
          this.upgradeEnhancement(type, cost);
        }
      };

      enhancementOptions.appendChild(enhancementElement);
    });
  },

  // Populate visual options
  populateVisualOptions() {
    const visualOptions = document.getElementById('visual-options');
    visualOptions.innerHTML = '';

    Object.entries(this.visualCustomizations).forEach(([type, visual]) => {
      const isOwned = this.currentCustomization.visuals.includes(type);

      const visualElement = document.createElement('div');
      visualElement.className = 'visual-option';
      visualElement.innerHTML = `
        <div class="visual-info">
          <span class="visual-icon">${visual.icon}</span>
          <div class="visual-details">
            <div class="visual-name">${visual.name}</div>
            <div class="visual-description">${visual.description}</div>
          </div>
        </div>
        <button class="visual-btn ${isOwned ? 'owned' : ''}" 
                data-type="${type}" 
                data-cost="${visual.cost}">
          ${isOwned ? 'Possuído ✓' : `Comprar (${visual.cost} 💰)`}
        </button>
      `;

      visualElement.querySelector('.visual-btn').onclick = (e) => {
        if (!isOwned) {
          this.purchaseVisual(type, visual.cost);
        }
      };

      visualOptions.appendChild(visualElement);
    });
  },

  // Upgrade enhancement
  upgradeEnhancement(type, cost) {
    const playerCurrency = this.getPlayerCurrency();
    if (playerCurrency >= cost) {
      this.currentCustomization.enhancements[type] = 
        (this.currentCustomization.enhancements[type] || 0) + 1;
      
      this.spendCurrency(cost);
      this.populateEnhancementOptions();
      this.updatePreview();
      
      ui.log(`🔧 ${this.enhancementTypes[type].name} melhorado!`);
    } else {
      ui.log('💰 Moedas insuficientes!');
    }
  },

  // Purchase visual customization
  purchaseVisual(type, cost) {
    const playerCurrency = this.getPlayerCurrency();
    if (playerCurrency >= cost) {
      if (!this.currentCustomization.visuals.includes(type)) {
        this.currentCustomization.visuals.push(type);
      }
      
      this.spendCurrency(cost);
      this.populateVisualOptions();
      this.updatePreview();
      
      ui.log(`🎨 ${this.visualCustomizations[type].name} adquirido!`);
    } else {
      ui.log('💰 Moedas insuficientes!');
    }
  },

  // Update card preview
  updatePreview() {
    if (!this.selectedCard) return;

    const preview = document.getElementById('card-preview');
    const customizedCard = this.getCustomizedCard(this.selectedCard);
    
    let visualClasses = '';
    this.currentCustomization.visuals.forEach(visual => {
      visualClasses += ` ${this.visualCustomizations[visual].cssClass}`;
    });

    preview.innerHTML = `
      <div class="preview-card ${visualClasses}">
        <div class="card-header">
          <div class="card-name">${customizedCard.name}</div>
          <div class="card-cost">💎 ${customizedCard.manaCost}</div>
        </div>
        <div class="card-art-large">${customizedCard.art}</div>
        <div class="card-type">${customizedCard.type} - ${customizedCard.element}</div>
        ${customizedCard.attack ? `
          <div class="card-stats-preview">
            <div class="stat">ATK: ${customizedCard.attack}</div>
            <div class="stat">DEF: ${customizedCard.defense}</div>
          </div>
        ` : ''}
        <div class="card-effects">
          ${this.getEnhancementDescriptions()}
        </div>
      </div>
    `;
  },

  // Get enhancement descriptions
  getEnhancementDescriptions() {
    let descriptions = [];
    
    Object.entries(this.currentCustomization.enhancements).forEach(([type, level]) => {
      if (level > 0) {
        const enhancement = this.enhancementTypes[type];
        descriptions.push(`${enhancement.icon} ${enhancement.name} +${level}`);
      }
    });

    return descriptions.length > 0 ? 
      `<div class="enhancements">${descriptions.join('<br>')}</div>` : 
      '';
  },

  // Apply customization
  applyCustomization() {
    if (!this.selectedCard) return;

    this.playerCustomizations.set(this.selectedCard.id, { ...this.currentCustomization });
    this.saveCustomizations();
    
    ui.log(`✅ Personalização aplicada em ${this.selectedCard.name}!`);
    this.hideCustomizationPanel();
  },

  // Get customized card with applied enhancements
  getCustomizedCard(baseCard) {
    const customization = this.playerCustomizations.get(baseCard.id);
    if (!customization) return { ...baseCard };

    const customizedCard = { ...baseCard };

    // Apply enhancements
    if (customization.enhancements.attack) {
      customizedCard.attack += this.enhancementTypes.attack.effect(customization.enhancements.attack);
    }
    if (customization.enhancements.defense) {
      customizedCard.defense += this.enhancementTypes.defense.effect(customization.enhancements.defense);
    }
    if (customization.enhancements.manaReduction) {
      customizedCard.manaCost = Math.max(1, 
        customizedCard.manaCost - this.enhancementTypes.manaReduction.effect(customization.enhancements.manaReduction)
      );
    }

    return customizedCard;
  },

  // Currency management
  getPlayerCurrency() {
    return parseInt(localStorage.getItem('caete_currency') || '1000');
  },

  spendCurrency(amount) {
    const current = this.getPlayerCurrency();
    localStorage.setItem('caete_currency', (current - amount).toString());
    document.getElementById('player-currency').textContent = (current - amount).toString();
  },

  addCurrency(amount) {
    const current = this.getPlayerCurrency();
    localStorage.setItem('caete_currency', (current + amount).toString());
    document.getElementById('player-currency').textContent = (current + amount).toString();
  }
};