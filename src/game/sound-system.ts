// Sistema de áudio avançado para o jogo
export class SoundSystem {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private musicVolume: number = 0.7;
  private sfxVolume: number = 0.8;
  private currentMusic: AudioBufferSourceNode | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Áudio não suportado neste navegador');
    }
  }

  // Simular sons do jogo (em produção seria carregado de arquivos)
  private generateTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate;
      let sample = 0;

      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * time);
          break;
        case 'square':
          sample = Math.sin(2 * Math.PI * frequency * time) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          sample = 2 * (time * frequency - Math.floor(0.5 + time * frequency));
          break;
        case 'triangle':
          sample = 2 * Math.abs(2 * (time * frequency - Math.floor(0.5 + time * frequency))) - 1;
          break;
      }

      // Aplicar envelope ADSR simples
      const envelope = Math.exp(-time * 3);
      data[i] = sample * envelope * 0.3;
    }

    return buffer;
  }

  // Carregar sons do jogo
  public loadSounds() {
    if (!this.audioContext) return;

    const soundDefinitions = {
      'draw_card': { freq: 800, duration: 0.2, type: 'sine' as OscillatorType },
      'summon': { freq: 400, duration: 0.5, type: 'square' as OscillatorType },
      'attack': { freq: 200, duration: 0.3, type: 'sawtooth' as OscillatorType },
      'battle': { freq: 150, duration: 0.6, type: 'square' as OscillatorType },
      'cast_spell': { freq: 600, duration: 0.4, type: 'triangle' as OscillatorType },
      'end_turn': { freq: 300, duration: 0.3, type: 'sine' as OscillatorType },
      'victory': { freq: 800, duration: 1.0, type: 'sine' as OscillatorType },
      'defeat': { freq: 100, duration: 1.0, type: 'sawtooth' as OscillatorType }
    };

    Object.entries(soundDefinitions).forEach(([name, config]) => {
      const buffer = this.generateTone(config.freq, config.duration, config.type);
      if (buffer) {
        this.sounds.set(name, buffer);
      }
    });
  }

  // Tocar som
  public playSound(soundName: string) {
    if (!this.audioContext || !this.sounds.has(soundName)) return;

    try {
      const buffer = this.sounds.get(soundName);
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = this.sfxVolume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start();
    } catch (error) {
      console.warn(`Erro ao tocar som ${soundName}:`, error);
    }
  }

  // Tocar música de fundo (simulada)
  public playMusic(musicName: string) {
    console.log(`🎵 Tocando música: ${musicName}`);
    // Em produção, carregaria e tocaria arquivos de música real
  }

  // Controlar volume
  public setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  // Parar toda música
  public stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }
}

// Instância global do sistema de som
export const soundSystem = new SoundSystem();