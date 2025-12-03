document.getElementById('kickButton').addEventListener('click', async () => {
    const button = document.getElementById('kickButton');
    const resultDiv = document.getElementById('result');
    const errorP = document.getElementById('error');
    const link = document.getElementById('streamLink');
    const name = document.getElementById('streamerName');
    const viewers = document.getElementById('viewerCount');

    // UI State: Loading
    button.disabled = true;
    button.innerText = "Searching...";
    resultDiv.classList.add('hidden');
    errorP.classList.add('hidden');

    try {
        // Fetch from our internal API (api/random.js)
        const response = await fetch('/api/random');
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        // Update UI with result
        name.innerText = data.streamer;
        link.href = data.url;
        
        if (data.viewer_count && data.viewer_count !== "Unknown (API Blocked)") {
            viewers.innerText = `👁️ ${data.viewer_count} Viewers`;
        } else {
            viewers.innerText = "🔴 Live";
        }

        resultDiv.classList.remove('hidden');

    } catch (err) {
        console.error(err);
        errorP.innerText = "Connection failed. Please try again.";
        errorP.classList.remove('hidden');
    } finally {
        // UI State: Ready
        button.disabled = false;
        button.innerText = "ROLL THE DICE 🎲";
    }
});
