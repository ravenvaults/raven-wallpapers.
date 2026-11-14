(() => {
"use strict";

const $ = s => document.querySelector(s);
const wallpapers = window.RAVEN_WALLPAPERS || [];

document.querySelectorAll("[data-year]").forEach(el => {
  el.textContent = new Date().getFullYear();
});

// Mobile navigation
const menu = $(".menu-toggle");
const nav = $("#nav");

if (menu && nav) {
  menu.addEventListener("click", () => {
    nav.classList.toggle("open");
    menu.textContent = nav.classList.contains("open") ? "×" : "☰";
  });
}

// Toast messages
function toast(message) {
  const box = $("#toast");
  if (!box) return;
  box.textContent = message;
  box.classList.add("show");
  setTimeout(() => box.classList.remove("show"), 2500);
}

// Homepage
if (document.body.dataset.page === "home") {

  const thoughts = [
    "The internet is a strange place. That's part of the charm.",
    "Stay curious. The world is bigger than your feed.",
    "Somewhere, someone is discovering their new favourite thing.",
    "Not everything needs a reason to exist.",
    "Make room for things you haven't discovered yet.",
    "A quiet tab in a loud world.",
    "Your next favourite thing might be one click away."
  ];

  const thought = $("#thought");
  const thoughtButton = $("#new-thought");

  if (thoughtButton && thought) {
    thoughtButton.addEventListener("click", () => {
      let next = thoughts[Math.floor(Math.random() * thoughts.length)];
      if (next === thought.textContent) {
        next = thoughts[(thoughts.indexOf(next) + 1) % thoughts.length];
      }
      thought.textContent = next;
    });
  }

  function updateClock() {
    const now = new Date();

    if ($("#clock")) {
      $("#clock").textContent = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(now);
    }

    if ($("#clock-date")) {
      $("#clock-date").textContent = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(now).toUpperCase();
    }
  }

  updateClock();
  setInterval(updateClock, 30000);

  const secret = $("#secret-button");
  if (secret) {
    secret.addEventListener("click", () => {
      toast("SECRET FOUND ✳ KEEP YOUR CURIOSITY ALIVE");
      secret.textContent = "YOU FOUND IT ✓";
    });
  }
}

// Archive
if (document.body.dataset.page === "archive") {

  const grid = $("#wallpaper-grid");
  const search = $("#search");
  const categoryBox = $("#subcategories");
  const count = $("#result-count");
  const empty = $("#empty-state");

  const params = new URLSearchParams(location.search);

  let activeType = params.get("type") === "phone" ? "phone" : "desktop";
  let activeCategory = params.get("category") || "All";

  const categories = {
    desktop: ["All", "Urban", "Abstract"],
    phone: ["All", "Quotes", "Minimal"]
  };

  function renderCategories() {
    categoryBox.replaceChildren();

    categories[activeType].forEach(category => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = category.toUpperCase();
      button.className = activeCategory === category ? "selected" : "";

      button.addEventListener("click", () => {
        activeCategory = category;
        updateURL();
        renderCategories();
        renderWallpapers();
      });

      categoryBox.append(button);
    });

    document.querySelectorAll("[data-type]").forEach(button => {
      button.classList.toggle(
        "selected",
        button.dataset.type === activeType
      );
    });
  }

  function updateURL() {
    const url = new URL(location.href);
    url.searchParams.set("type", activeType);

    if (activeCategory === "All") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", activeCategory);
    }

    history.replaceState({}, "", url);
  }

  function renderWallpapers() {
    grid.replaceChildren();

    const term = (search?.value || "").toLowerCase().trim();

    const filtered = wallpapers.filter(item => {
      const typeMatch = item.type === activeType;
      const categoryMatch =
        activeCategory === "All" ||
        item.category === activeCategory;

      const text = [
        item.title,
        item.category,
        item.description,
        ...(item.tags || [])
      ].join(" ").toLowerCase();

      return typeMatch && categoryMatch && text.includes(term);
    });

    filtered.forEach(item => {
      const card = document.createElement("a");

      card.href = `wallpaper.html?id=${encodeURIComponent(item.id)}`;
      card.className = `wallpaper-card ${item.format}`;

      const imageBox = document.createElement("div");
      imageBox.className = "wallpaper-image";

      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.title;
      image.loading = "lazy";

      image.addEventListener("error", () => {
        imageBox.classList.add("missing");
        image.remove();
        const message = document.createElement("span");
        message.textContent = "IMAGE FILE NOT FOUND";
        imageBox.append(message);
      }, { once: true });

      const badge = document.createElement("span");
      badge.className = "image-badge";
      badge.textContent = item.type.toUpperCase();

      imageBox.append(image, badge);

      const info = document.createElement("div");
      info.className = "wallpaper-info";

      const category = document.createElement("span");
      category.textContent = item.category.toUpperCase();

      const title = document.createElement("h3");
      title.textContent = item.title;

      const description = document.createElement("p");
      description.textContent = item.description;

      info.append(category, title, description);
      card.append(imageBox, info);
      grid.append(card);
    });

    count.textContent = `${filtered.length} WALLPAPERS`;

    empty.hidden = filtered.length !== 0;
  }

  document.querySelectorAll("[data-type]").forEach(button => {
    button.addEventListener("click", () => {
      activeType = button.dataset.type;
      activeCategory = "All";
      updateURL();
      renderCategories();
      renderWallpapers();
    });
  });

  if (search) {
    search.addEventListener("input", renderWallpapers);
  }

  if (!categories[activeType].includes(activeCategory)) {
    activeCategory = "All";
  }

  renderCategories();
  renderWallpapers();
}

// Individual wallpaper page
if (document.body.dataset.page === "detail") {

  const mount = $("#wallpaper-detail");
  const id = new URLSearchParams(location.search).get("id");

  const item = wallpapers.find(w => w.id === id);

  if (!mount) return;

  if (!item) {
    mount.innerHTML = `
      <div class="detail-error">
        <p class="eyebrow">404 / FILE NOT FOUND</p>
        <h1>This file isn't in the archive.</h1>
        <a class="gold-button" href="archive.html">RETURN TO ARCHIVE ↗</a>
      </div>
    `;
    return;
  }

  document.title = `${item.title} — RAVEN`;

  const layout = document.createElement("section");
  layout.className = "detail-layout";

  const preview = document.createElement("div");
  preview.className = `detail-preview ${item.format}`;

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.title;

  image.addEventListener("error", () => {
    preview.textContent = "IMAGE FILE NOT FOUND — CHECK wallpapers.js";
  }, { once: true });

  preview.append(image);

  const info = document.createElement("div");
  info.className = "detail-info";

  const category = document.createElement("p");
  category.className = "eyebrow";
  category.textContent = `${item.type.toUpperCase()} / ${item.category.toUpperCase()}`;

  const title = document.createElement("h1");
  title.textContent = item.title;

  const description = document.createElement("p");
  description.textContent = item.description;

  const download = document.createElement("a");
  download.className = "gold-button download-button";
  download.href = item.image;
  download.download = `${item.id}.jpg`;
  download.textContent = "DOWNLOAD WALLPAPER ↗";

  info.append(category, title, description, download);
  layout.append(preview, info);
  mount.append(layout);
}

})();