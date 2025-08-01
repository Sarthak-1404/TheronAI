# Quick Setup Guide

## Prerequisites

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/

2. **MongoDB** (local or cloud)
   - Local: Download from https://www.mongodb.com/try/download/community
   - Cloud: Use MongoDB Atlas (free tier available)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy the example config file
cp config.env.example config.env

# Edit the config file with your settings
# At minimum, update:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (generate a strong secret key)
```

### 3. Start MongoDB
**Local MongoDB:**
```bash
# Start MongoDB service
mongod
```

**MongoDB Atlas:**
- Create a free account at https://www.mongodb.com/atlas
- Create a cluster
- Get your connection string
- Update `MONGODB_URI` in `config.env`

### 4. Start the Server

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

**Test the API:**
```bash
npm test
```

## API Testing

Once the server is running, you can test the API:

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Demo Login
```bash
curl -X POST http://localhost:5000/api/auth/demo-login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@123", "password": "user123"}'
```

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345",
      "country": "USA"
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phoneNumber": "+1234567891"
    }
  }'
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment | No | development |
| `MONGODB_URI` | MongoDB connection string | **Yes** | - |
| `JWT_SECRET` | JWT signing secret | **Yes** | - |
| `JWT_EXPIRE` | JWT expiration time | No | 7d |
| `EMAIL_HOST` | SMTP server host | No | - |
| `EMAIL_PORT` | SMTP server port | No | 587 |
| `EMAIL_USER` | Email username | No | - |
| `EMAIL_PASS` | Email password | No | - |
| `OPENAI_API_KEY` | OpenAI API key | No | - |
| `UPLOAD_PATH` | File upload directory | No | ./uploads |
| `MAX_FILE_SIZE` | Max file size in bytes | No | 5242880 |
| `RATE_LIMIT_WINDOW` | Rate limit window (minutes) | No | 15 |
| `RATE_LIMIT_MAX` | Max requests per window | No | 100 |

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string
- For Atlas, whitelist your IP address

### Port Already in Use
- Change the `PORT` in `config.env`
- Or kill the process using the port

### JWT Issues
- Generate a strong secret key
- Ensure `JWT_SECRET` is set

### File Upload Issues
- Create the `uploads` directory
- Check file permissions
- Verify `MAX_FILE_SIZE` setting

## Next Steps

1. **Frontend Integration**: Connect your React frontend to the API
2. **Email Setup**: Configure email for notifications
3. **OpenAI Setup**: Add your API key for chatbot features
4. **Production Deployment**: Set up SSL, environment variables, and monitoring

## Support

- Check the main README.md for detailed documentation
- Review the API endpoints in the README
- Test the API using the provided test script 