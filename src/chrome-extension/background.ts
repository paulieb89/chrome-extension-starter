import { analyzePageContent } from './services/crewAIService';

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzePage') {
    handlePageAnalysis(request.analysisType, sender.tab?.id)
      .then(sendResponse)
      .catch(error => sendResponse({ error: error instanceof Error ? error.message : 'Unknown error' }));
    return true; // Will respond asynchronously
  }
});

// Handle page analysis request
async function handlePageAnalysis(analysisType: string, tabId?: number) {
  if (!tabId) {
    throw new Error('No active tab found');
  }

  try {
    // Execute content script to get page content
    const [scriptResult] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        // Get main content of the page
        const article = document.querySelector('article');
        const main = document.querySelector('main');
        const content = article || main || document.body;
        
        return {
          title: document.title,
          url: window.location.href,
          content: content.textContent || content.innerText || '',
          metadata: {
            description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
            keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || ''
          }
        };
      }
    });

    if (!scriptResult || !scriptResult.result) {
      throw new Error('Failed to extract page content');
    }

    // Analyze the content using Crew AI
    const analysis = await analyzePageContent(scriptResult.result, analysisType);
    return { success: true, data: analysis };
  } catch (error) {
    console.error('Error analyzing page:', error);
    throw new Error(`Error analyzing page: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
