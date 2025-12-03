document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('streamGrid');
    const status = document.getElementById('status-text');

    try {
        const response = await fetch('/api/browse');
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        // Update status text
        if (data.is_fallback) {
            status.innerHTML = `<span style="color:#ff4d4d">API Limited. Showing Featured Streamers.</span>`;
        } else {
            status.innerText = `Found ${data.streams.length} live streams`;
        }

        grid.innerHTML = ''; // Clear loading state

        data.streams.forEach(stream => {
            // Create Card Element
            const card = document.createElement('a');
            card.className = 'stream-card';
            card.href = `https://kick.com/${stream.slug}`;
            card.target = '_blank';

            // Handle missing thumbnails
            const thumbUrl = stream.thumbnail || 'https://files.kick.com/images/user/default/profile_image/conversion/default-fullsize.webp';

            // Build Card HTML
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${thumbUrl}" alt="${stream.username}" loading="lazy">
                    <div class="card-viewers">🔴 ${formatViewers(stream.viewer_count)}</div>
                </div>
                <div class="card-info">
                    <h3 class="card-username">${stream.username}</h3>
                    <p class="card-title">${stream.title || 'No Title'}</p>
                </div>
            `;

            grid.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        status.innerText = "Failed to load streams. Please refresh.";
        status.style.color = "#ff4d4d";
    }
});

// Helper to format viewer numbers (e.g., 1500 -> 1.5k)
function formatViewers(num) {
    if (!num) return '0';
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num;
}
