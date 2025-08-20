# 🚀 Guia de Deploy - Caeté Legends

## ✅ Build Local

Primeiro, teste o build localmente:

```bash
npm run build
```

Se o build for bem-sucedido, você verá uma mensagem como:
```
✓ built in 4.24s
```

## 🌐 Deploy no Vercel (Recomendado)

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Fazer Login
```bash
vercel login
```

### 3. Deploy
```bash
vercel --prod
```

### 4. Configuração Automática
O Vercel detectará automaticamente:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

## 🌐 Deploy no Netlify

### 1. Via Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### 2. Via Interface Web
1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta `dist` para a área de deploy
3. Ou conecte seu repositório GitHub

## 🐳 Deploy com Docker

### 1. Build da Imagem
```bash
docker build -t caete-legends .
```

### 2. Executar Container
```bash
docker run -p 3000:80 caete-legends
```

### 3. Docker Compose
```bash
docker-compose up app-prod
```

## 📱 Deploy no GitHub Pages

### 1. Configurar GitHub Actions
O arquivo `.github/workflows/deploy.yml` já está configurado.

### 2. Configurar Secrets
No seu repositório GitHub, vá em Settings > Secrets e adicione:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### 3. Push para Main
```bash
git add .
git commit -m "Deploy ready"
git push origin main
```

## 🔧 Solução de Problemas

### Erro: "Module not found"
```bash
npm install
npm run build
```

### Erro: "Build failed"
1. Verifique se todas as dependências estão instaladas
2. Execute `npm run lint` para verificar erros
3. Verifique se não há imports quebrados

### Erro: "Port already in use"
```bash
# Encontre o processo
lsof -i :3000

# Mate o processo
kill -9 <PID>
```

### Erro: "Memory limit exceeded"
1. Otimize as imagens
2. Reduza o tamanho do bundle
3. Use lazy loading

## 📊 Verificação Pós-Deploy

### 1. Teste Funcional
- [ ] Menu principal carrega
- [ ] Botão "Iniciar Duelo" funciona
- [ ] Cartas são distribuídas
- [ ] Jogo funciona corretamente

### 2. Teste de Performance
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s

### 3. Teste Mobile
- [ ] Interface responsiva
- [ ] Touch funciona
- [ ] Orientação landscape/portrait

## 🔄 Atualizações

### Deploy Automático
Configure webhooks para deploy automático quando fizer push para `main`.

### Rollback
Mantenha versões anteriores para rollback rápido se necessário.

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do build
2. Teste localmente primeiro
3. Verifique a documentação da plataforma
4. Abra uma issue no GitHub

---

**🎉 Seu jogo Caeté Legends está pronto para ser jogado online!**