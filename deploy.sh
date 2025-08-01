#!/bin/bash

# SmartHealth Deployment Script
echo "🚀 Starting SmartHealth deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: SmartHealth Healthcare System"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build frontend
echo "🔨 Building frontend..."
cd my-react-app
npm run build
cd ..

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy frontend to Vercel
echo "🌐 Deploying frontend to Vercel..."
cd my-react-app
vercel --prod --yes
cd ..

echo "✅ Deployment completed!"
echo "📋 Next steps:"
echo "1. Deploy backend to Railway/Render/Heroku"
echo "2. Deploy chatbot to Railway/Render"
echo "3. Update environment variables in Vercel"
echo "4. Test the deployed application" 