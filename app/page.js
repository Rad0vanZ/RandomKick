"use client";

import { useState } from "react";

export default function Home() {
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nsfw, setNsfw] = useState(false);
  const [language, setLanguage] = useState("");

  async function rollStream() {
    setLoading(true);
    setStream(null);

    const res = await fetch(`/api/random?nsfw=${nsfw}&language=${language}`);
    const data = await res.json();

    setLoading(false);
    setStream(data);
  }

  return (
    <>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>🎲 Random Kick Stream</h1>

      <label>
        <input
          type="checkbox"
          checked={nsfw}
          onChange={() => setNsfw(!nsfw)}
        />
        &nbsp; Include 18+ Streams
      </label>

      <br /><br />

      <label>Language: </label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ padding: 6, marginLeft: 10 }}
      >
        <option value="">Any</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="de">German</option>
        <option value="fr">French</option>
        <option value="sr">Serbian</option>
      </select>

      <br /><br />

      <button
        onClick={rollStream}
        style={{
          padding: "12px 20px",
          background: "#39ff14",
          color: "#000",
          fontWeight: "bold",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Roll Random Stream
      </button>

      <br /><br />

      {loading && <p>Loading...</p>}

      {stream && (
        <div style={{ marginTop: 20 }}>
          <h2>{stream.title}</h2>
          <p>Streamer: {stream.username}</p>
          <a
            href={`https://kick.com/${stream.slug}`}
            target="_blank"
            style={{ color: "#39ff14", fontWeight: "bold" }}
          >
            ▶ Open Stream
          </a>
        </div>
      )}
    </>
  );
}