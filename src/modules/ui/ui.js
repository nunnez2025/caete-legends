import { CardDatabase } from '../cards/database.js';
import { getAvailableActions } from '../rules/engine.js';

export function attachUI({ game, renderer }) {
  const screens = {
    menu: document.getElementById('menu-screen'),
    game: document.getElementById('game-screen'),
    deck: document.getElementById('deckbuilder-screen'),
    campaign: document.getElementById('campaign-screen'),
  };

  function showScreen(which) {
    for (const key of Object.keys(screens)) screens[key].classList.remove('visible');
    screens[which].classList.add('visible');
  }

  document.getElementById('btn-iniciar-rapido').addEventListener('click', () => {
    const playerDeck = window.localStorage.getItem('lendas_active_deck_v1')
      ? JSON.parse(window.localStorage.getItem('lendas_decks_v1'))[window.localStorage.getItem('lendas_active_deck_v1')]
      : CardDatabase.getStarterDeck();
    const opponentDeck = CardDatabase.getStarterDeckAI();
    game.startDuel(playerDeck, opponentDeck);
    showScreen('game');
  });

  document.getElementById('btn-abrir-deckbuilder').addEventListener('click', () => {
    populateDeckBuilder();
    showScreen('deck');
  });

  document.getElementById('btn-voltar-menu').addEventListener('click', () => showScreen('menu'));
  document.getElementById('btn-voltar-menu-2').addEventListener('click', () => showScreen('menu'));
  document.getElementById('btn-voltar-menu-3').addEventListener('click', () => showScreen('menu'));

  // Simple button bindings for phases
  document.getElementById('btn-finalizar').addEventListener('click', () => game.dispatch({ type: 'ADVANCE_PHASE' }));
  document.getElementById('btn-atacar').addEventListener('click', () => {
    // Try a sensible attack automatically
    const actions = getAvailableActions(game.getPublicBoardState());
    const attack = actions.find(a => a.type === 'ATTACK' && a.direct) || actions.find(a => a.type === 'ATTACK');
    if (attack) game.dispatch(attack);
  });

  // Hand rendering basic
  const handPanel = document.getElementById('hand-panel');

  function renderHand() {
    const state = game.getPublicBoardState();
    const hand = state.player.hand;
    handPanel.innerHTML = '';
    hand.forEach((card, idx) => {
      const el = document.createElement('div');
      el.className = `card-thumb rarity-${rarityClass(card.rarity)}`;
      el.innerHTML = `
        <div style="font-weight:600">${card.name}</div>
        <div class="pill attr-${card.attribute || ''}">${(card.attribute || card.type)}</div>
        <div style="font-size:12px; color:#9aa0a6">${card.type === 'creature' ? `Nível ${card.level} • ATK ${card.currentATK} / DEF ${card.currentDEF}` : (card.subtype || card.type)}</div>
      `;
      el.addEventListener('click', () => onHandCardClick(idx));
      el.addEventListener('contextmenu', (e) => { e.preventDefault(); openCardDialog(card, () => onHandCardClick(idx)); });
      handPanel.appendChild(el);
    });
    updateHUD();
    requestAnimationFrame(() => renderer.drawBoard(game.getPublicBoardState()));
  }

  function updateHUD() {
    const s = game.getPublicBoardState();
    document.getElementById('my-lp').textContent = s.player.lifePoints;
    document.getElementById('op-lp').textContent = s.opponent.lifePoints;
    document.getElementById('my-hand-count').textContent = s.player.hand.length;
    document.getElementById('op-hand-count').textContent = s.opponent.hand.length;
    document.getElementById('turn-indicator').textContent = s.currentPlayer === 'Player' ? 'Você' : 'Oponente';
    document.getElementById('phase-indicator').textContent = s.phase;
  }

  function onHandCardClick(idx) {
    const s = game.getPublicBoardState();
    const card = s.player.hand[idx];
    if (!card) return;
    if (card.type === 'creature') {
      game.dispatch({ type: 'SUMMON_FROM_HAND', handIndex: idx, tributes: [] });
    } else if (card.type === 'spell' || card.type === 'field') {
      game.dispatch({ type: 'ACTIVATE_SPELL_FROM_HAND', handIndex: idx });
    } else if (card.type === 'trap') {
      game.dispatch({ type: 'SET_TRAP_FROM_HAND', handIndex: idx });
    }
    renderHand();
  }

  function openCardDialog(card, onPlay) {
    const dlg = document.getElementById('card-dialog');
    document.getElementById('dialog-card-name').textContent = card.name;
    document.getElementById('dialog-card-meta').textContent = metaText(card);
    document.getElementById('dialog-card-text').textContent = card.text || '';
    const btnPlay = document.getElementById('dialog-play-card');
    btnPlay.onclick = () => { onPlay && onPlay(); dlg.close(); };
    document.getElementById('dialog-cancel').onclick = () => dlg.close();
    dlg.showModal();
  }

  function rarityClass(r) {
    if (!r) return 'common';
    const v = r.toLowerCase();
    if (v.includes('ultra')) return 'ultra';
    if (v.includes('super')) return 'super';
    if (v.includes('rara') || v.includes('rare')) return 'rare';
    return 'common';
  }

  function metaText(card) {
    if (card.type === 'creature') return `${card.attribute} • Nível ${card.level} • ATK ${card.currentATK} / DEF ${card.currentDEF}`;
    if (card.type === 'spell') return `Magia ${card.subtype || ''}`;
    if (card.type === 'trap') return `Armadilha ${card.subtype || ''}`;
    if (card.type === 'field') return 'Terreno';
    return card.type;
  }

  // Deckbuilder
  function populateDeckBuilder() {
    const catalog = document.getElementById('card-catalog');
    const deckGrid = document.getElementById('deck-grid');
    const deckCount = document.getElementById('deck-count');
    const savedSelect = document.getElementById('saved-decks');
    const deckName = document.getElementById('deck-name');

    const all = CardDatabase.listAll();
    catalog.innerHTML = '';
    deckGrid.innerHTML = '';

    let working = [];
    function renderDeck() {
      deckGrid.innerHTML = '';
      deckCount.textContent = working.length;
      working.forEach((id, i) => {
        const c = CardDatabase.getCardById(id);
        const el = document.createElement('div');
        el.className = 'card-thumb';
        el.innerHTML = `<div style="font-weight:600">${c.name}</div><div class="pill">${c.type}</div>`;
        el.addEventListener('click', () => { working.splice(i, 1); renderDeck(); });
        deckGrid.appendChild(el);
      });
    }

    const search = document.getElementById('filter-search');
    const typeSel = document.getElementById('filter-type');
    const attrSel = document.getElementById('filter-attribute');

    function renderCatalog() {
      const term = (search.value || '').toLowerCase();
      const type = typeSel.value;
      const attr = attrSel.value;
      catalog.innerHTML = '';
      for (const c of all) {
        if (type && c.type !== (type === 'field' ? 'field' : type)) continue;
        if (attr && c.attribute !== attr) continue;
        if (term && !(c.name.toLowerCase().includes(term) || (c.text||'').toLowerCase().includes(term))) continue;
        const el = document.createElement('div');
        el.className = `card-thumb rarity-${rarityClass(c.rarity)}`;
        el.innerHTML = `
          <div style="font-weight:600">${c.name}</div>
          <div class="pill">${c.type}${c.attribute ? ' • ' + c.attribute : ''}</div>
        `;
        el.addEventListener('click', () => { if (working.length < 60) { working.push(c.id); renderDeck(); } });
        catalog.appendChild(el);
      }
    }

    document.getElementById('btn-salvar-deck').onclick = () => {
      const name = deckName.value || 'Meu Deck';
      const allDecks = JSON.parse(localStorage.getItem('lendas_decks_v1') || '{}');
      allDecks[name] = working;
      localStorage.setItem('lendas_decks_v1', JSON.stringify(allDecks));
      refreshSaved();
    };
    document.getElementById('btn-usar-deck').onclick = () => {
      const name = savedSelect.value || deckName.value || 'Meu Deck';
      localStorage.setItem('lendas_active_deck_v1', name);
      renderHand();
    };
    document.getElementById('btn-excluir-deck').onclick = () => {
      const name = savedSelect.value;
      if (!name) return;
      const allDecks = JSON.parse(localStorage.getItem('lendas_decks_v1') || '{}');
      delete allDecks[name];
      localStorage.setItem('lendas_decks_v1', JSON.stringify(allDecks));
      refreshSaved();
    };

    function refreshSaved() {
      savedSelect.innerHTML = '';
      const allDecks = JSON.parse(localStorage.getItem('lendas_decks_v1') || '{}');
      for (const name of Object.keys(allDecks)) {
        const opt = document.createElement('option');
        opt.value = name; opt.textContent = name; savedSelect.appendChild(opt);
      }
    }

    refreshSaved();
    renderCatalog();
    renderDeck();
    search.oninput = renderCatalog;
    typeSel.onchange = renderCatalog;
    attrSel.onchange = renderCatalog;
  }

  // Initial render
  renderHand();
}

