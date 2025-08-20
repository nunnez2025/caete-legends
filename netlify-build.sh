#!/bin/bash

# Script de build para Netlify
echo "🚀 Iniciando build no Netlify..."

# Configurar npm para usar legacy peer deps
npm config set legacy-peer-deps true

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --legacy-peer-deps

# Executar build
echo "🔨 Executando build..."
npm run build

# Verificar se o build foi bem-sucedido
if [ -d "dist" ]; then
    echo "✅ Build concluído com sucesso!"
    ls -la dist/
else
    echo "❌ Build falhou!"
    exit 1
fi