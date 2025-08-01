# Healthcare Management System - Backend API

A comprehensive backend API for a healthcare management system built with Node.js, Express, and MongoDB.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user registration, profile management, and account settings
- **Doctor Management**: Doctor profiles, specializations, and availability
- **Appointment System**: Schedule, manage, and track appointments
- **Health Records**: Comprehensive medical record management
- **Chat System**: Real-time messaging between patients and doctors
- **AI Chatbot**: Custom knowledge base-powered medical assistant
- **Emergency Services**: Emergency contact and alert system
- **Export Functionality**: Export health records and appointments as PDF/Excel
- **File Upload**: Support for medical documents and images
- **Real-time Notifications**: Socket.io for live updates

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **File Upload**: Multer
- **Documentation**: PDFKit, ExcelJS
- **AI Integration**: Custom Knowledge Base
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `config.env.example` to `config.env`
   - Update the environment variables with your values:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/healthcare_system

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # OpenAI Configuration (optional)
# OPENAI_API_KEY=your-openai-api-key

   # File Upload Configuration
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=5242880

   # Rate Limiting
   RATE_LIMIT_WINDOW=15
   RATE_LIMIT_MAX=100
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Login user | Public |
| POST | `/demo-login` | Demo login for testing | Public |
| POST | `/forgot-password` | Send password reset email | Public |
| POST | `/reset-password` | Reset password with token | Public |
| POST | `/change-password` | Change password | Private |
| POST | `/logout` | Logout user | Private |
| GET | `/me` | Get current user | Private |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/profile` | Get user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| GET | `/profile/:id` | Get user by ID | Private |
| DELETE | `/profile` | Delete user account | Private |
| PUT | `/preferences` | Update user preferences | Private |
| POST | `/upload-avatar` | Upload profile image | Private |

### Doctor Routes (`/api/doctors`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all doctors | Public |
| GET | `/:id` | Get doctor by ID | Public |
| POST | `/` | Create doctor profile | Private |
| PUT | `/:id` | Update doctor profile | Private |
| DELETE | `/:id` | Delete doctor profile | Private |
| GET | `/specialization/:specialization` | Get doctors by specialization | Public |
| GET | `/available` | Get available doctors | Public |

### Appointment Routes (`/api/appointments`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get user appointments | Private |
| POST | `/` | Create appointment | Private |
| GET | `/:id` | Get appointment by ID | Private |
| PUT | `/:id` | Update appointment | Private |
| DELETE | `/:id` | Cancel appointment | Private |
| PUT | `/:id/status` | Update appointment status | Private |
| GET | `/doctor/:doctorId` | Get doctor's appointments | Private |
| GET | `/upcoming` | Get upcoming appointments | Private |

### Health Records Routes (`/api/health-records`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get user health records | Private |
| POST | `/` | Create health record | Private |
| GET | `/:id` | Get health record by ID | Private |
| PUT | `/:id` | Update health record | Private |
| DELETE | `/:id` | Delete health record | Private |
| GET | `/patient/:patientId` | Get patient health records | Private |
| POST | `/upload` | Upload medical documents | Private |

### Chat Routes (`/api/chat`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/conversations` | Get user conversations | Private |
| GET | `/messages/:conversationId` | Get conversation messages | Private |
| POST | `/messages` | Send message | Private |
| GET | `/unread` | Get unread message count | Private |
| PUT | `/messages/:messageId/read` | Mark message as read | Private |

### Chatbot Routes (`/api/chatbot`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/chat` | Send message to AI chatbot | Public |
| GET | `/symptoms` | Get symptom checker | Public |
| POST | `/diagnosis` | Get AI diagnosis | Public |

### Emergency Routes (`/api/emergency`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/alert` | Send emergency alert | Public |
| GET | `/contacts/:userId` | Get emergency contacts | Private |
| POST | `/contacts` | Add emergency contact | Private |
| PUT | `/contacts/:id` | Update emergency contact | Private |
| DELETE | `/contacts/:id` | Delete emergency contact | Private |

### Export Routes (`/api/export`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/health-records/:userId` | Export health records (PDF/Excel) | Private |
| GET | `/appointments/:userId` | Export appointments (PDF/Excel) | Private |
| GET | `/medical-summary/:userId` | Export medical summary (PDF/Excel) | Private |

## Data Models

### User Model
- Personal information (name, email, phone, DOB, gender)
- Address and emergency contact
- Medical history (allergies, conditions, medications)
- Insurance information
- Preferences and settings

### Doctor Model
- Professional information (name, email, phone)
- Specialization and qualifications
- Availability schedule
- Profile image and bio

### Appointment Model
- Patient and doctor references
- Appointment date and time
- Type and status
- Reason and notes

### Health Record Model
- Patient and doctor references
- Diagnosis and treatment
- Vital signs and measurements
- Attachments and notes

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## File Upload

The API supports file uploads for:
- Profile images
- Medical documents
- Health record attachments

Files are stored in the `uploads/` directory and served statically.

## Real-time Features

### Socket.io Events

**Client to Server:**
- `join` - Join user's personal room
- `send_message` - Send chat message
- `typing` - User typing indicator
- `stop_typing` - Stop typing indicator

**Server to Client:**
- `receive_message` - Receive chat message
- `user_typing` - User typing status
- `notification` - Real-time notifications

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Express-validator
- **Password Hashing**: bcryptjs
- **JWT**: Secure authentication

## Error Handling

The API uses a centralized error handling middleware that returns consistent error responses:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [] // Validation errors
}
```

## Success Responses

All successful responses follow this format:

```json
{
  "status": "success",
  "message": "Operation successful",
  "data": {} // Response data
}
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Environment Variables
- `NODE_ENV`: Set to 'development' for development mode
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRE`: JWT token expiration time
- `EMAIL_HOST`: SMTP server host
- `EMAIL_PORT`: SMTP server port
- `EMAIL_USER`: Email username
- `EMAIL_PASS`: Email password
- `OPENAI_API_KEY`: OpenAI API key
- `UPLOAD_PATH`: File upload directory
- `MAX_FILE_SIZE`: Maximum file size in bytes
- `RATE_LIMIT_WINDOW`: Rate limiting window in minutes
- `RATE_LIMIT_MAX`: Maximum requests per window

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set strong JWT secret
4. Configure proper CORS origins
5. Set up SSL/TLS certificates
6. Use a process manager like PM2

## API Documentation

For detailed API documentation, you can use tools like:
- Postman
- Swagger/OpenAPI
- Insomnia

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please contact the development team or create an issue in the repository. 