import { createInitialBoardState, TurnPhase, PlayerId } from './rules/state.js';
import { applyAction, getAvailableActions } from './rules/engine.js';
import { AIController } from './rules/ai.js';

export class Game {
  constructor(renderer) {
    this.renderer = renderer;
    this.state = createInitialBoardState();
    this.ai = new AIController();
  }

  getPublicBoardState() {
    return this.state;
  }

  startDuel(playerDeck, opponentDeck) {
    this.state = createInitialBoardState(playerDeck, opponentDeck);
    this.renderer.drawBoard(this.state);
  }

  nextPhase() {
    this.dispatch({ type: 'ADVANCE_PHASE' });
  }

  dispatch(action) {
    const prev = this.state;
    const next = applyAction(prev, action);
    this.state = next;
    this.renderer.drawBoard(this.state);
    if (this.state.currentPlayer === PlayerId.Opponent && this.state.phase !== TurnPhase.BattleResolution) {
      // Let AI think asynchronously
      queueMicrotask(() => this.aiTakeTurn());
    }
  }

  aiTakeTurn() {
    let safety = 64;
    while (safety-- > 0) {
      const actions = getAvailableActions(this.state);
      if (actions.length === 0) break;
      const action = this.ai.chooseAction(this.state, actions);
      if (!action) break;
      this.dispatch(action);
      if (action.type === 'END_TURN') break;
      if (this.state.winner) break;
    }
  }
}

