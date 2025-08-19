import { Game } from './modules/game.js';
import { Renderer } from './modules/renderer.js';
import { CardDatabase } from './modules/cards/database.js';
import { buildDefaultDeck, DeckStorage } from './modules/deck/decks.js';
import { attachUI } from './modules/ui/ui.js';

const canvas = document.getElementById('game-canvas');
const renderer = new Renderer(canvas);
const game = new Game(renderer);

async function bootstrap() {
  await CardDatabase.initialize();
  DeckStorage.initialize();
  if (!DeckStorage.getActiveDeck()) {
    DeckStorage.saveDeck('Deck Inicial', buildDefaultDeck());
    DeckStorage.setActiveDeck('Deck Inicial');
  }

  attachUI({ game, renderer });
  renderer.drawBoard(game.getPublicBoardState());
}

bootstrap();

