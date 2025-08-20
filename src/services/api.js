import axios from 'axios';

// API para imagens de arte brasileira
const ART_API_BASE = 'https://api.artic.edu/api/v1';

// API para sons de natureza
const NATURE_SOUNDS_API = 'https://www.freesound.org/api';

// API para dados meteorológicos (para efeitos atmosféricos)
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

class GameAPIService {
  constructor() {
    this.artCache = new Map();
    this.soundCache = new Map();
  }

  // Buscar imagens de arte brasileira
  async getBrazilianArt(query = 'brazil') {
    try {
      const cacheKey = `art_${query}`;
      if (this.artCache.has(cacheKey)) {
        return this.artCache.get(cacheKey);
      }

      const response = await axios.get(`${ART_API_BASE}/artworks/search`, {
        params: {
          q: query,
          limit: 10,
          fields: 'id,title,image_id,artist_title,date_display'
        }
      });

      const artworks = response.data.data.map(artwork => ({
        id: artwork.id,
        title: artwork.title,
        imageUrl: artwork.image_id ? 
          `https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg` : null,
        artist: artwork.artist_title,
        date: artwork.date_display
      }));

      this.artCache.set(cacheKey, artworks);
      return artworks;
    } catch (error) {
      console.error('Erro ao buscar arte brasileira:', error);
      return [];
    }
  }

  // Buscar sons de natureza brasileira
  async getNatureSounds(query = 'brazil rainforest') {
    try {
      const cacheKey = `sound_${query}`;
      if (this.soundCache.has(cacheKey)) {
        return this.soundCache.get(cacheKey);
      }

      // Simulação de sons de natureza (em produção, usar API real)
      const natureSounds = [
        {
          id: 'rainforest_1',
          name: 'Floresta Amazônica',
          url: 'https://www.soundjay.com/misc/sounds/rain-01.mp3',
          type: 'ambient'
        },
        {
          id: 'waterfall_1',
          name: 'Cachoeira',
          url: 'https://www.soundjay.com/misc/sounds/waterfall-1.mp3',
          type: 'water'
        },
        {
          id: 'birds_1',
          name: 'Pássaros Brasileiros',
          url: 'https://www.soundjay.com/misc/sounds/birds-1.mp3',
          type: 'wildlife'
        }
      ];

      this.soundCache.set(cacheKey, natureSounds);
      return natureSounds;
    } catch (error) {
      console.error('Erro ao buscar sons da natureza:', error);
      return [];
    }
  }

  // Buscar dados meteorológicos para efeitos atmosféricos
  async getWeatherData(city = 'São Paulo') {
    try {
      const response = await axios.get(`${WEATHER_API_BASE}/weather`, {
        params: {
          q: city,
          appid: 'demo', // Em produção, usar API key real
          units: 'metric'
        }
      });

      return {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        weather: response.data.weather[0].main,
        description: response.data.weather[0].description
      };
    } catch (error) {
      console.error('Erro ao buscar dados meteorológicos:', error);
      return {
        temperature: 25,
        humidity: 60,
        weather: 'Clear',
        description: 'Céu limpo'
      };
    }
  }

  // Gerar imagens de monstros usando IA (simulação)
  async generateMonsterImage(monsterType, element) {
    try {
      // Em produção, integrar com APIs como DALL-E, Stable Diffusion, etc.
      const prompt = `brazilian folklore ${monsterType} ${element} mystical creature digital art`;
      
      // Simulação de resposta da API
      const mockImages = {
        'Guerreiro Caeté': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        'Curupira': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        'Saci Pererê': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        'Iara': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
      };

      return mockImages[monsterType] || mockImages['Guerreiro Caeté'];
    } catch (error) {
      console.error('Erro ao gerar imagem do monstro:', error);
      return null;
    }
  }

  // Buscar dados de folclore brasileiro
  async getBrazilianFolklore() {
    try {
      // Dados estáticos de folclore brasileiro
      const folklore = [
        {
          name: 'Curupira',
          description: 'Protetor das florestas com pés virados para trás',
          region: 'Amazônia',
          powers: ['Proteção da floresta', 'Confusão de caçadores'],
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        },
        {
          name: 'Saci Pererê',
          description: 'Travesso com uma perna só e gorro vermelho',
          region: 'Sul do Brasil',
          powers: ['Travessuras', 'Velocidade'],
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        },
        {
          name: 'Iara',
          description: 'Sereia sedutora dos rios amazônicos',
          region: 'Amazônia',
          powers: ['Sedução', 'Controle da água'],
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        },
        {
          name: 'Boto Cor-de-Rosa',
          description: 'Golfinho que se transforma em homem sedutor',
          region: 'Amazônia',
          powers: ['Transformação', 'Sedução'],
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        }
      ];

      return folklore;
    } catch (error) {
      console.error('Erro ao buscar folclore brasileiro:', error);
      return [];
    }
  }
}

export const gameAPI = new GameAPIService();