export default async function handler(req, res) {
  // Mimic browser headers to avoid 403 Forbidden
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Referer': 'https://kick.com/',
    'Origin': 'https://kick.com'
  };

  try {
    // Attempt to fetch from the "Just Chatting" directory (usually most populated)
    // We request a larger limit to get a good grid of streamers
    const response = await fetch('https://kick.com/api/v1/subcategories/just-chatting/livestreams?limit=100', { headers });
    
    let streams = [];
    
    if (response.ok) {
      const data = await response.json();
      streams = data.data || [];
    } else {
      console.warn(`Kick API Blocked/Failed: ${response.status}`);
      // Fallback behavior handles empty array below
    }

    // FALLBACK MODE: If API returns nothing (blocked), return a mocked list of popular streamers
    // so the page doesn't look broken.
    if (!streams || streams.length === 0) {
      const fallbackStreamers = [
        { slug: "xqc", user: { username: "xQc" }, viewer_count: 50000, thumbnail: { url: "https://files.kick.com/images/user/676/profile_image/conversion/931b4e8f-5445-427c-bd82-b473530390cc-fullsize.webp" }, session_title: "GAMING WARLORD" },
        { slug: "adinross", user: { username: "Adin Ross" }, viewer_count: 45000, thumbnail: { url: "https://files.kick.com/images/user/1086/profile_image/conversion/e1f35d25-78c6-4d05-b040-349ba7c4c346-fullsize.webp" }, session_title: "E-DATE !!!" },
        { slug: "trainwreckstv", user: { username: "Trainwreckstv" }, viewer_count: 25000, thumbnail: { url: "https://files.kick.com/images/user/2/profile_image/conversion/1218820c-c76b-4e63-841c-b715764d7883-fullsize.webp" }, session_title: "GAMBA GOD" },
        { slug: "n3on", user: { username: "N3on" }, viewer_count: 15000, thumbnail: { url: "https://files.kick.com/images/user/269700/profile_image/conversion/f255794a-3870-4389-bd0f-155b40026217-fullsize.webp" }, session_title: "IRL MADNESS" },
        { slug: "roshtein", user: { username: "Roshtein" }, viewer_count: 18000, thumbnail: { url: "https://files.kick.com/images/user/248/profile_image/conversion/54756314-8789-42b4-8255-a4f669a8b139-fullsize.webp" }, session_title: "FULL SEND" },
        { slug: "iceposeidon", user: { username: "Ice Poseidon" }, viewer_count: 12000, thumbnail: { url: "https://files.kick.com/images/user/536254/profile_image/conversion/7e77732a-d98c-4b68-809b-6486022839b8-fullsize.webp" }, session_title: "CX IRL" }
      ];
      
      return res.status(200).json({
        success: true,
        streams: fallbackStreamers,
        is_fallback: true
      });
    }

    // Map the real data to a clean format
    const cleanStreams = streams.map(s => ({
      slug: s.slug,
      username: s.user?.username || s.slug,
      title: s.session_title,
      viewer_count: s.viewer_count,
      thumbnail: s.thumbnail?.url,
      category: "Just Chatting" // hardcoded since we fetched from this endpoint
    }));

    return res.status(200).json({ 
      success: true, 
      streams: cleanStreams,
      is_fallback: false
    });

  } catch (error) {
    console.error("Browse API Error:", error);
    return res.status(500).json({ error: "Failed to fetch streams" });
  }
}
