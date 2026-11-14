
const galleryGrid = document.querySelector("#galleryGrid");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll("[data-filter]");
const resultCount = document.querySelector("#resultCount");

const params = new URLSearchParams(location.search);
let activeFilter = params.get("category") || "all";

const categories = ["all","Urban","Abstract","Quotes"];

if (!categories.some(c => c.toLowerCase() === activeFilter.toLowerCase())) {
  activeFilter = "all";
}

function renderGallery() {
  const search = searchInput.value.trim().toLowerCase();

  const results = wallpapers.filter(w => {
    const categoryMatch =
      activeFilter === "all" ||
      w.category.toLowerCase() === activeFilter.toLowerCase();

    const searchable = [
      w.title,
      w.category,
      w.description,
      ...w.tags
    ].join(" ").toLowerCase();

    return categoryMatch && searchable.includes(search);
  });

  galleryGrid.innerHTML = results.map(w => `
    <a class="gallery-card"
       data-type="${w.type}"
       href="wallpaper.html?id=${encodeURIComponent(w.id)}">

      <div class="gallery-image">
        <img src="${w.image}"
             alt="${w.title}"
             loading="lazy">
      </div>

      <div class="gallery-info">
        <span>${w.category.toUpperCase()} / ${w.type.toUpperCase()}</span>
        <h3>${w.title}</h3>
        <p>${w.description}</p>
      </div>

    </a>
  `).join("");

  resultCount.textContent = `${results.length} ITEMS`;

  if (!results.length) {
    galleryGrid.innerHTML =
      '<p class="empty-state">Nothing found. Try another search.</p>';
  }

  filterButtons.forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.filter.toLowerCase() === activeFilter.toLowerCase()
    );
  });
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    renderGallery();
  });
});

searchInput.addEventListener("input", renderGallery);

renderGallery();
