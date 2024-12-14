chrome.runtime.onInstalled.addListener(() => {
    console.log("Crew AI Test Extension installed.");
});

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    });
});
