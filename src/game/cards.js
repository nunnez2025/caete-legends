export const cardDatabase = {
  creatures: [
    { id: 'saci', name: 'Saci-Pererê', type: 'Creature', attribute: 'Vento', level: 3, attack: 1200, defense: 800, rarity: 'Comum', art: '🌪️', text: 'Quando invocado: embaralhe 1 carta da mão do oponente no deck. Uma vez por turno: pode atacar diretamente com metade do ATK.', effectId: 'saci_effect' },
    { id: 'boitata', name: 'Boitatá', type: 'Creature', attribute: 'Fogo', level: 7, attack: 2800, defense: 2100, rarity: 'Ultra Rara', art: '🐍', text: 'Requer 2 tributos de Floresta. Quando invocado: destrua todas as magias/armadilhas.', effectId: 'boitata_effect' },
    { id: 'cuca', name: 'Cuca', type: 'Creature', attribute: 'Sombra', level: 6, attack: 2300, defense: 1800, rarity: 'Super Rara', art: '🧙‍♀️', text: 'Quando o oponente invocar uma criatura: roube o controle dela até o fim do turno.', effectId: 'cuca_effect' },
    { id: 'iara', name: 'Iara', type: 'Creature', attribute: 'Água', level: 5, attack: 1900, defense: 2200, rarity: 'Rara', art: '🧜‍♀️', text: 'Todas criaturas de Água ganham +300 ATK/DEF. Uma vez por turno: cure 500 PV.', effectId: 'iara_effect' },
    { id: 'curupira', name: 'Curupira', type: 'Creature', attribute: 'Floresta', level: 4, attack: 1600, defense: 1400, rarity: 'Comum', art: '👣', text: 'Quando atacado: pode trocar ATK/DEF até o fim do turno.', effectId: 'curupira_effect' },
    { id: 'caete_warrior', name: 'Guerreiro Caeté', type: 'Creature', attribute: 'Terra', level: 4, attack: 1400, defense: 1000, rarity: 'Comum', art: '🏹' },
    { id: 'mula_sem_cabeca', name: 'Mula-sem-Cabeça', type: 'Creature', attribute: 'Fogo', level: 6, attack: 2400, defense: 1600, rarity: 'Rara', art: '🔥' },
    { id: 'boto_encantado', name: 'Boto Encantado', type: 'Creature', attribute: 'Água', level: 7, attack: 2500, defense: 2000, rarity: 'Super Rara', art: '🐬', text: 'Pode ser invocado por Ritual do Boto Cor-de-Rosa.', effectId: 'boto_effect' },
    // Adicionar mais criaturas para completar o deck
    { id: 'caipora', name: 'Caipora', type: 'Creature', attribute: 'Floresta', level: 3, attack: 1100, defense: 900, rarity: 'Comum', art: '🦌' },
    { id: 'mapinguari', name: 'Mapinguari', type: 'Creature', attribute: 'Terra', level: 5, attack: 1800, defense: 1500, rarity: 'Rara', art: '🦍' },
    { id: 'bicho_papao', name: 'Bicho-Papão', type: 'Creature', attribute: 'Sombra', level: 4, attack: 1300, defense: 1200, rarity: 'Comum', art: '👻' },
    { id: 'lobisomem', name: 'Lobisomem', type: 'Creature', attribute: 'Sombra', level: 5, attack: 1700, defense: 1400, rarity: 'Rara', art: '🐺' },
    { id: 'mae_dagua', name: 'Mãe-d\'Água', type: 'Creature', attribute: 'Água', level: 4, attack: 1400, defense: 1600, rarity: 'Rara', art: '🧜‍♀️' },
    { id: 'negrinho_pastoreio', name: 'Negrinho do Pastoreio', type: 'Creature', attribute: 'Vento', level: 3, attack: 1000, defense: 800, rarity: 'Comum', art: '👦' },
    { id: 'sereia_mar', name: 'Sereia do Mar', type: 'Creature', attribute: 'Água', level: 4, attack: 1500, defense: 1300, rarity: 'Rara', art: '🧜‍♀️' }
  ],
  spells: [
    { id: 'proteção_mae_dagua', name: "Proteção da Mãe-d'Água", type: 'Spell', spellType: 'Rápida', attribute: 'Água', rarity: 'Comum', art: '🌙', text: 'Selecione 1 criatura; ela não pode ser destruída em batalha este turno e você ganha PV iguais ao DEF.', effectId: 'protecao_mae_dagua' },
    { id: 'ritual_boto', name: 'Ritual do Boto Cor-de-Rosa', type: 'Spell', spellType: 'Ritual', attribute: 'Água', rarity: 'Super Rara', art: '💖', text: "Invoque 1 'Boto Encantado' do deck sacrificando criaturas com ATK total ≥ 2000.", effectId: 'ritual_boto' },
    { id: 'cura_floresta', name: 'Cura da Floresta', type: 'Spell', spellType: 'Normal', attribute: 'Floresta', rarity: 'Comum', art: '🌿', text: 'Recupere 1000 pontos de vida.' },
    { id: 'tempestade_fogo', name: 'Tempestade de Fogo', type: 'Spell', spellType: 'Normal', attribute: 'Fogo', rarity: 'Rara', art: '🔥', text: 'Destrua todas as criaturas com DEF menor que 1500.' },
    { id: 'escudo_terra', name: 'Escudo da Terra', type: 'Spell', spellType: 'Rápida', attribute: 'Terra', rarity: 'Comum', art: '🛡️', text: 'Aumente a DEF de uma criatura em 500 até o fim do turno.' }
  ],
  traps: [
    { id: 'maldicao_lobisomem', name: 'Maldição do Lobisomem', type: 'Trap', trapType: 'Contínua', attribute: 'Sombra', rarity: 'Rara', art: '🌕', text: 'Quando o oponente invocar uma criatura: ela perde 500 ATK e não pode atacar no próximo turno.', effectId: 'maldicao_lobisomem' },
    { id: 'armadilha_agua', name: 'Armadilha das Águas', type: 'Trap', trapType: 'Normal', attribute: 'Água', rarity: 'Comum', art: '🌊', text: 'Quando uma criatura atacar: ela perde 300 ATK.' },
    { id: 'reflexo_vento', name: 'Reflexo do Vento', type: 'Trap', trapType: 'Contra-Arm', attribute: 'Vento', rarity: 'Rara', art: '💨', text: 'Negue o ataque de uma criatura.' },
    { id: 'protecao_floresta', name: 'Proteção da Floresta', type: 'Trap', trapType: 'Contínua', attribute: 'Floresta', rarity: 'Comum', art: '🌳', text: 'Criaturas de Floresta não podem ser destruídas por efeitos.' }
  ],
  fields: [
    { id: 'floresta_amazonica', name: 'Floresta Amazônica', type: 'Field', rarity: 'Comum', art: '🌳', text: 'Criaturas de Floresta ganham +200 ATK/DEF. Outras perdem -100 ATK.', effectId: 'campo_floresta_amazonica' },
    { id: 'oceano_profundo', name: 'Oceano Profundo', type: 'Field', rarity: 'Rara', art: '🌊', text: 'Criaturas de Água ganham +300 ATK/DEF. Criaturas de Fogo perdem -200 ATK.' },
    { id: 'montanhas_rochosas', name: 'Montanhas Rochosas', type: 'Field', rarity: 'Comum', art: '⛰️', text: 'Criaturas de Terra ganham +150 ATK/DEF.' },
    { id: 'deserto_ardente', name: 'Deserto Ardente', type: 'Field', rarity: 'Rara', art: '🏜️', text: 'Criaturas de Fogo ganham +250 ATK. Criaturas de Água perdem -150 DEF.' }
  ]
};