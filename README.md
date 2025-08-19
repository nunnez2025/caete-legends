# 🏹 Caeté Legends – Edição Brasileira Pro

Jogo de cartas estilo Yu-Gi-Oh! com tema brasileiro, agora migrado para Vite + TypeScript. UI em HTML/CSS, rendering decorativo em Three.js e sistema de personalização integrado.

## 🚀 Como rodar localmente
```bash
npm install
npm run dev
```

Depois, abra o endereço mostrado no terminal (por padrão `http://localhost:5173`).

## 🏗️ Build para produção
```bash
npm run build
npm run preview
```

## 📁 Estrutura
- `index.html`: entrada da app (carrega `/src/main.ts`)
- `src/main.ts`: bootstrap do jogo
- `src/game/`: TypeScript do jogo (`game.ts`, `ui.ts`, `cards.ts`, `three-scene.ts`, `customization.ts`)
- `css/`: estilos (`styles.css`, `customization.css`)
- `src/`: app React de exemplo permanece (não obrigatório)