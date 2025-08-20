class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.music = new Map();
    this.currentMusic = null;
    this.volume = 0.7;
    this.musicVolume = 0.5;
    this.isMuted = false;
    
    this.init();
  }

  async init() {
    // Sons de efeitos
    const soundEffects = {
      cardDraw: 'https://www.soundjay.com/misc/sounds/card-flip-1.mp3',
      cardPlay: 'https://www.soundjay.com/misc/sounds/card-flip-2.mp3',
      attack: 'https://www.soundjay.com/misc/sounds/sword-swing-1.mp3',
      victory: 'https://www.soundjay.com/misc/sounds/victory-fanfare-1.mp3',
      defeat: 'https://www.soundjay.com/misc/sounds/game-over-1.mp3',
      buttonClick: 'https://www.soundjay.com/misc/sounds/button-click-1.mp3',
      magic: 'https://www.soundjay.com/misc/sounds/magic-spell-1.mp3',
      damage: 'https://www.soundjay.com/misc/sounds/damage-1.mp3',
      heal: 'https://www.soundjay.com/misc/sounds/heal-1.mp3',
      summon: 'https://www.soundjay.com/misc/sounds/summon-1.mp3'
    };

    // Músicas de fundo
    const backgroundMusic = {
      menu: 'https://www.soundjay.com/misc/sounds/ambient-forest-1.mp3',
      battle: 'https://www.soundjay.com/misc/sounds/epic-battle-1.mp3',
      victory: 'https://www.soundjay.com/misc/sounds/victory-theme-1.mp3',
      defeat: 'https://www.soundjay.com/misc/sounds/defeat-theme-1.mp3'
    };

    // Carregar sons
    for (const [key, url] of Object.entries(soundEffects)) {
      await this.loadSound(key, url);
    }

    // Carregar músicas
    for (const [key, url] of Object.entries(backgroundMusic)) {
      await this.loadMusic(key, url);
    }
  }

  async loadSound(name, url) {
    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = this.volume;
      
      // Aguardar carregamento
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve);
        audio.addEventListener('error', reject);
        audio.load();
      });

      this.sounds.set(name, audio);
    } catch (error) {
      console.warn(`Erro ao carregar som ${name}:`, error);
    }
  }

  async loadMusic(name, url) {
    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = this.musicVolume;
      audio.loop = true;
      
      // Aguardar carregamento
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve);
        audio.addEventListener('error', reject);
        audio.load();
      });

      this.music.set(name, audio);
    } catch (error) {
      console.warn(`Erro ao carregar música ${name}:`, error);
    }
  }

  playSound(name) {
    if (this.isMuted) return;

    const sound = this.sounds.get(name);
    if (sound) {
      sound.currentTime = 0;
      sound.volume = this.volume;
      sound.play().catch(error => {
        console.warn(`Erro ao tocar som ${name}:`, error);
      });
    }
  }

  playMusic(name, fadeIn = true) {
    if (this.isMuted) return;

    const music = this.music.get(name);
    if (music && music !== this.currentMusic) {
      // Parar música atual
      if (this.currentMusic) {
        if (fadeIn) {
          this.fadeOut(this.currentMusic, () => {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
          });
        } else {
          this.currentMusic.pause();
          this.currentMusic.currentTime = 0;
        }
      }

      // Tocar nova música
      this.currentMusic = music;
      music.currentTime = 0;
      music.volume = fadeIn ? 0 : this.musicVolume;
      music.play().catch(error => {
        console.warn(`Erro ao tocar música ${name}:`, error);
      });

      if (fadeIn) {
        this.fadeIn(music);
      }
    }
  }

  stopMusic(fadeOut = true) {
    if (this.currentMusic) {
      if (fadeOut) {
        this.fadeOut(this.currentMusic, () => {
          this.currentMusic.pause();
          this.currentMusic.currentTime = 0;
          this.currentMusic = null;
        });
      } else {
        this.currentMusic.pause();
        this.currentMusic.currentTime = 0;
        this.currentMusic = null;
      }
    }
  }

  fadeIn(audio, duration = 2000) {
    const startVolume = 0;
    const endVolume = this.musicVolume;
    const steps = 50;
    const stepDuration = duration / steps;
    const volumeStep = (endVolume - startVolume) / steps;

    let currentStep = 0;
    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = startVolume + (volumeStep * currentStep);
      
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        audio.volume = endVolume;
      }
    }, stepDuration);
  }

  fadeOut(audio, callback, duration = 1000) {
    const startVolume = audio.volume;
    const steps = 50;
    const stepDuration = duration / steps;
    const volumeStep = startVolume / steps;

    let currentStep = 0;
    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = startVolume - (volumeStep * currentStep);
      
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        audio.volume = 0;
        if (callback) callback();
      }
    }, stepDuration);
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Atualizar volume de todos os sons
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    
    // Atualizar volume da música atual
    if (this.currentMusic) {
      this.currentMusic.volume = this.musicVolume;
    }
    
    // Atualizar volume de todas as músicas
    this.music.forEach(music => {
      music.volume = this.musicVolume;
    });
  }

  mute() {
    this.isMuted = true;
    if (this.currentMusic) {
      this.currentMusic.pause();
    }
  }

  unmute() {
    this.isMuted = false;
    if (this.currentMusic) {
      this.currentMusic.play().catch(error => {
        console.warn('Erro ao retomar música:', error);
      });
    }
  }

  // Sons específicos do jogo
  playCardDraw() {
    this.playSound('cardDraw');
  }

  playCardPlay() {
    this.playSound('cardPlay');
  }

  playAttack() {
    this.playSound('attack');
  }

  playVictory() {
    this.playSound('victory');
    this.playMusic('victory');
  }

  playDefeat() {
    this.playSound('defeat');
    this.playMusic('defeat');
  }

  playButtonClick() {
    this.playSound('buttonClick');
  }

  playMagic() {
    this.playSound('magic');
  }

  playDamage() {
    this.playSound('damage');
  }

  playHeal() {
    this.playSound('heal');
  }

  playSummon() {
    this.playSound('summon');
  }

  // Músicas específicas do jogo
  playMenuMusic() {
    this.playMusic('menu');
  }

  playBattleMusic() {
    this.playMusic('battle');
  }

  // Efeitos sonoros baseados em eventos do jogo
  playGameEvent(event) {
    switch (event) {
      case 'card_draw':
        this.playCardDraw();
        break;
      case 'card_play':
        this.playCardPlay();
        break;
      case 'attack':
        this.playAttack();
        break;
      case 'magic':
        this.playMagic();
        break;
      case 'damage':
        this.playDamage();
        break;
      case 'heal':
        this.playHeal();
        break;
      case 'summon':
        this.playSummon();
        break;
      case 'victory':
        this.playVictory();
        break;
      case 'defeat':
        this.playDefeat();
        break;
      case 'button_click':
        this.playButtonClick();
        break;
      default:
        break;
    }
  }
}

export const audioManager = new AudioManager();