export default async function handler(req, res) {
  try {
    // Fetch the list of English livestreams
    const response = await fetch('https://kick.com/stream/livestreams/en', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Kick API responded with ${response.status}`);
    }

    const data = await response.json();
    
    // Handle different API response structures
    const streams = data.data || data;

    if (!streams || streams.length === 0) {
      return res.status(404).json({ error: "No live streams found at the moment." });
    }

    // THE ALGORITHM: Pick a random index from the list
    const randomIndex = Math.floor(Math.random() * streams.length);
    const randomStream = streams[randomIndex];

    // Get the username (slug)
    const slug = randomStream.slug || randomStream.user?.username || randomStream.username;

    if (!slug) {
      return res.status(500).json({ error: "Stream data found, but username is missing." });
    }

    // Return the clean data to the frontend
    return res.status(200).json({ 
      success: true, 
      url: `https://kick.com/${slug}`,
      streamer: slug,
      viewer_count: randomStream.viewer_count || 0,
      thumbnail: randomStream.thumbnail?.url || null
    });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Failed to connect to Kick.com" });
  }
}