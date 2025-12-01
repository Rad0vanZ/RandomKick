document.getElementById("rollBtn").addEventListener("click", async function () {
  const box = document.getElementById("streamBox");
  const loading = document.getElementById("loadingText");
  
  loading.style.display = "block";
  box.style.display = "none";
  
  const channels = await fetchChannel();

  if (channels.length === 0) {
    document.getElementById("streamTitle").textContent = "No streams found";
    document.getElementById("streamUser").textContent = "";
    document.getElementById("streamLink").href = "#";
    box.style.display = "block";
    return;
  }

  const randomchannel = channels[Math.floor(Math.random() * channels.length)];
  const title = await fetchStreamTitle(randomchannel);

  document.getElementById("streamTitle").textContent = title;
  document.getElementById("streamUser").textContent = "Streamer: " + randomchannel;
  document.getElementById("streamLink").href = "https://kick.com/" + randomchannel;
  
  box.style.display = "block";
  loading.style.display = "none";
});

async function fetchChannel() {
  let pagenumber = Math.floor(Math.random() * 30) + 1;
  const pagelimit = Math.min(pagenumber + 7, 40);
  
  const channels = [];
  let morepages = true;

  while (morepages && pagenumber <= pagelimit) {
	  
    const response = await fetch(`https://kick.com/stream/livestreams/en?page=` + pagenumber);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const streamChannels = data.data.map(stream => stream.channel.slug);
    channels.push(...streamChannels);

    morepages = data.to > 0;
    pagenumber++;
  }

  return channels;
}

async function fetchStreamTitle(username) {
  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${username}/videos`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Unexpected API response:", data);
      return "Error fetching livestream";
    }

    const livestream = data.find(video => video.is_live);

    if (!livestream) return "No live stream";

    return livestream.session_title || livestream.slug || "Untitled stream";

  } catch (err) {
    console.error("Error in fetching stream title:", err);
    return "Error fetching livestream";
  }
}