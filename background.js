chrome.runtime.onInstalled.addListener(() => {
    console.log('Simple Crew Extension installed!');
});

chrome.runtime.onInstalled.addListener(() => {
    console.log("Crew AI Test Extension installed.");
});

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    });
});
