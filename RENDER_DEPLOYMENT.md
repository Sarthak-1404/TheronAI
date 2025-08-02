# 🚀 Render Deployment Guide for SmartHealth Chatbot

## Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Verify your email

## Step 2: Deploy from GitHub
1. **Click "New +" in your Render dashboard**
2. **Select "Web Service"**
3. **Connect your GitHub repository**: `https://github.com/Sarthak-1404/TheronAI.git`
4. **Configure the service:**
   - **Name**: `smarthealth-chatbot`
   - **Root Directory**: `backend_chatbot`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python start_chatbot.py`

## Step 3: Environment Variables (Optional)
Add these if needed:
- `PORT`: `5001`
- `FLASK_ENV`: `production`

## Step 4: Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Wait for deployment to complete (2-3 minutes)

## Step 5: Get Your URL
- Your chatbot will be available at: `https://smarthealth-chatbot.onrender.com`
- Health check: `https://smarthealth-chatbot.onrender.com/api/health`

## Step 6: Update Frontend
Once deployed, update your frontend environment variables:
- `VITE_CHATBOT_URL`: `https://smarthealth-chatbot.onrender.com`

---

## 🎯 **Alternative: Heroku Deployment**

If you prefer Heroku:

### Step 1: Install Heroku CLI
```bash
# Download from: https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Create Heroku App
```bash
cd backend_chatbot
heroku create smarthealth-chatbot
```

### Step 3: Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Step 4: Get URL
```bash
heroku open
```

---

## 🎯 **Alternative: PythonAnywhere**

### Step 1: Create Account
1. Go to [pythonanywhere.com](https://pythonanywhere.com)
2. Create free account

### Step 2: Upload Files
1. Upload your `backend_chatbot` folder
2. Install requirements: `pip install -r requirements.txt`

### Step 3: Configure WSGI
Edit `/var/www/yourusername_pythonanywhere_com_wsgi.py`:
```python
import sys
path = '/home/yourusername/backend_chatbot'
if path not in sys.path:
    sys.path.append(path)

from app import app as application
```

### Step 4: Reload
Click "Reload" in Web tab

---

## 🎯 **Current Status**

✅ **Frontend**: Deployed on Vercel  
✅ **Backend**: Deployed on Railway  
🔄 **Chatbot**: Choose your platform above

## 🎯 **Recommended Next Steps**

1. **Deploy to Render** (easiest)
2. **Update frontend environment variables**
3. **Test the complete system**
4. **Share your deployed application!**

---

## 🆘 **Need Help?**

- **Render**: Excellent documentation and support
- **Heroku**: Classic choice, good community
- **PythonAnywhere**: Python-focused, beginner-friendly 