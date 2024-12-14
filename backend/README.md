# CrewAI Page Analysis Backend

FastAPI backend service for Chrome extension that analyzes web pages using CrewAI.

## Environment Variables

Required environment variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Port for the server (default: 8000)

## API Endpoints

- `GET /`: Health check endpoint
- `POST /analyze/summarize`: Analyze and summarize web page content

## Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
uvicorn main:app --reload
```

## Deployment

This service is configured to deploy on Railway using the included Dockerfile.
