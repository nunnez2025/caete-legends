import { TurnPhase, PlayerId, getPlayerView, getOpponentView } from './state.js';
import { CardDatabase } from '../cards/database.js';

export function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

export function applyAction(state, action) {
  const s = clone(state);
  if (s.winner) return s;

  switch (action.type) {
    case 'ADVANCE_PHASE':
      advancePhase(s);
      break;
    case 'SUMMON_FROM_HAND':
      performSummonFromHand(s, action);
      break;
    case 'ACTIVATE_SPELL_FROM_HAND':
      activateSpellFromHand(s, action);
      break;
    case 'SET_TRAP_FROM_HAND':
      setTrapFromHand(s, action);
      break;
    case 'ATTACK':
      performAttack(s, action);
      break;
    case 'END_TURN':
      endTurn(s);
      break;
    default:
      break;
  }

  checkWin(s);
  return s;
}

function advancePhase(s) {
  const order = [TurnPhase.Draw, TurnPhase.Main1, TurnPhase.Battle, TurnPhase.Main2, TurnPhase.End];
  const idx = order.indexOf(s.phase);
  if (idx < order.length - 1) {
    s.phase = order[idx + 1];
    if (s.phase === TurnPhase.Draw) drawStep(s);
  } else {
    endTurn(s);
  }
}

function endTurn(s) {
  s.phase = TurnPhase.Draw;
  s.currentPlayer = s.currentPlayer === PlayerId.Player ? PlayerId.Opponent : PlayerId.Player;
  const cp = getPlayerView(s, s.currentPlayer);
  cp.normalSummonUsed = false;
  drawStep(s);
  s.turn += 1;
}

function drawStep(s) {
  const cp = getPlayerView(s, s.currentPlayer);
  const card = cp.deck.shift();
  if (!card) {
    s.winner = s.currentPlayer === PlayerId.Player ? PlayerId.Opponent : PlayerId.Player;
    s.lastLog.push('Deck vazio — derrota por deckout.');
    return;
  }
  cp.hand.push(card);
}

function performSummonFromHand(s, { handIndex, tributes = [] }) {
  if (s.phase !== TurnPhase.Main1 && s.phase !== TurnPhase.Main2) return;
  const cp = getPlayerView(s, s.currentPlayer);
  if (cp.normalSummonUsed) return;
  const card = cp.hand[handIndex];
  if (!card || card.type !== 'creature') return;

  const level = card.level || 0;
  let requiredTributes = 0;
  if (level >= 5 && level <= 6) requiredTributes = 1;
  else if (level >= 7 && level <= 8) requiredTributes = 2;
  else if (level >= 9) requiredTributes = 3;

  const freeSlot = cp.field.creatures.findIndex(z => z === null);
  if (freeSlot === -1) return;

  if (requiredTributes > 0) {
    if (!tributes || tributes.length < requiredTributes) return;
    // Validate tributes exist
    for (const idx of tributes) {
      if (!cp.field.creatures[idx]) return;
    }
    // Send tributes to graveyard
    const sorted = [...tributes].sort((a,b)=>b-a);
    for (const i of sorted) {
      cp.graveyard.push(cp.field.creatures[i]);
      cp.field.creatures[i] = null;
    }
  }
  // Move to field
  cp.field.creatures[freeSlot] = card;
  cp.hand.splice(handIndex, 1);
  cp.normalSummonUsed = true;

  triggerOnSummon(s, card, s.currentPlayer);
}

function activateSpellFromHand(s, { handIndex, backrowIndex = null }) {
  if (s.phase !== TurnPhase.Main1 && s.phase !== TurnPhase.Main2) return;
  const cp = getPlayerView(s, s.currentPlayer);
  const card = cp.hand[handIndex];
  if (!card || (card.type !== 'spell' && card.type !== 'field')) return;

  if (card.type === 'field') {
    // Replace existing field
    if (cp.field.fieldZone) cp.graveyard.push(cp.field.fieldZone);
    cp.field.fieldZone = card;
    cp.hand.splice(handIndex, 1);
    applyContinuousAuras(s);
    return;
  }

  // For spells, if continuous, place in backrow; if quick/normal, resolve then send to graveyard
  if (card.subtype === 'continuous') {
    const slot = cp.field.backrow.findIndex(z => z === null);
    if (slot === -1) return;
    cp.field.backrow[slot] = card;
    cp.hand.splice(handIndex, 1);
  } else {
    resolveImmediateSpell(s, card);
    cp.hand.splice(handIndex, 1);
    cp.graveyard.push(card);
  }
  applyContinuousAuras(s);
}

function setTrapFromHand(s, { handIndex }) {
  if (s.phase !== TurnPhase.Main1 && s.phase !== TurnPhase.Main2) return;
  const cp = getPlayerView(s, s.currentPlayer);
  const card = cp.hand[handIndex];
  if (!card || card.type !== 'trap') return;
  const slot = cp.field.backrow.findIndex(z => z === null);
  if (slot === -1) return;
  cp.field.backrow[slot] = card;
  cp.hand.splice(handIndex, 1);
}

function performAttack(s, { attackerIndex, targetIndex = null, direct = false }) {
  if (s.phase !== TurnPhase.Battle) return;
  const atkPlayer = getPlayerView(s, s.currentPlayer);
  const defPlayer = getOpponentView(s, s.currentPlayer);
  const attacker = atkPlayer.field.creatures[attackerIndex];
  if (!attacker) return;
  if (attacker.flags.hasAttackedThisTurn) return;

  // Apply per-battle temp effects on defender (e.g., Curupira)
  const doBattle = (attackerCard, defenderCard) => {
    const attackerATK = attackerCard.currentATK;
    const defenderDEF = defenderCard.currentDEF;
    if (attackerATK > defenderDEF) {
      // Destroy defender
      const damage = attackerATK - defenderDEF;
      defPlayer.graveyard.push(defenderCard);
      const defIdx = defPlayer.field.creatures.findIndex(c => c && c.instanceId === defenderCard.instanceId);
      if (defIdx >= 0) defPlayer.field.creatures[defIdx] = null;
      defPlayer.lifePoints -= damage;
    } else if (attackerATK < defenderDEF) {
      const damage = defenderDEF - attackerATK;
      atkPlayer.lifePoints -= damage;
    } else {
      // Equal — both survive in this simplified model
    }
  };

  if (direct) {
    const damage = Math.max(0, attacker.currentATK);
    defPlayer.lifePoints -= damage;
    attacker.flags.hasAttackedThisTurn = true;
    return;
  }

  // Must have a defender target
  if (targetIndex == null) return;
  const defender = defPlayer.field.creatures[targetIndex];
  if (!defender) return;

  // Curupira reactive swap on defend
  if (defender.cardId === 'curupira' || defender.name.toLowerCase().includes('curupira')) {
    const tmp = defender.currentATK;
    defender.currentATK = defender.currentDEF;
    defender.currentDEF = tmp;
  }

  doBattle(attacker, defender);
  attacker.flags.hasAttackedThisTurn = true;
  applyContinuousAuras(s);
}

export function getAvailableActions(s) {
  const actions = [];
  if (s.winner) return actions;
  const cp = getPlayerView(s, s.currentPlayer);

  switch (s.phase) {
    case TurnPhase.Main1:
    case TurnPhase.Main2: {
      // Summons
      if (!cp.normalSummonUsed) {
        cp.hand.forEach((c, idx) => {
          if (c.type === 'creature') {
            const level = c.level || 0;
            let req = 0;
            if (level >= 5 && level <= 6) req = 1; else if (level >= 7 && level <= 8) req = 2; else if (level >= 9) req = 3;
            const available = cp.field.creatures.reduce((n, z) => n + (z ? 1 : 0), 0);
            if (available >= req && cp.field.creatures.some(z => z === null)) {
              actions.push({ type: 'SUMMON_FROM_HAND', handIndex: idx, tributes: [] });
            }
          }
        });
      }
      // Spells
      cp.hand.forEach((c, idx) => {
        if (c.type === 'spell' || c.type === 'field') {
          actions.push({ type: 'ACTIVATE_SPELL_FROM_HAND', handIndex: idx });
        } else if (c.type === 'trap') {
          if (cp.field.backrow.some(z => z === null)) actions.push({ type: 'SET_TRAP_FROM_HAND', handIndex: idx });
        }
      });
      // End
      actions.push({ type: 'ADVANCE_PHASE' });
      break;
    }
    case TurnPhase.Battle: {
      const opponent = getOpponentView(s, s.currentPlayer);
      const hasDefenders = opponent.field.creatures.some(c => !!c);
      cp.field.creatures.forEach((c, idx) => {
        if (!c) return;
        if (c.flags.hasAttackedThisTurn) return;
        if (hasDefenders) {
          for (let j = 0; j < 5; j++) {
            if (opponent.field.creatures[j]) {
              actions.push({ type: 'ATTACK', attackerIndex: idx, targetIndex: j });
            }
          }
        } else {
          actions.push({ type: 'ATTACK', attackerIndex: idx, direct: true });
        }
      });
      actions.push({ type: 'ADVANCE_PHASE' });
      break;
    }
    default:
      actions.push({ type: 'ADVANCE_PHASE' });
  }
  return actions;
}

function resolveImmediateSpell(s, card) {
  // Implement specific known spells by id/name, otherwise no-op
  const id = card.cardId;
  const cp = getPlayerView(s, s.currentPlayer);
  if (id === 'protecao-mae-dagua') {
    // Target: best your creature
    const target = selectBestCreature(cp.field.creatures);
    if (target) {
      target.flags.indestructibleThisTurn = true;
      cp.lifePoints += target.currentDEF;
    }
  }
}

function selectBestCreature(creatureSlots) {
  let best = null;
  for (const c of creatureSlots) {
    if (!c) continue;
    if (!best || c.currentATK + c.currentDEF > best.currentATK + best.currentDEF) best = c;
  }
  return best;
}

function triggerOnSummon(s, card, who) {
  applyContinuousAuras(s);
  // Saci-Pererê: on summon — shuffle 1 random opponent hand card into deck
  if (card.cardId === 'saci') {
    const opp = getOpponentView(s, who);
    if (opp.hand.length > 0) {
      const idx = Math.floor(Math.random() * opp.hand.length);
      const picked = opp.hand.splice(idx, 1)[0];
      // Put back to random position in deck
      const pos = Math.floor(Math.random() * (opp.deck.length + 1));
      opp.deck.splice(pos, 0, picked);
    }
  }

  // Iara: continuous bonus handled in applyContinuousAuras
}

function applyContinuousAuras(s) {
  // Reset stats to base
  for (const side of [s.player, s.opponent]) {
    for (const c of side.field.creatures) if (c) { c.currentATK = c.baseATK; c.currentDEF = c.baseDEF; }
  }

  // Field effects
  for (const side of [s.player, s.opponent]) {
    const fieldCard = side.field.fieldZone;
    if (fieldCard && fieldCard.cardId === 'floresta-amazonica') {
      for (const c of side.field.creatures) {
        if (!c) continue;
        if (c.attribute === 'Floresta') {
          c.currentATK += 200;
          c.currentDEF += 200;
        } else {
          c.currentATK -= 100;
        }
      }
    }
  }

  // Iara aura
  for (const side of [s.player, s.opponent]) {
    for (const c of side.field.creatures) {
      if (!c) continue;
      if (c.cardId === 'iara') {
        // All WATER gain +300
        for (const ally of side.field.creatures) {
          if (ally && ally.attribute === 'Água') {
            ally.currentATK += 300;
            ally.currentDEF += 300;
          }
        }
      }
    }
  }
}

function checkWin(s) {
  if (s.player.lifePoints <= 0) s.winner = PlayerId.Opponent;
  if (s.opponent.lifePoints <= 0) s.winner = PlayerId.Player;
}

