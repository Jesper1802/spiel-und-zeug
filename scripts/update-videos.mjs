
import { writeFile } from "node:fs/promises";

const API_KEY = process.env.YOUTUBE_API_KEY;
const HANDLE = "spielundzeug";

if (!API_KEY) {
  throw new Error("YOUTUBE_API_KEY fehlt");
}

async function youtube(endpoint, params) {
  const url = new URL(
    `https://www.googleapis.com/youtube/v3/${endpoint}`
  );

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  url.searchParams.set("key", API_KEY);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `YouTube API Fehler: ${response.status} ${await response.text()}`
    );
  }

  return response.json();
}

// Kanal anhand des Handles ermitteln
const channel = await youtube("channels", {
  part: "contentDetails",
  forHandle: HANDLE
});

const uploadsPlaylist =
  channel.items?.[0]?.contentDetails
    ?.relatedPlaylists?.uploads;

if (!uploadsPlaylist) {
  throw new Error("Uploads-Playlist nicht gefunden");
}

// Alle Videos seitenweise abrufen
const videos = [];
let pageToken;

do {
  const data = await youtube("playlistItems", {
    part: "snippet",
    playlistId: uploadsPlaylist,
    maxResults: "50",
    ...(pageToken ? { pageToken } : {})
  });

  for (const item of data.items ?? []) {
    const snippet = item.snippet;
    const id = snippet?.resourceId?.videoId;

    if (!id || !snippet?.title ||
        snippet.title === "Private video" ||
        snippet.title === "Deleted video") {
      continue;
    }

    videos.push({
      id,
      title: snippet.title,
      thumbnail:
        snippet.thumbnails?.high?.url ??
        snippet.thumbnails?.medium?.url ??
        `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      publishedAt: snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${id}`
    });
  }

  pageToken = data.nextPageToken;
} while (pageToken);

// Neueste Uploads zuerst
videos.sort(
  (a, b) =>
    new Date(b.publishedAt) - new Date(a.publishedAt)
);

await writeFile(
  "videos.json",
  JSON.stringify(videos, null, 2) + "\n"
);

console.log(`${videos.length} Videos gespeichert`);
