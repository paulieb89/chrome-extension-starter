import { analyzePageContent } from './services/crewAIService';

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzePage') {
    handlePageAnalysis(sender.tab?.id)
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true; // Will respond asynchronously
  }
});

// Handle page analysis request
async function handlePageAnalysis(tabId?: number) {
  if (!tabId) {
    throw new Error('No active tab found');
  }

  try {
    // Execute content script to get page content
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        // Get main content of the page
        const article = document.querySelector('article');
        const main = document.querySelector('main');
        const content = article || main || document.body;
        
        if (!content) {
          throw new Error('Could not find page content');
        }

        return {
          title: document.title,
          url: window.location.href,
          content: content.innerText
        };
      }
    });

    if (!result) {
      throw new Error('Failed to extract page content');
    }

    // Analyze the content using Crew AI
    const analysis = await analyzePageContent(result);
    return { success: true, data: analysis };
  } catch (error) {
    console.error('Error analyzing page:', error);
    throw error;
  }
}
