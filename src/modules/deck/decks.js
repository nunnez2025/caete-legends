import { CardDatabase } from '../cards/database.js';

export function buildDefaultDeck() {
  return CardDatabase.getStarterDeck();
}

const STORAGE_KEY = 'lendas_decks_v1';
const ACTIVE_KEY = 'lendas_active_deck_v1';

export class DeckStorage {
  static initialize() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
    }
  }

  static saveDeck(name, cardIds) {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    all[name] = cardIds;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  static deleteDeck(name) {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    delete all[name];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  static listDecks() {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return Object.keys(all);
  }

  static getDeck(name) {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return all[name] || null;
  }

  static setActiveDeck(name) {
    localStorage.setItem(ACTIVE_KEY, name);
  }

  static getActiveDeckName() {
    return localStorage.getItem(ACTIVE_KEY);
  }

  static getActiveDeck() {
    const name = this.getActiveDeckName();
    if (!name) return null;
    return this.getDeck(name);
  }
}

