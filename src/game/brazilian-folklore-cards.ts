export type Attribute = 'Floresta' | 'Água' | 'Fogo' | 'Terra' | 'Vento' | 'Sombra' | 'Espírito' | 'Luz';

export type Rarity = 'Comum' | 'Rara' | 'Super Rara' | 'Ultra Rara' | 'Lendária' | 'Mítica';

export interface BaseCard {
  id: string;
  name: string;
  type: 'Criatura' | 'Magia' | 'Armadilha' | 'Campo' | 'Ritual';
  attribute?: Attribute;
  rarity: Rarity;
  art: string;
  description: string;
  lore?: string;
  manaCost: number;
  region?: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';
}

export interface CreatureCard extends BaseCard {
  type: 'Criatura';
  level: number;
  attack: number;
  defense: number;
  species: 'Humano' | 'Espírito' | 'Besta' | 'Dragão' | 'Planta' | 'Elemental' | 'Demônio';
  effects?: string[];
}

export interface MagicCard extends BaseCard {
  type: 'Magia';
  spellType: 'Normal' | 'Rápida' | 'Ritual' | 'Contínua' | 'Campo';
  effects: string[];
}

export interface TrapCard extends BaseCard {
  type: 'Armadilha';
  trapType: 'Normal' | 'Contínua' | 'Contra-Ataque';
  effects: string[];
}

export type AnyCard = CreatureCard | MagicCard | TrapCard;

// Banco de dados expandido com folclore brasileiro autêntico
export const brazilianFolkloreCards: {
  creatures: CreatureCard[];
  magics: MagicCard[];
  traps: TrapCard[];
} = {
  creatures: [
    // Lendas do Norte
    {
      id: 'boitata_ancestral',
      name: 'Boitatá Ancestral',
      type: 'Criatura',
      attribute: 'Fogo',
      rarity: 'Mítica',
      art: '🐍🔥',
      description: 'A serpente de fogo primordial que protege as florestas há milênios',
      lore: 'Nas profundezas da Amazônia, onde a luz não alcança, vive o guardião mais antigo da floresta. Seus olhos são como sóis em miniatura, e seu corpo serpentino carrega o fogo sagrado da criação.',
      manaCost: 9,
      level: 12,
      attack: 4000,
      defense: 3500,
      species: 'Dragão',
      region: 'Norte',
      effects: ['Imune a magias de Água', 'Ao ser invocado: destrua todas as magias/armadilhas do campo', 'Uma vez por turno: inflija 800 de dano direto']
    },
    {
      id: 'curupira_guardiao',
      name: 'Curupira, Guardião da Floresta',
      type: 'Criatura',
      attribute: 'Floresta',
      rarity: 'Lendária',
      art: '👣🌳',
      description: 'O protetor eterno das matas, com pés virados para trás',
      lore: 'Pequeno em estatura mas gigante em poder, o Curupira confunde invasores e protege os animais da floresta. Seus pés virados para trás criam pegadas que levam os perdidos para longe dos tesouros naturais.',
      manaCost: 7,
      level: 8,
      attack: 2800,
      defense: 3200,
      species: 'Espírito',
      region: 'Norte',
      effects: ['Todas as criaturas de Floresta ganham +500 ATK/DEF', 'Quando atacado: pode redirecionar o ataque para outra criatura']
    },
    {
      id: 'iara_sedutora',
      name: 'Iara, a Mãe d\'Água',
      type: 'Criatura',
      attribute: 'Água',
      rarity: 'Lendária',
      art: '🧜‍♀️💎',
      description: 'A sereia encantadora dos rios amazônicos',
      lore: 'Bela e perigosa, Iara atrai os homens com seu canto hipnótico. Aqueles que sucumbem ao seu encanto são levados para as profundezas dos rios, onde se tornam seus servos eternos.',
      manaCost: 6,
      level: 7,
      attack: 2400,
      defense: 2800,
      species: 'Espírito',
      region: 'Norte',
      effects: ['Ao ser invocada: tome controle de 1 criatura inimiga até o fim do turno', 'Uma vez por turno: cure 1000 PV']
    },
    {
      id: 'mapinguari',
      name: 'Mapinguari, a Besta Ancestral',
      type: 'Criatura',
      attribute: 'Terra',
      rarity: 'Ultra Rara',
      art: '🦥💀',
      description: 'A criatura gigantesca que assombra a Amazônia',
      lore: 'Maior que uma casa, com pelos longos e fedorentos, o Mapinguari é o terror da floresta. Sua boca no abdômen devora tudo em seu caminho, e seus gritos ecoam por quilômetros.',
      manaCost: 8,
      level: 10,
      attack: 3500,
      defense: 3000,
      species: 'Besta',
      region: 'Norte',
      effects: ['Ao atacar: destrua 1 carta aleatória da mão do oponente', 'Não pode ser alvo de magias']
    },

    // Lendas do Nordeste
    {
      id: 'cuca_bruxa',
      name: 'Cuca, a Bruxa do Sertão',
      type: 'Criatura',
      attribute: 'Sombra',
      rarity: 'Lendária',
      art: '🧙‍♀️🦎',
      description: 'A bruxa com cabeça de jacaré que rouba crianças travessas',
      lore: 'Nas noites sem lua do sertão, a Cuca emerge de sua caverna. Com sua cabeça de jacaré e poderes sombrios, ela pune aqueles que desobedecem e aterroriza os sonhos das crianças.',
      manaCost: 7,
      level: 9,
      attack: 3000,
      defense: 2500,
      species: 'Demônio',
      region: 'Nordeste',
      effects: ['Ao ser invocada: o oponente descarta 2 cartas', 'Uma vez por turno: roube 1 carta da mão do oponente']
    },
    {
      id: 'saci_perere',
      name: 'Saci-Pererê, o Travesso',
      type: 'Criatura',
      attribute: 'Vento',
      rarity: 'Rara',
      art: '🌪️👨‍🦱',
      description: 'O moleque travesso de uma perna só',
      lore: 'Com seu gorro vermelho mágico e cachimbo sempre aceso, o Saci brinca com viajantes, esconde objetos e causa pequenos caos por onde passa. Sua risada ecoa com o vento.',
      manaCost: 3,
      level: 4,
      attack: 1200,
      defense: 800,
      species: 'Espírito',
      region: 'Sudeste',
      effects: ['Ao ser invocado: embaralhe 1 carta da mão do oponente no deck', 'Pode atacar diretamente com metade do ATK']
    },
    {
      id: 'boto_cor_rosa',
      name: 'Boto Cor-de-Rosa Encantado',
      type: 'Criatura',
      attribute: 'Água',
      rarity: 'Super Rara',
      art: '🐬💖',
      description: 'O golfinho amazônico que se transforma em homem sedutor',
      lore: 'Nas festas juninas, um jovem elegante aparece do nada para conquistar as moças. Ao amanhecer, retorna às águas em sua forma verdadeira, deixando apenas memórias e mistério.',
      manaCost: 6,
      level: 7,
      attack: 2200,
      defense: 2400,
      species: 'Espírito',
      region: 'Norte',
      effects: ['Só pode ser invocado durante a noite (turnos ímpares)', 'Ao ser invocado: compre 2 cartas']
    },
    {
      id: 'mula_sem_cabeca',
      name: 'Mula-sem-Cabeça',
      type: 'Criatura',
      attribute: 'Fogo',
      rarity: 'Super Rara',
      art: '🔥🐴',
      description: 'A criatura amaldiçoada que galopa em chamas',
      lore: 'Nas noites de sexta-feira, uma mula em chamas galopa pelos campos, carregando em seu pescoço cortado as chamas do inferno. Seu galope ecoa como trovão.',
      manaCost: 6,
      level: 6,
      attack: 2600,
      defense: 1800,
      species: 'Demônio',
      region: 'Sudeste',
      effects: ['Ao atacar: inflija 400 de dano adicional', 'Ganha +200 ATK para cada carta no cemitério']
    },
    {
      id: 'lobisomem_brasileiro',
      name: 'Lobisomem do Cerrado',
      type: 'Criatura',
      attribute: 'Sombra',
      rarity: 'Rara',
      art: '🌕🐺',
      description: 'O homem-lobo das planícies brasileiras',
      lore: 'Nas noites de lua cheia, o sétimo filho homem se transforma em uma besta faminta. Maior e mais feroz que um lobo comum, caça nas estradas desertas do interior.',
      manaCost: 5,
      level: 6,
      attack: 2000,
      defense: 1600,
      species: 'Besta',
      region: 'Centro-Oeste',
      effects: ['Durante turnos de lua cheia (múltiplos de 3): ganha +800 ATK', 'Pode atacar duas vezes por turno']
    },
    {
      id: 'nego_dagua',
      name: 'Nego d\'Água',
      type: 'Criatura',
      attribute: 'Água',
      rarity: 'Comum',
      art: '🌊👨‍🦲',
      description: 'O espírito aquático protetor dos rios',
      lore: 'Pequeno e negro como a noite, o Nego d\'Água protege os peixes e pune pescadores gananciosos. Suas brincadeiras podem ser inofensivas ou mortais.',
      manaCost: 4,
      level: 5,
      attack: 1600,
      defense: 2000,
      species: 'Espírito',
      region: 'Norte',
      effects: ['Outras criaturas de Água ganham +300 DEF', 'Ao ser destruído: compre 1 carta']
    },

    // Criaturas Regionais
    {
      id: 'caete_guerreiro',
      name: 'Guerreiro Caeté Ancestral',
      type: 'Criatura',
      attribute: 'Terra',
      rarity: 'Comum',
      art: '🏹⚔️',
      description: 'O bravo guerreiro da tribo Caeté',
      lore: 'Descendente dos guerreiros que defenderam suas terras contra invasores, carrega a força e a coragem de seus ancestrais em cada batalha.',
      manaCost: 4,
      level: 4,
      attack: 1800,
      defense: 1200,
      species: 'Humano',
      region: 'Nordeste',
      effects: ['Quando outro Guerreiro é invocado: ganha +300 ATK']
    },
    {
      id: 'vitoria_regia_gigante',
      name: 'Vitória-Régia Gigante',
      type: 'Criatura',
      attribute: 'Água',
      rarity: 'Rara',
      art: '🪷🌺',
      description: 'A planta aquática colossal da Amazônia',
      lore: 'Crescida além de proporções naturais pelos espíritos da floresta, suas folhas podem sustentar um homem adulto e suas flores brilham como estrelas.',
      manaCost: 5,
      level: 6,
      attack: 1400,
      defense: 2800,
      species: 'Planta',
      region: 'Norte',
      effects: ['Pode ser invocada sem tributo se houver campo de Água', 'Ao fim do turno: cure 300 PV']
    },
    {
      id: 'anhanga_sombrio',
      name: 'Anhangá, o Espírito Sombrio',
      type: 'Criatura',
      attribute: 'Sombra',
      rarity: 'Ultra Rara',
      art: '👹🦌',
      description: 'O espírito protetor que pune os caçadores gananciosos',
      lore: 'Com chifres de veado e olhos de brasa, Anhangá protege os animais da floresta. Aqueles que caçam por prazer ou ganância encontram apenas terror em suas trilhas.',
      manaCost: 7,
      level: 8,
      attack: 2900,
      defense: 2300,
      species: 'Demônio',
      region: 'Norte',
      effects: ['Ao ser invocado: destrua todas as criaturas com ATK menor que 2000', 'Ganha +100 ATK para cada criatura no cemitério']
    }
  ],

  magics: [
    {
      id: 'ritual_pajé',
      name: 'Ritual do Pajé Ancestral',
      type: 'Magia',
      spellType: 'Ritual',
      attribute: 'Espírito',
      rarity: 'Lendária',
      art: '🔥🪶',
      description: 'Invoque os espíritos ancestrais para proteger a tribo',
      lore: 'O pajé entoa cânticos sagrados enquanto a fumaça do ritual sobe aos céus, chamando os ancestrais para abençoar os guerreiros.',
      manaCost: 8,
      region: 'Norte',
      effects: ['Invoque 1 criatura Lendária do deck ignorando o custo de mana', 'Todas as suas criaturas ganham +500 ATK/DEF este turno']
    },
    {
      id: 'encanto_iara',
      name: 'Encanto da Iara',
      type: 'Magia',
      spellType: 'Rápida',
      attribute: 'Água',
      rarity: 'Super Rara',
      art: '🎵💙',
      description: 'O canto hipnótico que seduz os inimigos',
      manaCost: 5,
      region: 'Norte',
      effects: ['Tome controle de 1 criatura inimiga até o fim do turno', 'A criatura controlada pode atacar no mesmo turno']
    },
    {
      id: 'furia_boitata',
      name: 'Fúria do Boitatá',
      type: 'Magia',
      spellType: 'Normal',
      attribute: 'Fogo',
      rarity: 'Rara',
      art: '🐍🔥',
      description: 'O fogo sagrado que purifica a floresta',
      manaCost: 6,
      region: 'Norte',
      effects: ['Destrua todas as magias e armadilhas do campo', 'Inflija 1000 de dano ao oponente']
    },
    {
      id: 'bencao_curupira',
      name: 'Bênção do Curupira',
      type: 'Magia',
      spellType: 'Contínua',
      attribute: 'Floresta',
      rarity: 'Comum',
      art: '👣🌿',
      description: 'A proteção eterna do guardião da floresta',
      manaCost: 3,
      region: 'Norte',
      effects: ['Suas criaturas de Floresta não podem ser destruídas por efeitos', 'Uma vez por turno: compre 1 carta']
    },
    {
      id: 'tempestade_saci',
      name: 'Tempestade do Saci',
      type: 'Magia',
      spellType: 'Rápida',
      attribute: 'Vento',
      rarity: 'Comum',
      art: '🌪️⚡',
      description: 'O redemoinho travesso que confunde os inimigos',
      manaCost: 4,
      region: 'Sudeste',
      effects: ['Embaralhe todas as cartas da mão do oponente no deck', 'O oponente compra o mesmo número de cartas']
    },
    {
      id: 'maldicao_cuca',
      name: 'Maldição da Cuca',
      type: 'Magia',
      spellType: 'Normal',
      attribute: 'Sombra',
      rarity: 'Super Rara',
      art: '🧙‍♀️💀',
      description: 'O feitiço sombrio que aterroriza os inimigos',
      manaCost: 7,
      region: 'Nordeste',
      effects: ['O oponente descarta toda a mão', 'Para cada carta descartada, inflija 200 de dano']
    },
    {
      id: 'transformacao_boto',
      name: 'Transformação do Boto',
      type: 'Magia',
      spellType: 'Rápida',
      attribute: 'Água',
      rarity: 'Rara',
      art: '🐬👤',
      description: 'A metamorfose mágica do golfinho encantado',
      manaCost: 4,
      region: 'Norte',
      effects: ['Retorne 1 criatura sua para a mão', 'Invoque 1 criatura diferente da mão sem pagar o custo']
    },
    {
      id: 'chamas_mula',
      name: 'Chamas da Mula-sem-Cabeça',
      type: 'Magia',
      spellType: 'Normal',
      attribute: 'Fogo',
      rarity: 'Rara',
      art: '🔥💀',
      description: 'As chamas infernais que queimam os pecadores',
      manaCost: 5,
      region: 'Sudeste',
      effects: ['Destrua 1 criatura inimiga', 'Inflija dano igual ao ATK da criatura destruída']
    }
  ],

  traps: [
    {
      id: 'armadilha_curupira',
      name: 'Armadilha do Curupira',
      type: 'Armadilha',
      trapType: 'Normal',
      attribute: 'Floresta',
      rarity: 'Comum',
      art: '🪤👣',
      description: 'As pegadas falsas que confundem invasores',
      manaCost: 3,
      region: 'Norte',
      effects: ['Quando o oponente atacar: redirecione o ataque para uma de suas próprias criaturas']
    },
    {
      id: 'pesadelo_cuca',
      name: 'Pesadelo da Cuca',
      type: 'Armadilha',
      trapType: 'Contínua',
      attribute: 'Sombra',
      rarity: 'Super Rara',
      art: '😱🌙',
      description: 'Os terrores noturnos que assombram os inimigos',
      manaCost: 6,
      region: 'Nordeste',
      effects: ['Durante cada turno do oponente: ele deve descartar 1 carta ou perder 500 PV']
    },
    {
      id: 'reflexo_iara',
      name: 'Reflexo da Iara',
      type: 'Armadilha',
      trapType: 'Contra-Ataque',
      attribute: 'Água',
      rarity: 'Rara',
      art: '🪞💧',
      description: 'O espelho d\'água que reflete ataques',
      manaCost: 4,
      region: 'Norte',
      effects: ['Quando uma de suas criaturas for atacada: reflita o dano para o atacante']
    },
    {
      id: 'lua_cheia',
      name: 'Lua Cheia Maldita',
      type: 'Armadilha',
      trapType: 'Contínua',
      attribute: 'Sombra',
      rarity: 'Rara',
      art: '🌕🐺',
      description: 'A lua que desperta a besta interior',
      manaCost: 5,
      region: 'Centro-Oeste',
      effects: ['Todas as criaturas Besta ganham +500 ATK durante a noite', 'Uma vez por turno: transforme 1 Humano em Besta']
    },
    {
      id: 'redemoinho_saci',
      name: 'Redemoinho do Saci',
      type: 'Armadilha',
      trapType: 'Normal',
      attribute: 'Vento',
      rarity: 'Comum',
      art: '🌪️🎩',
      description: 'O vento travesso que dispersa magias',
      manaCost: 2,
      region: 'Sudeste',
      effects: ['Negue e destrua 1 magia do oponente', 'Compre 1 carta']
    }
  ]
};

// Função para obter carta por ID
export const getCardById = (cardId: string): AnyCard | null => {
  const cleanId = cardId.replace(/_\d+$/, '');
  
  const allCards = [
    ...brazilianFolkloreCards.creatures,
    ...brazilianFolkloreCards.magics,
    ...brazilianFolkloreCards.traps
  ];
  
  return allCards.find(card => card.id === cleanId) || null;
};

// Função para criar deck balanceado
export const createBalancedDeck = (): string[] => {
  const deck: string[] = [];
  
  // 15 criaturas (mix de raros e comuns)
  const creatures = brazilianFolkloreCards.creatures;
  for (let i = 0; i < 15; i++) {
    const rarity = Math.random();
    let selectedCreatures;
    
    if (rarity < 0.5) {
      selectedCreatures = creatures.filter(c => c.rarity === 'Comum');
    } else if (rarity < 0.8) {
      selectedCreatures = creatures.filter(c => c.rarity === 'Rara');
    } else {
      selectedCreatures = creatures.filter(c => c.rarity === 'Super Rara' || c.rarity === 'Ultra Rara');
    }
    
    if (selectedCreatures.length > 0) {
      const randomCreature = selectedCreatures[Math.floor(Math.random() * selectedCreatures.length)];
      deck.push(`${randomCreature.id}_${i}`);
    }
  }
  
  // 8 magias
  const magics = brazilianFolkloreCards.magics;
  for (let i = 0; i < 8; i++) {
    const randomMagic = magics[Math.floor(Math.random() * magics.length)];
    deck.push(`${randomMagic.id}_${i + 15}`);
  }
  
  // 7 armadilhas
  const traps = brazilianFolkloreCards.traps;
  for (let i = 0; i < 7; i++) {
    const randomTrap = traps[Math.floor(Math.random() * traps.length)];
    deck.push(`${randomTrap.id}_${i + 23}`);
  }
  
  // Embaralhar deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
};

export default brazilianFolkloreCards;