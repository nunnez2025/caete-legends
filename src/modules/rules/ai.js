import { TurnPhase } from './state.js';

export class AIController {
  chooseAction(state, actions) {
    // Simple heuristic:
    // - If main phase: prefer summon strongest creature, then play field, then spells
    // - If battle: attack directly if possible, else attack weakest defender
    // - Otherwise: advance phase
    const phase = state.phase;

    if (phase === TurnPhase.Main1 || phase === TurnPhase.Main2) {
      // Summon strongest
      const summons = actions.filter(a => a.type === 'SUMMON_FROM_HAND');
      if (summons.length) return summons[summons.length - 1];
      // Field
      const fields = actions.filter(a => a.type === 'ACTIVATE_SPELL_FROM_HAND');
      if (fields.length) return fields[0];
      // Set traps
      const traps = actions.filter(a => a.type === 'SET_TRAP_FROM_HAND');
      if (traps.length) return traps[0];
      // Advance
      const adv = actions.find(a => a.type === 'ADVANCE_PHASE');
      if (adv) return adv;
    }

    if (phase === TurnPhase.Battle) {
      const attacks = actions.filter(a => a.type === 'ATTACK');
      // Prefer direct
      const direct = attacks.find(a => a.direct);
      if (direct) return direct;
      if (attacks.length) return attacks[0];
      const adv = actions.find(a => a.type === 'ADVANCE_PHASE');
      if (adv) return adv;
    }

    // Default
    const adv = actions.find(a => a.type === 'ADVANCE_PHASE');
    return adv || actions[0] || null;
  }
}

