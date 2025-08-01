# Medical Chatbot Service

A comprehensive medical chatbot service built with Python Flask that provides detailed information about diseases, symptoms, treatments, and health insurance policies.

## Features

- **Disease Information**: Comprehensive database of medical conditions
- **Symptom Analysis**: Detailed symptom descriptions and causes
- **Treatment Options**: Information about medications and treatments
- **Insurance Queries**: Health insurance policy information
- **Conversational AI**: Natural language processing for health queries
- **Medical Database**: 10,000+ medical conditions and treatments

## Data Sources

- **data.json**: Comprehensive medical conditions database (497KB, 10,862 entries)
- **insurance_policies.json**: Health insurance policy information
- **conversation_data.json**: Conversational patterns and responses
- **medlineplus_articles.txt**: Medical articles and resources

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Chatbot Service
```bash
python start_chatbot.py
```

Or directly:
```bash
python app.py
```

### 3. Test the Service
```bash
# Test direct Python service
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is diabetes?"}'

# Test through Node.js backend
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about asthma"}'
```

## API Endpoints

### POST /api/chat
Send a message to the chatbot.

**Request:**
```json
{
  "message": "What is diabetes?"
}
```

**Response:**
```json
{
  "response": "Diabetes is a chronic condition that affects how your body metabolizes glucose...",
  "status": "success"
}
```

### GET /api/health
Health check endpoint.

### GET /api/capabilities
Get chatbot capabilities and data sources.

## Integration with Node.js Backend

The Python chatbot service integrates with the Node.js backend:

1. **Node.js Backend** (Port 5000): Handles authentication, user management, and other API endpoints
2. **Python Chatbot** (Port 5001): Provides medical information and responses
3. **Integration**: Node.js forwards chatbot requests to Python service

### Flow:
```
Frontend → Node.js Backend → Python Chatbot → Medical Database
```

## Data Structure

### Disease Entry Example:
```json
{
  "Disease": "Diabetes",
  "Explanation": "Chronic condition affecting blood glucose metabolism",
  "Causes": "Genetic factors, lifestyle, obesity",
  "Symptoms": "Increased thirst, frequent urination, fatigue",
  "Treatment": "Diet, exercise, medication, insulin",
  "Medicines": "Metformin, Insulin, Glipizide",
  "Suggestion": "Regular monitoring and lifestyle changes",
  "IsTestOrDoctorRequired": "Yes",
  "DoctorType": "Endocrinologist",
  "Tests": {
    "Name": "Blood glucose test",
    "ApproximateCostINR": "200 to 500"
  }
}
```

## Capabilities

- **Disease Information**: Detailed explanations, causes, symptoms
- **Treatment Options**: Medications, procedures, lifestyle changes
- **Medical Tests**: Test information and approximate costs
- **Doctor Recommendations**: Specialist suggestions for conditions
- **Insurance Queries**: Policy information and coverage details
- **Conversational AI**: Natural language understanding and responses

## Development

### Adding New Data
1. Add entries to `data.json` for new diseases
2. Update `insurance_policies.json` for new policies
3. Add conversational patterns to `conversation_data.json`

### Testing
```bash
# Test Python service directly
python test_chatbot.py

# Test integration with Node.js
node ../backend/test-python-chatbot.js
```

## Troubleshooting

### Common Issues:

1. **Port Already in Use**: Change port in `app.py`
2. **Missing Dependencies**: Run `pip install -r requirements.txt`
3. **Data File Errors**: Ensure all JSON files are valid
4. **Connection Issues**: Check if both services are running

### Logs:
- Python service logs to console
- Check for error messages in terminal output

## Security Notes

- Service runs on localhost only
- No authentication required for demo
- Add proper security for production use
- Validate and sanitize all inputs

## Production Deployment

1. **Environment Variables**: Set production configurations
2. **Security**: Add authentication and rate limiting
3. **Monitoring**: Add logging and health checks
4. **Scaling**: Use WSGI server (Gunicorn) for production
5. **SSL**: Add HTTPS for secure communication

## Support

For issues or questions:
1. Check the logs for error messages
2. Verify all data files are present
3. Test individual components
4. Check network connectivity between services 