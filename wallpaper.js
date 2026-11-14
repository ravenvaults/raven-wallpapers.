
const params = new URLSearchParams(location.search);
const wallpaperId = params.get("id");

const wallpaper = wallpapers.find(w => w.id === wallpaperId);
const container = document.querySelector("#wallpaperDetails");

if (container) {
  if (!wallpaper) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>Wallpaper not found.</h2>
        <a href="gallery.html">Return to archive →</a>
      </div>
    `;
  } else {
    document.title = `${wallpaper.title} — RAVEN`;

    const layout = document.createElement("div");
    layout.className = "detail-layout";

    const preview = document.createElement("div");
    preview.className = "detail-preview";

    if (wallpaper.type === "phone") {
      preview.classList.add("phone");
    }

    const image = document.createElement("img");
    image.src = wallpaper.image;
    image.alt = wallpaper.title;

    preview.appendChild(image);

    const info = document.createElement("div");
    info.className = "detail-info";

    const category = document.createElement("p");
    category.className = "detail-category";
    category.textContent = `${wallpaper.category} / RAVEN ARCHIVE`;

    const title = document.createElement("h1");
    title.textContent = wallpaper.title;

    const description = document.createElement("p");
    description.textContent = wallpaper.description;

    const format = document.createElement("p");
    format.className = "detail-format";
    format.textContent =
      wallpaper.type === "phone"
      ? "PHONE WALLPAPER"
      : "DESKTOP WALLPAPER";

    const download = document.createElement("a");
    download.className = "download-button";
    download.href = wallpaper.image;
    download.download = `${wallpaper.id}.jpg`;
    download.textContent = "DOWNLOAD WALLPAPER ↗";

    info.append(category,title,description,format,download);
    layout.append(preview,info);

    container.replaceChildren(layout);
  }
}
