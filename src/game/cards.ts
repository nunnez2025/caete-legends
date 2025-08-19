export type Attribute = 'Floresta' | 'Água' | 'Fogo' | 'Terra' | 'Vento' | 'Sombra' | 'Espírito';

export type BaseCard = {
  id: string;
  name: string;
  type: 'Creature' | 'Spell' | 'Trap' | 'Field';
  attribute?: Attribute;
  rarity: 'Comum' | 'Rara' | 'Super Rara' | 'Ultra Rara' | 'Lendária';
  art: string;
  text?: string;
};

export type CreatureCard = BaseCard & {
  type: 'Creature';
  level: number; // 1-12
  attack: number;
  defense: number;
  effectId?: string; // hook id for engine to resolve
};

export type SpellCard = BaseCard & {
  type: 'Spell';
  spellType: 'Normal' | 'Rápida' | 'Ritual' | 'Contínua';
  effectId?: string;
};

export type TrapCard = BaseCard & {
  type: 'Trap';
  trapType: 'Normal' | 'Contínua' | 'Contra-Arm';
  effectId?: string;
};

export type FieldCard = BaseCard & {
  type: 'Field';
  effectId: string;
};

export type AnyCard = CreatureCard | SpellCard | TrapCard | FieldCard;

export const cardDatabase: {
  creatures: CreatureCard[];
  spells: SpellCard[];
  traps: TrapCard[];
  fields: FieldCard[];
} = {
  creatures: [
    { id: 'saci', name: 'Saci-Pererê', type: 'Creature', attribute: 'Vento', level: 3, attack: 1200, defense: 800, rarity: 'Comum', art: '🌪️', text: 'Quando invocado: embaralhe 1 carta da mão do oponente no deck. Uma vez por turno: pode atacar diretamente com metade do ATK.', effectId: 'saci_effect' },
    { id: 'boitata', name: 'Boitatá', type: 'Creature', attribute: 'Fogo', level: 7, attack: 2800, defense: 2100, rarity: 'Ultra Rara', art: '🐍', text: 'Requer 2 tributos de Floresta. Quando invocado: destrua todas as magias/armadilhas.', effectId: 'boitata_effect' },
    { id: 'cuca', name: 'Cuca', type: 'Creature', attribute: 'Sombra', level: 6, attack: 2300, defense: 1800, rarity: 'Super Rara', art: '🧙‍♀️', text: 'Quando o oponente invocar uma criatura: roube o controle dela até o fim do turno.', effectId: 'cuca_effect' },
    { id: 'iara', name: 'Iara', type: 'Creature', attribute: 'Água', level: 5, attack: 1900, defense: 2200, rarity: 'Rara', art: '🧜‍♀️', text: 'Todas criaturas de Água ganham +300 ATK/DEF. Uma vez por turno: cure 500 PV.', effectId: 'iara_effect' },
    { id: 'curupira', name: 'Curupira', type: 'Creature', attribute: 'Floresta', level: 4, attack: 1600, defense: 1400, rarity: 'Comum', art: '👣', text: 'Quando atacado: pode trocar ATK/DEF até o fim do turno.', effectId: 'curupira_effect' },
    { id: 'caete_warrior', name: 'Guerreiro Caeté', type: 'Creature', attribute: 'Terra', level: 4, attack: 1400, defense: 1000, rarity: 'Comum', art: '🏹' },
    { id: 'mula_sem_cabeca', name: 'Mula-sem-Cabeça', type: 'Creature', attribute: 'Fogo', level: 6, attack: 2400, defense: 1600, rarity: 'Rara', art: '🔥' },
    { id: 'boto_encantado', name: 'Boto Encantado', type: 'Creature', attribute: 'Água', level: 7, attack: 2500, defense: 2000, rarity: 'Super Rara', art: '🐬', text: 'Pode ser invocado por Ritual do Boto Cor-de-Rosa.', effectId: 'boto_effect' }
  ],
  spells: [
    { id: 'proteção_mae_dagua', name: "Proteção da Mãe-d'Água", type: 'Spell', spellType: 'Rápida', attribute: 'Água', rarity: 'Comum', art: '🌙', text: 'Selecione 1 criatura; ela não pode ser destruída em batalha este turno e você ganha PV iguais ao DEF.', effectId: 'protecao_mae_dagua' },
    { id: 'ritual_boto', name: 'Ritual do Boto Cor-de-Rosa', type: 'Spell', spellType: 'Ritual', attribute: 'Água', rarity: 'Super Rara', art: '💖', text: "Invoque 1 'Boto Encantado' do deck sacrificando criaturas com ATK total ≥ 2000.", effectId: 'ritual_boto' }
  ],
  traps: [
    { id: 'maldicao_lobisomem', name: 'Maldição do Lobisomem', type: 'Trap', trapType: 'Contínua', attribute: 'Sombra', rarity: 'Rara', art: '🌕', text: 'Quando o oponente invocar uma criatura: ela perde 500 ATK e não pode atacar no próximo turno.', effectId: 'maldicao_lobisomem' }
  ],
  fields: [
    { id: 'floresta_amazonica', name: 'Floresta Amazônica', type: 'Field', rarity: 'Comum', art: '🌳', text: 'Criaturas de Floresta ganham +200 ATK/DEF. Outras perdem -100 ATK.', effectId: 'campo_floresta_amazonica' }
  ]
};

