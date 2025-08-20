class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.music = new Map();
    this.currentMusic = null;
    this.volume = 0.7;
    this.musicVolume = 0.5;
    this.isMuted = false;
  }

  // Métodos simplificados
  playSound(name) {
    if (this.isMuted) return;
    console.log(`Playing sound: ${name}`);
  }

  playMusic(name) {
    if (this.isMuted) return;
    console.log(`Playing music: ${name}`);
  }

  stopMusic() {
    console.log('Stopping music');
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  mute() {
    this.isMuted = true;
  }

  unmute() {
    this.isMuted = false;
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