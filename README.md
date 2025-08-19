# 🏹 Caeté Legends – Edição Brasileira Pro

Jogo de cartas estilo Yu-Gi-Oh! com tema brasileiro, criado com HTML, CSS, JS e Three.js. O build e o servidor de desenvolvimento são feitos com Vite.

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
- `index.html`: página do jogo (carrega `three.js` do CDN e `js/game.js`)
- `js/`: lógica do jogo (`game.js`, `three-scene.js`, `ui.js`, `cards.js`, `customization.js`)
- `css/`: estilos (`styles.css`, `customization.css`)
- `src/`: app React de exemplo (base Vite)