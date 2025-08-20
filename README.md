# 🏹 Caeté Legends - Jogo de Cartas Brasileiro Mobile

Um jogo de cartas épico inspirado no folclore brasileiro, desenvolvido com React, Three.js e design UX/UI sênior para dispositivos móveis.

## ✨ Características

### 🎮 Gameplay
- **Sistema de Cartas**: Monstros e magias baseados no folclore brasileiro
- **Combate Estratégico**: Sistema de turnos com mana e pontos de vida
- **IA Inteligente**: Oponente com comportamento adaptativo
- **Progressão**: Sistema de vitórias, derrotas e sequências

### 🎨 Design & UX
- **Interface Mobile-First**: Otimizada para touch e gestos
- **Gráficos 3D**: Renderização Three.js com efeitos visuais
- **Animações Fluidas**: Transições suaves e feedback visual
- **Responsivo**: Adapta-se a diferentes tamanhos de tela

### 🎵 Áudio & Efeitos
- **Sistema de Áudio Completo**: Músicas e efeitos sonoros
- **APIs Públicas**: Integração com serviços de arte e sons
- **Feedback Sonoro**: Sons para todas as ações do jogo

### 🚀 Tecnologias
- **React 18**: Framework principal
- **Three.js**: Gráficos 3D
- **GSAP**: Animações avançadas
- **Tailwind CSS**: Estilização responsiva
- **Vite**: Build tool otimizado

## 🎯 Como Jogar

### Objetivo
Reduzir os pontos de vida do oponente de 8000 para 0.

### Mecânicas
1. **Mana**: Recurso para jogar cartas (aumenta por turno)
2. **Monstros**: Invocados no campo para atacar
3. **Magias**: Efeitos especiais com custos variados
4. **Turnos**: Alternância entre jogador e IA

### Cartas Brasileiras
- **Guerreiro Caeté**: Valente guerreiro da tribo
- **Curupira**: Protetor das florestas
- **Saci Pererê**: Espírito travesso do vento
- **Iara**: Sereia sedutora dos rios
- **Boto Cor-de-Rosa**: Golfinho mágico amazônico
- **Mapinguari**: Gigante da floresta

## 🛠️ Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/caete-legends.git
cd caete-legends

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📱 Compatibilidade

### Dispositivos Suportados
- **Mobile**: iOS 12+, Android 8+
- **Tablet**: iPad, Android Tablets
- **Desktop**: Chrome, Firefox, Safari, Edge

### Navegadores
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎨 Personalização

### Temas
O jogo suporta temas automáticos baseados nas preferências do sistema:
- Modo Claro/Escuro
- Redução de Movimento (Acessibilidade)
- Alta Densidade de Pixels

### Configurações
- Volume de áudio
- Música de fundo
- Efeitos visuais
- Controles de toque

## 🔧 Desenvolvimento

### Estrutura do Projeto
```
src/
├── components/
│   ├── ui/           # Componentes base
│   ├── 3d/           # Componentes Three.js
│   └── game/         # Lógica do jogo
├── services/
│   ├── api.js        # APIs públicas
│   └── audio.js      # Sistema de áudio
└── styles/
    └── App.css       # Estilos customizados
```

### APIs Integradas
- **Arte Institute of Chicago**: Imagens de arte brasileira
- **OpenWeatherMap**: Dados meteorológicos
- **Freesound**: Sons da natureza
- **Unsplash**: Imagens de alta qualidade

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm run build
git add dist
git commit -m "Build for production"
git subtree push --prefix dist origin gh-pages
```

## 📊 Performance

### Otimizações
- **Code Splitting**: Carregamento sob demanda
- **Lazy Loading**: Componentes 3D carregados quando necessário
- **Asset Optimization**: Imagens e áudios otimizados
- **Bundle Analysis**: Análise de tamanho de pacotes

### Métricas Alvo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- **Folclore Brasileiro**: Inspiração para as criaturas
- **Comunidade React**: Ferramentas e bibliotecas
- **Three.js**: Gráficos 3D incríveis
- **APIs Públicas**: Dados e recursos gratuitos

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/caete-legends/issues)
- **Discord**: [Servidor da Comunidade](https://discord.gg/caete-legends)
- **Email**: suporte@caete-legends.com

---

**Desenvolvido com ❤️ no Brasil** 🇧🇷