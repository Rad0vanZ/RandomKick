export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const nsfw = searchParams.get("nsfw") === "true";
  const language = searchParams.get("language") || "";

  const res = await fetch("https://kick.com/api/v2/live/categories");
  const data = await res.json();

  let streams = [];

  for (const cat of data) {
    if (!cat.livestreams) continue;
    for (const s of cat.livestreams) streams.push(s);
  }

  if (!nsfw) streams = streams.filter((s) => s?.tags?.includes("18+") === false);
  if (language) streams = streams.filter((s) => s.language === language);

  if (streams.length === 0) {
    return Response.json({ error: "No streams found" });
  }

  const random = streams[Math.floor(Math.random() * streams.length)];

  return Response.json({
    title: random.session_title,
    username: random.user.username,
    slug: random.slug,
    language: random.language,
  });
}