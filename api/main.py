from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from crewai import Agent, Task, Crew
from typing import Optional
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PageContent(BaseModel):
    url: str
    title: str
    content: str

class AnalysisResponse(BaseModel):
    summary: str

@app.get("/")
def read_root():
    return {"status": "ok", "message": "CrewAI Analysis Service"}

@app.post("/analyze/summarize", response_model=AnalysisResponse)
async def analyze_page(page: PageContent):
    try:
        # Create a researcher agent
        researcher = Agent(
            role='Web Content Researcher',
            goal='Analyze and summarize web content concisely',
            backstory='Expert at analyzing web content and creating concise summaries',
            verbose=True
        )

        # Create a summarization task
        summary_task = Task(
            description=f"""
            Analyze this web page and create a concise summary.
            URL: {page.url}
            Title: {page.title}
            
            Create a clear and informative summary of the main points.
            Focus on the key information and insights.
            Keep the summary concise but comprehensive.
            """,
            agent=researcher
        )

        # Create and run the crew
        crew = Crew(
            agents=[researcher],
            tasks=[summary_task],
            verbose=True
        )

        result = crew.kickoff()
        
        return AnalysisResponse(summary=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
