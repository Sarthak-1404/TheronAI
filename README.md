# SmartHealth Healthcare Management System

A comprehensive healthcare management system built with React, Node.js, and Python chatbot integration.

## 🏗️ Project Structure

```
├── my-react-app/          # React frontend (Vite)
├── backend/               # Node.js/Express API
├── backend_chatbot/       # Python Flask chatbot
└── README.md             # This file
```

## 🚀 Features

- **Frontend**: Modern React application with Vite
- **Backend**: RESTful API with Express.js and MongoDB
- **Chatbot**: AI-powered medical chatbot with Python/Flask
- **Authentication**: JWT-based user authentication
- **Real-time**: Socket.io for real-time features
- **File Management**: PDF generation and Excel export

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- Three.js (3D graphics)
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.io
- JWT Authentication
- Multer (File uploads)
- PDFKit (PDF generation)
- ExcelJS (Excel export)

### Chatbot
- Python
- Flask
- Natural Language Processing

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- Python 3.8+
- MongoDB

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smarthealth-final
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   
   Create `.env` files in the backend directory:
   ```bash
   cd backend
   cp config.env.example config.env
   ```
   
   Update the environment variables in `backend/config.env`

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run dev:frontend
   npm run dev:backend
   ```

## 🌐 Deployment

### Frontend (Vercel)

1. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy from the my-react-app directory
   cd my-react-app
   vercel
   ```

2. **Environment Variables**
   - Add your backend API URL to Vercel environment variables
   - Set `VITE_API_URL` to your backend deployment URL

### Backend (Railway/Render/Heroku)

1. **Deploy to Railway**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Deploy from the backend directory
   cd backend
   railway login
   railway init
   railway up
   ```

2. **Environment Variables**
   - Add all variables from `config.env` to your deployment platform
   - Set `NODE_ENV=production`

### Chatbot (Railway/Render)

1. **Deploy Python chatbot**
   ```bash
   cd backend_chatbot
   # Deploy to Railway or Render
   ```

## 🔧 Configuration

### Frontend Environment Variables
Create `.env` in `my-react-app/`:
```env
VITE_API_URL=http://localhost:5000
VITE_CHATBOT_URL=http://localhost:5001
```

### Backend Environment Variables
See `backend/config.env.example` for all required variables.

## 📱 Usage

1. **Start the application**
   ```bash
   npm run dev
   ```

2. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Chatbot: http://localhost:5001

## 🧪 Testing

```bash
# Test backend API
cd backend
npm run test-api

# Test chatbot
cd backend_chatbot
python test_chatbot.py
```

## 📁 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Healthcare Management
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Chatbot
- `POST /api/chatbot/chat` - Send message to chatbot

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository. 