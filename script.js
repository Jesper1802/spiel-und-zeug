
const videos = [
  {
    id: "VIDEO_ID_1",
    title: "Smart Home Technik Unfug"
  },
  {
    id: "VIDEO_ID_2",
    title: "Ist mein Netzwerk explodiert?"
  },
  {
    id: "VIDEO_ID_3",
    title: "Briefkasten automatisiert"
  }
];

const videoGrid = document.getElementById("video-grid");
const loadMore = document.getElementById("load-more");

let visibleCount = 0;
const pageSize = 6;

function showMoreVideos() {
  const nextVideos = videos.slice(
    visibleCount,
    visibleCount + pageSize
  );

  nextVideos.forEach(video => {
    const card = document.createElement("a");
    card.className = "video-card";
    card.href = `https://www.youtube.com/watch?v=${video.id}`;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    const image = document.createElement("img");
    image.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
    image.alt = video.title;
    image.loading = "lazy";

    const title = document.createElement("h3");
    title.textContent = video.title;

    card.append(image, title);
    videoGrid.appendChild(card);
  });

  visibleCount += nextVideos.length;

  loadMore.hidden = visibleCount >= videos.length;
}

loadMore.addEventListener("click", showMoreVideos);
showMoreVideos();
