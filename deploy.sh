#!/bin/bash

# 🚀 Script de Deploy - Caeté Legends
echo "🎮 Iniciando deploy do Caeté Legends..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    print_error "npm não está instalado."
    exit 1
fi

print_status "Verificando dependências..."
npm install

print_status "Executando lint..."
npm run lint

if [ $? -ne 0 ]; then
    print_warning "Lint encontrou problemas. Continuando mesmo assim..."
fi

print_status "Executando build..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build falhou!"
    exit 1
fi

print_success "Build concluído com sucesso!"

# Verificar se a pasta dist foi criada
if [ ! -d "dist" ]; then
    print_error "Pasta dist não foi criada!"
    exit 1
fi

print_status "Verificando arquivos de build..."
ls -la dist/

# Perguntar qual plataforma usar para deploy
echo ""
echo "🌐 Escolha a plataforma de deploy:"
echo "1) Vercel (Recomendado)"
echo "2) Netlify"
echo "3) Docker"
echo "4) Apenas build (sem deploy)"
echo ""

read -p "Digite sua escolha (1-4): " choice

case $choice in
    1)
        print_status "Deployando no Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            print_error "Vercel CLI não está instalado. Instale com: npm install -g vercel"
            exit 1
        fi
        ;;
    2)
        print_status "Deployando no Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod --dir=dist
        else
            print_error "Netlify CLI não está instalado. Instale com: npm install -g netlify-cli"
            exit 1
        fi
        ;;
    3)
        print_status "Deployando com Docker..."
        if command -v docker &> /dev/null; then
            docker build -t caete-legends .
            docker run -p 3000:80 caete-legends
            print_success "Container Docker iniciado na porta 3000"
        else
            print_error "Docker não está instalado."
            exit 1
        fi
        ;;
    4)
        print_success "Build concluído! Arquivos prontos em ./dist"
        print_status "Para fazer deploy manual:"
        echo "  - Vercel: vercel --prod"
        echo "  - Netlify: netlify deploy --prod --dir=dist"
        echo "  - Docker: docker build -t caete-legends . && docker run -p 3000:80 caete-legends"
        ;;
    *)
        print_error "Opção inválida!"
        exit 1
        ;;
esac

print_success "🎉 Deploy concluído com sucesso!"
print_status "Seu jogo Caeté Legends está online!"