export default async function handler(req, res) {
  // Common headers to mimic a real browser
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Referer': 'https://kick.com/',
    'Origin': 'https://kick.com'
  };

  try {
    // METHOD 1: Try fetching the "Just Chatting" category (High probability of success)
    // We target a subcategory because the main /livestreams endpoint is heavily protected.
    const response = await fetch('https://kick.com/api/v1/subcategories/just-chatting/livestreams', { headers });
    
    let streams = [];
    
    if (response.ok) {
      const data = await response.json();
      streams = data.data || [];
    } else {
      console.warn(`Method 1 failed: ${response.status}`);
      // If Method 1 fails, we can't easily fallback to another API without a proxy.
      // We will proceed to the fallback list below.
    }

    // METHOD 2: Fallback List (Safe Mode)
    // If the API blocks us (403/429), we use a hardcoded list of very popular streamers 
    // who are live almost 24/7 or have valid channels.
    if (!streams || streams.length === 0) {
      console.log("Using Fallback Stream List");
      const fallbackStreamers = [
        "xqc", "adinross", "trainwreckstv", "roshtein", "n3on", 
        "iceposeidon", "ac7ionman", "fousey", "amouranth", "hiko"
      ];
      const randomFallback = fallbackStreamers[Math.floor(Math.random() * fallbackStreamers.length)];
      
      return res.status(200).json({
        success: true,
        url: `https://kick.com/${randomFallback}`,
        streamer: randomFallback,
        viewer_count: "Unknown (API Blocked)",
        thumbnail: null,
        note: "Using fallback list due to API restrictions"
      });
    }

    // Pick a random stream from the fetched list
    const randomIndex = Math.floor(Math.random() * streams.length);
    const randomStream = streams[randomIndex];

    // Extract username (slug)
    const slug = randomStream.slug || randomStream.user?.username || randomStream.username;

    if (!slug) {
      throw new Error("Invalid stream data structure");
    }

    return res.status(200).json({ 
      success: true, 
      url: `https://kick.com/${slug}`,
      streamer: slug,
      viewer_count: randomStream.viewer_count || 0,
      thumbnail: randomStream.thumbnail?.url || null
    });

  } catch (error) {
    console.error("Critical API Error:", error);
    return res.status(500).json({ error: "Failed to connect to Kick.com" });
  }
}
