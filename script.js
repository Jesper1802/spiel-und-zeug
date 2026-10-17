
const featuredVideo = document.getElementById("featured-video");
const videoGrid = document.getElementById("video-grid");
const loadMore = document.getElementById("load-more");

let olderVideos = [];
let visibleCount = 0;
const pageSize = 6;

// YouTube-Videos laden
async function loadVideos() {
  try {
    const response = await fetch("./videos.json");

    if (!response.ok) {
      throw new Error("Videos konnten nicht geladen werden");
    }

    const videos = await response.json();

    if (videos.length === 0) {
      throw new Error("Keine Videos gefunden");
    }

    // Neuestes Video in Sektion 2
    const latest = videos[0];

    const link = document.createElement("a");
    link.href = latest.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "video-link";

    const image = document.createElement("img");
    image.src = latest.thumbnail;
    image.alt = latest.title;
    image.className = "video-thumbnail";

    link.appendChild(image);

    const label = document.createElement("p");
    label.className = "video-label";
    label.textContent = "NEUESTES VIDEO";

    const title = document.createElement("h3");
    title.textContent = latest.title;

    featuredVideo.replaceChildren(link, label, title);

    // Alle Videos außer dem neuesten
    olderVideos = videos.slice(1);
    showMoreVideos();

  } catch (error) {
    console.error(error);
  }
}

// Weitere Videos anzeigen
function showMoreVideos() {
  const nextVideos = olderVideos.slice(
    visibleCount,
    visibleCount + pageSize
  );

  nextVideos.forEach(video => {
    const card = document.createElement("a");
    card.className = "video-card";
    card.href = video.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    const image = document.createElement("img");
    image.src = video.thumbnail;
    image.alt = video.title;
    image.loading = "lazy";

    const title = document.createElement("h3");
    title.textContent = video.title;

    card.append(image, title);
    videoGrid.appendChild(card);
  });

  visibleCount += nextVideos.length;

  loadMore.hidden = visibleCount >= olderVideos.length;
}

loadMore.addEventListener("click", showMoreVideos);

loadVideos();
