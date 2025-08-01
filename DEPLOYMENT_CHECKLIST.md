# 🚀 SmartHealth Deployment Checklist

## ✅ Pre-Deployment Setup

- [ ] Git repository initialized and committed
- [ ] GitHub repository created
- [ ] All dependencies installed (`npm run install:all`)
- [ ] Environment variables configured
- [ ] MongoDB Atlas database set up

## 🌐 Frontend Deployment (Vercel)

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Deploy frontend: `cd my-react-app && vercel`
- [ ] Configure environment variables in Vercel dashboard:
  - [ ] `VITE_API_URL` (will be updated after backend deployment)
  - [ ] `VITE_CHATBOT_URL` (will be updated after chatbot deployment)
- [ ] Test frontend deployment

## 🔧 Backend Deployment (Railway)

- [ ] Install Railway CLI: `npm install -g @railway/cli`
- [ ] Deploy backend: `cd backend && railway login && railway init && railway up`
- [ ] Configure environment variables in Railway:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
  - [ ] `MONGODB_URI=your-mongodb-atlas-uri`
  - [ ] `JWT_SECRET=your-jwt-secret`
  - [ ] `EMAIL_USER=your-email`
  - [ ] `EMAIL_PASS=your-email-password`
- [ ] Copy backend URL for frontend environment variables
- [ ] Test backend API endpoints

## 🤖 Chatbot Deployment (Railway)

- [ ] Deploy chatbot: `cd backend_chatbot && railway init && railway up`
- [ ] Configure environment variables in Railway:
  - [ ] `FLASK_ENV=production`
  - [ ] `PORT=5001`
  - [ ] `FLASK_APP=app.py`
- [ ] Copy chatbot URL for frontend environment variables
- [ ] Test chatbot API endpoints

## 🔄 Update Frontend Environment Variables

- [ ] Update `VITE_API_URL` with backend Railway URL
- [ ] Update `VITE_CHATBOT_URL` with chatbot Railway URL
- [ ] Redeploy frontend: `cd my-react-app && vercel --prod`

## 🧪 Final Testing

- [ ] Test frontend functionality
- [ ] Test backend API endpoints
- [ ] Test chatbot functionality
- [ ] Test user authentication
- [ ] Test file uploads/downloads
- [ ] Test real-time features (if any)

## 📊 Monitoring Setup

- [ ] Enable Vercel Analytics
- [ ] Set up Railway monitoring
- [ ] Configure error tracking
- [ ] Set up performance monitoring

## 🔐 Security Verification

- [ ] Environment variables are secure
- [ ] CORS is properly configured
- [ ] API rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Database access is restricted

## 📝 Documentation

- [ ] Update README with deployment URLs
- [ ] Document API endpoints
- [ ] Create user guide
- [ ] Document troubleshooting steps

---

## 🎯 Quick Commands

```bash
# Start all services locally
npm run dev

# Deploy frontend
cd my-react-app && vercel

# Deploy backend
cd backend && railway up

# Deploy chatbot
cd backend_chatbot && railway up

# Test chatbot locally
cd backend_chatbot && python start_chatbot.py
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section in `DEPLOYMENT.md`
2. Review deployment logs in Vercel/Railway dashboards
3. Test services locally first
4. Check environment variables are correctly set 