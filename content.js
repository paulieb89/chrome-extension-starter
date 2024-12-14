console.log("Crew AI Content Script Loaded.");

document.body.insertAdjacentHTML('beforeend', `
    <div id="crew-ai-widget" style="position:fixed;bottom:10px;right:10px;background:#fff;border:1px solid #ccc;padding:10px;z-index:10000;">
        <h4>Crew AI Widget</h4>
        <button id="testCrewAI">Run Test</button>
        <div id="crewOutput" style="margin-top:10px;"></div>
    </div>
`);

document.getElementById('testCrewAI').addEventListener('click', () => {
    const outputDiv = document.getElementById('crewOutput');
    outputDiv.innerHTML = "Running Crew AI test...";

    // Simulate Crew AI operation
    setTimeout(() => {
        outputDiv.innerHTML = "Crew AI Test Successful!";
    }, 2000);
});
