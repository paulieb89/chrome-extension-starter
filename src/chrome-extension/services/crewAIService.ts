interface PageContent {
  title: string;
  url: string;
  content: string;
}

interface AnalysisResult {
  summary?: string;
  error?: string;
}

const API_URL = 'https://your-railway-url.railway.app'; // Replace with your Railway URL

export async function analyzePageContent(
  content: PageContent,
  analysisType: string
): Promise<AnalysisResult> {
  try {
    const response = await fetch(`${API_URL}/analyze/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { summary: data.summary };
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}

// TODO: Implement these functions with actual Crew AI integration
export async function createCrewAIAgent() {
  // Will implement actual Crew AI agent creation
}

export async function runCrewAITask(agent: any, task: string) {
  // Will implement actual Crew AI task execution
}
