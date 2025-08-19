import { CardDatabase } from '../cards/database.js';
import { shuffle } from '../util/random.js';

export const PlayerId = {
  Player: 'Player',
  Opponent: 'Opponent',
};

export const TurnPhase = {
  Draw: 'Draw',
  Main1: 'Main1',
  Battle: 'Battle',
  Main2: 'Main2',
  End: 'End',
  BattleResolution: 'BattleResolution',
};

let nextInstanceId = 1;
function allocateInstanceId() {
  return nextInstanceId++;
}

export function instantiateCardById(cardId) {
  const tpl = CardDatabase.getCardById(cardId);
  if (!tpl) throw new Error(`Card not found: ${cardId}`);
  const instance = {
    instanceId: allocateInstanceId(),
    cardId: tpl.id,
    name: tpl.name,
    type: tpl.type,
    subtype: tpl.subtype || null,
    attribute: tpl.attribute || null,
    level: tpl.level || 0,
    baseATK: tpl.atk || 0,
    baseDEF: tpl.def || 0,
    currentATK: tpl.atk || 0,
    currentDEF: tpl.def || 0,
    rarity: tpl.rarity || 'Comum',
    text: tpl.text || '',
    flags: {},
    oncePerTurnUsed: {},
  };
  return instance;
}

function createPlayerState(deckCardIds) {
  const deck = deckCardIds.map(instantiateCardById);
  shuffle(deck);
  return {
    lifePoints: 8000,
    deck,
    hand: [],
    graveyard: [],
    banished: [],
    normalSummonUsed: false,
    field: {
      creatures: [null, null, null, null, null],
      backrow: [null, null, null],
      fieldZone: null,
    },
  };
}

export function createInitialBoardState(playerDeck, opponentDeck) {
  const pDeck = playerDeck && playerDeck.length ? playerDeck : CardDatabase.getStarterDeck();
  const oDeck = opponentDeck && opponentDeck.length ? opponentDeck : CardDatabase.getStarterDeckAI();

  const player = createPlayerState(pDeck);
  const opponent = createPlayerState(oDeck);

  // Draw 5 each
  for (let i = 0; i < 5; i++) {
    player.hand.push(player.deck.shift());
    opponent.hand.push(opponent.deck.shift());
  }

  return {
    turn: 1,
    currentPlayer: PlayerId.Player,
    phase: TurnPhase.Draw,
    player,
    opponent,
    winner: null,
    lastLog: [],
    rngSeed: Math.floor(Math.random() * 1e9),
  };
}

export function getPlayerView(state, playerId) {
  return playerId === PlayerId.Player ? state.player : state.opponent;
}

export function getOpponentView(state, playerId) {
  return playerId === PlayerId.Player ? state.opponent : state.player;
}

