import { shuffle } from '../util/random.js';

// Minimal seed dataset; we will expand to 50+ programmatically
const baseCards = [
  // Creatures
  { id: 'saci', type: 'creature', name: 'Saci-Pererê', attribute: 'Vento', level: 3, atk: 1200, def: 800, rarity: 'Comum', text: 'Ao ser invocado: embaralhe 1 carta aleatória da mão do oponente no deck. 1/turno: pode atacar diretamente causando metade do dano.' },
  { id: 'boitata', type: 'creature', name: 'Boitatá', attribute: 'Fogo', level: 7, atk: 2800, def: 2100, rarity: 'Ultra Rara', text: 'Deve ser invocado tributando 2 criaturas de Atributo Floresta. Ao ser invocado: destrua todas as magias/armadilhas do campo.' },
  { id: 'cuca', type: 'creature', name: 'Cuca', attribute: 'Sombra', level: 6, atk: 2300, def: 1800, rarity: 'Super Rara', text: 'Quando o oponente invoca uma criatura: você pode tomar o controle dela até o fim do turno.' },
  { id: 'iara', type: 'creature', name: 'Iara', attribute: 'Água', level: 5, atk: 1900, def: 2200, rarity: 'Rara', text: 'Todas as criaturas Água ganham +300 ATK/DEF. 1/turno: recupere 500 de vida.' },
  { id: 'curupira', type: 'creature', name: 'Curupira', attribute: 'Floresta', level: 4, atk: 1600, def: 1400, rarity: 'Comum', text: 'Quando atacado: pode trocar ATK/DEF até o fim do turno.' },
  { id: 'mula-sem-cabeca', type: 'creature', name: 'Mula-sem-Cabeça', attribute: 'Fogo', level: 6, atk: 2400, def: 1700, rarity: 'Rara', text: 'Ataque duplo se Boitatá estiver no campo.' },
  { id: 'boto', type: 'creature', name: 'Boto Encantado', attribute: 'Água', level: 6, atk: 2000, def: 1800, rarity: 'Super Rara', text: 'Sinergia com Iara. Utilizado por Ritual do Boto.' },

  // Spells
  { id: 'protecao-mae-dagua', type: 'spell', subtype: 'quick', name: "Proteção da Mãe-d'Água", rarity: 'Comum', text: 'Selecione 1 criatura: ela não pode ser destruída em batalha neste turno e você ganha vida igual ao DEF dela.' },
  { id: 'ritual-boto', type: 'spell', subtype: 'ritual', name: 'Ritual do Boto Cor-de-Rosa', rarity: 'Super Rara', text: "Invoque 1 'Boto Encantado' do deck tributando criaturas com ATK total ≥ 2000." },

  // Traps
  { id: 'maldicao-lobisomem', type: 'trap', subtype: 'continuous', name: 'Maldição do Lobisomem', rarity: 'Rara', text: 'Quando o oponente invocar uma criatura: ela perde 500 ATK e não pode atacar no próximo turno.' },

  // Field
  { id: 'floresta-amazonica', type: 'field', name: 'Floresta Amazônica', rarity: 'Comum', text: 'Criaturas Floresta +200 ATK/DEF. Outros atributos -100 ATK.' },
];

function generateFillerCreatures() {
  const attrs = ['Floresta', 'Água', 'Fogo', 'Terra', 'Vento', 'Sombra'];
  const names = [
    'Caipora', 'Mapinguari', 'Bicho-Papão', 'Lobisomem', 'Mãe-d’Água', 'Negrinho do Pastoreio', 'Sereia do Mar',
    'Jurupari', 'Mãe-do-Ouro', 'Cabra-Cabriola', 'Comadre Fulozinha', 'Morto Sem Cabeça', 'Romãozinho',
    'Pé-de-Garrafa', 'Tutu Marambá', 'Quibungo', 'Vitória-Régia Ancestral', 'Borboleta Azul Mística'
  ];
  const out = [];
  let idn = 1;
  for (const nm of names) {
    const attr = attrs[(idn + nm.length) % attrs.length];
    const level = 2 + (idn % 7);
    const atk = 700 + (idn % 9) * 100;
    const def = 600 + (idn % 9) * 100;
    out.push({ id: `gen-${idn}`, type: 'creature', name: nm, attribute: attr, level, atk, def, rarity: 'Comum', text: 'Uma criatura do folclore brasileiro.' });
    idn++;
  }
  return out;
}

const expanded = baseCards.concat(generateFillerCreatures());
while (expanded.length < 50) {
  const i = expanded.length + 1;
  expanded.push({ id: `token-${i}`, type: 'creature', name: `Guardião ${i}`, attribute: 'Terra', level: 3, atk: 1200, def: 1200, rarity: 'Comum', text: 'Guardião anônimo das lendas.' });
}

export class CardDatabase {
  static async initialize() {
    this.cardsById = new Map();
    for (const c of expanded) this.cardsById.set(c.id, c);
  }

  static getCardById(id) { return this.cardsById.get(id); }

  static listAll() { return [...this.cardsById.values()]; }

  static getStarterDeck() {
    const ids = [
      'saci','curupira','iara','floresta-amazonica','protecao-mae-dagua','gen-1','gen-2','gen-3','gen-4','gen-5',
      'gen-6','gen-7','gen-8','gen-9','gen-10','gen-11','gen-12','gen-13','gen-14','gen-15',
      'gen-16','gen-17','gen-18','gen-1','gen-2','gen-3','gen-4','gen-5','gen-6','gen-7',
      'gen-8','gen-9','gen-10','gen-11','gen-12','gen-13','gen-14','gen-15','gen-16','gen-17'
    ];
    return ids;
  }

  static getStarterDeckAI() {
    const ids = [
      'cuca','boitata','maldicao-lobisomem','floresta-amazonica','gen-18','gen-1','gen-2','gen-3','gen-4','gen-5',
      'gen-6','gen-7','gen-8','gen-9','gen-10','gen-11','gen-12','gen-13','gen-14','gen-15',
      'gen-16','gen-17','gen-18','gen-1','gen-2','gen-3','gen-4','gen-5','gen-6','gen-7',
      'gen-8','gen-9','gen-10','gen-11','gen-12','gen-13','gen-14','gen-15','gen-16','gen-17'
    ];
    return ids;
  }
}

