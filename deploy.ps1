# SmartHealth Deployment Script for Windows PowerShell
Write-Host "🚀 Starting SmartHealth deployment..." -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: SmartHealth Healthcare System"
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm run install:all

# Build frontend
Write-Host "🔨 Building frontend..." -ForegroundColor Yellow
Set-Location my-react-app
npm run build
Set-Location ..

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "📥 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Deploy frontend to Vercel
Write-Host "🌐 Deploying frontend to Vercel..." -ForegroundColor Yellow
Set-Location my-react-app
vercel --prod --yes
Set-Location ..

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Deploy backend to Railway/Render/Heroku" -ForegroundColor White
Write-Host "2. Deploy chatbot to Railway/Render" -ForegroundColor White
Write-Host "3. Update environment variables in Vercel" -ForegroundColor White
Write-Host "4. Test the deployed application" -ForegroundColor White 