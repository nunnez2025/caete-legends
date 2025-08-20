// Configurações específicas para Netflix
export const netflixConfig = {
  // Configurações de performance para TV
  performance: {
    maxParticles: 30,
    animationQuality: 'high', // high, medium, low
    enableAdvancedEffects: true,
    targetFPS: 60,
    enableScreenShake: true,
    maxFloatingTexts: 10
  },

  // Configurações de UI para controle remoto
  navigation: {
    enableKeyboardNavigation: true,
    enableGamepadSupport: true,
    focusIndicatorSize: 'large',
    buttonSpacing: 'wide',
    fontSize: 'large'
  },

  // Configurações de áudio para TV
  audio: {
    masterVolume: 0.8,
    sfxVolume: 0.7,
    musicVolume: 0.6,
    enableSpatialAudio: false, // Pode causar problemas em algumas TVs
    enableDynamicRange: true
  },

  // Configurações visuais para diferentes tipos de tela
  display: {
    supportedResolutions: ['1920x1080', '3840x2160', '1366x768'],
    defaultResolution: '1920x1080',
    enableHDR: false, // Ativar apenas se suportado
    colorProfile: 'sRGB',
    contrastMode: 'normal' // normal, high, accessibility
  },

  // Configurações de gameplay para TV
  gameplay: {
    autoSaveEnabled: true,
    pauseOnFocusLoss: true,
    enableTutorial: true,
    difficultyScaling: true,
    enableSpectatorMode: false
  },

  // Configurações de rede para Netflix
  networking: {
    enableCloudSave: false, // Netflix geralmente não permite
    enableLeaderboards: false,
    enableMultiplayer: false,
    offlineMode: true
  },

  // Configurações de localização
  localization: {
    defaultLanguage: 'pt-BR',
    supportedLanguages: ['pt-BR', 'en-US'],
    enableRegionalContent: true,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'pt-BR'
  },

  // Configurações de acessibilidade
  accessibility: {
    enableHighContrast: true,
    enableLargeText: true,
    enableColorBlindSupport: true,
    enableScreenReader: true,
    enableSubtitles: true,
    enableAudioDescription: false
  },

  // Configurações específicas do jogo
  game: {
    maxGameDuration: 1800, // 30 minutos máximo
    enablePauseMenu: true,
    enableQuickRestart: true,
    autoEndLongGames: true,
    enableSpeedMode: true,
    defaultDifficulty: 'Médio'
  },

  // Temas visuais
  themes: {
    default: {
      name: 'Folclore Brasileiro',
      primary: '#059669', // emerald-600
      secondary: '#d97706', // amber-600
      accent: '#dc2626', // red-600
      background: 'from-emerald-900 via-amber-900 to-red-900'
    },
    netflix: {
      name: 'Netflix Dark',
      primary: '#e50914', // Netflix red
      secondary: '#000000',
      accent: '#ffffff',
      background: 'from-gray-900 via-black to-gray-900'
    },
    accessibility: {
      name: 'Alto Contraste',
      primary: '#ffffff',
      secondary: '#000000',
      accent: '#ffff00',
      background: 'from-black to-gray-900'
    }
  }
};

// Configurações de controle remoto Netflix
export const remoteControlConfig = {
  // Mapeamento de teclas do controle remoto
  keyMapping: {
    'ArrowUp': 'navigate_up',
    'ArrowDown': 'navigate_down',
    'ArrowLeft': 'navigate_left',
    'ArrowRight': 'navigate_right',
    'Enter': 'select',
    'Space': 'select',
    'Escape': 'back',
    'Backspace': 'back',
    'KeyP': 'pause',
    'KeyM': 'menu',
    'KeyS': 'settings',
    'KeyH': 'help'
  },

  // Configurações de navegação
  navigation: {
    wrapAround: true,
    highlightDelay: 100,
    selectDelay: 200,
    enableSounds: true
  },

  // Gestos para dispositivos touch
  gestures: {
    enableSwipe: true,
    enablePinchZoom: false,
    enableTwoFingerScroll: true,
    swipeThreshold: 50
  }
};

// Configurações de qualidade adaptativa
export const adaptiveQualityConfig = {
  // Detectar capacidade do dispositivo
  deviceTiers: {
    high: {
      minRAM: 8, // GB
      enableAllEffects: true,
      particleCount: 50,
      animationQuality: 'ultra'
    },
    medium: {
      minRAM: 4,
      enableAllEffects: true,
      particleCount: 30,
      animationQuality: 'high'
    },
    low: {
      minRAM: 2,
      enableAllEffects: false,
      particleCount: 10,
      animationQuality: 'medium'
    }
  },

  // Auto-ajuste baseado em performance
  autoAdjust: {
    enabled: true,
    fpsThreshold: 30,
    adjustmentInterval: 5000, // ms
    enableFPSMonitoring: true
  }
};

// Configurações específicas para diferentes regiões do Brasil
export const regionalConfig = {
  Norte: {
    primaryColor: '#059669', // Verde Amazônia
    secondaryColor: '#0891b2', // Azul dos rios
    backgroundMusic: 'amazonia_theme',
    weatherEffects: ['Chuva Amazônica', 'Neblina da Floresta'],
    specialCards: ['boitata_ancestral', 'curupira_guardiao', 'iara_sedutora']
  },
  Nordeste: {
    primaryColor: '#d97706', // Laranja do sol
    secondaryColor: '#dc2626', // Vermelho da terra
    backgroundMusic: 'sertao_theme',
    weatherEffects: ['Sol Escaldante', 'Vento do Sertão'],
    specialCards: ['cuca_bruxa', 'caete_guerreiro']
  },
  Sudeste: {
    primaryColor: '#7c3aed', // Roxo das montanhas
    secondaryColor: '#059669', // Verde das matas
    backgroundMusic: 'mata_atlantica_theme',
    weatherEffects: ['Chuva da Serra', 'Neblina das Montanhas'],
    specialCards: ['saci_perere', 'mula_sem_cabeca']
  },
  Sul: {
    primaryColor: '#0891b2', // Azul dos pampas
    secondaryColor: '#059669', // Verde das florestas
    backgroundMusic: 'pampas_theme',
    weatherEffects: ['Vento Minuano', 'Geada Matinal'],
    specialCards: ['negrinho_pastoreio', 'boitata_sul']
  },
  CentroOeste: {
    primaryColor: '#d97706', // Dourado do cerrado
    secondaryColor: '#059669', // Verde do pantanal
    backgroundMusic: 'cerrado_theme',
    weatherEffects: ['Seca do Cerrado', 'Enchente do Pantanal'],
    specialCards: ['lobisomem_brasileiro', 'curupira_cerrado']
  }
};

export default netflixConfig;