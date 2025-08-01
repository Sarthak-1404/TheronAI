# 🚀 Deployment Guide

This guide will help you deploy your SmartHealth application to production.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free) or Render account (free)
- MongoDB Atlas account (free)

## 🎯 Deployment Strategy

We'll deploy each component separately:

1. **Frontend (React)** → Vercel
2. **Backend (Node.js)** → Railway/Render
3. **Chatbot (Python)** → Railway/Render

## 📦 Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: SmartHealth Healthcare System"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it `smarthealth-final`
4. Make it public or private
5. Don't initialize with README (we already have one)

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/smarthealth-final.git
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Deploy Frontend
```bash
cd my-react-app
vercel
```

Follow the prompts:
- Set up and deploy: `Y`
- Which scope: Select your account
- Link to existing project: `N`
- Project name: `smarthealth-frontend`
- Directory: `./` (current directory)
- Override settings: `N`

### 2.3 Configure Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add these variables:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   VITE_CHATBOT_URL=https://your-chatbot-url.railway.app
   ```

## 🔧 Step 3: Deploy Backend to Railway

### 3.1 Install Railway CLI
```bash
npm install -g @railway/cli
```

### 3.2 Deploy Backend
```bash
cd backend
railway login
railway init
railway up
```

### 3.3 Configure Environment Variables
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your backend project
3. Go to Variables tab
4. Add all variables from `config.env.example`:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-jwt-secret
   EMAIL_USER=your-email
   EMAIL_PASS=your-email-password
   ```

### 3.4 Get Backend URL
- Railway will provide a URL like: `https://your-app-name.railway.app`
- Copy this URL for the frontend environment variables

## 🤖 Step 4: Deploy Chatbot to Railway

### 4.1 Deploy Python Chatbot
```bash
cd backend_chatbot
railway init
railway up
```

### 4.2 Configure Environment Variables
Add these to Railway:
```
FLASK_ENV=production
PORT=5001
```

### 4.3 Get Chatbot URL
- Copy the Railway URL for the chatbot
- Update frontend environment variables

## 🔄 Step 5: Update Frontend Environment Variables

### 5.1 Update Vercel Environment Variables
1. Go to Vercel Dashboard
2. Select your frontend project
3. Go to Settings → Environment Variables
4. Update with your actual URLs:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   VITE_CHATBOT_URL=https://your-chatbot-url.railway.app
   ```

### 5.2 Redeploy Frontend
```bash
cd my-react-app
vercel --prod
```

## 🧪 Step 6: Test Your Deployment

### 6.1 Test Frontend
- Visit your Vercel URL
- Test all features
- Check console for errors

### 6.2 Test Backend API
```bash
curl https://your-backend-url.railway.app/api/health
```

### 6.3 Test Chatbot
```bash
curl -X POST https://your-chatbot-url.railway.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

## 🔧 Step 7: Domain Setup (Optional)

### 7.1 Custom Domain for Frontend
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain

### 7.2 Custom Domain for Backend
1. Go to Railway Dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain

## 📊 Step 8: Monitoring and Analytics

### 8.1 Vercel Analytics
- Enable Vercel Analytics in your project
- Monitor performance and errors

### 8.2 Railway Monitoring
- Use Railway's built-in monitoring
- Set up alerts for downtime

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for your frontend domain
   - Check environment variables

2. **Environment Variables Not Working**
   - Redeploy after adding environment variables
   - Check variable names (case-sensitive)

3. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings

4. **Build Failures**
   - Check build logs in Vercel/Railway
   - Ensure all dependencies are installed

### Debug Commands
```bash
# Check frontend build locally
cd my-react-app
npm run build

# Test backend locally
cd backend
npm start

# Test chatbot locally
cd backend_chatbot
python app.py
```

## 📈 Step 9: Performance Optimization

### 9.1 Frontend Optimization
- Enable Vercel's automatic optimizations
- Use React.lazy() for code splitting
- Optimize images

### 9.2 Backend Optimization
- Enable Railway's auto-scaling
- Use caching where appropriate
- Monitor database performance

## 🔐 Step 10: Security Checklist

- [ ] Environment variables are set
- [ ] JWT secrets are strong
- [ ] CORS is properly configured
- [ ] API rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Database access is restricted

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review deployment logs
3. Open an issue in your GitHub repository
4. Contact platform support (Vercel/Railway)

---

🎉 **Congratulations!** Your SmartHealth application is now deployed and ready for production use. 