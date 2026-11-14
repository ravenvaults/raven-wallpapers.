
// RAVEN — INTERACTION ENGINE

const $ = selector => document.querySelector(selector);

const thoughts = [
  "The internet is a strange place. That's the beauty of it.",
  "Somewhere, someone is discovering their favourite thing.",
  "Not everything needs a reason to exist.",
  "Stay curious. The world is bigger than your feed.",
  "Your next favourite thing might be one click away.",
  "Offline is a place. Online is a universe.",
  "Make room for things you haven't discovered yet.",
  "Different perspectives make the internet interesting."
];

const randomButton = $("#randomThought");
const thoughtText = $("#thoughtText");

randomButton?.addEventListener("click", () => {
  const current = thoughtText.textContent;
  let next;

  do {
    next = thoughts[Math.floor(Math.random() * thoughts.length)];
  } while (next === current);

  thoughtText.style.opacity = "0";

  setTimeout(() => {
    thoughtText.textContent = next;
    thoughtText.style.opacity = "1";
  }, 180);
});

// LIVE CLOCK — INDIA

function updateClock() {
  const now = new Date();

  const clock = $("#liveClock");
  const date = $("#liveDate");

  if (!clock || !date) return;

  clock.textContent = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(now);

  date.textContent = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(now).toUpperCase();
}

updateClock();
setInterval(updateClock, 1000);

// SECRET SURPRISE

const secretButton = $("#secretButton");
const toast = $("#toast");

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timeout);

  showToast.timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

secretButton?.addEventListener("click", () => {
  showToast("YOU FOUND NOTHING. OR MAYBE SOMETHING. ✳");
});

// MOBILE MENU

const menuToggle = $("#menuToggle");
const nav = document.querySelector("header nav");

menuToggle?.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuToggle.textContent = opened ? "✕" : "☰";
  menuToggle.setAttribute("aria-expanded", String(opened));
});

nav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    if (menuToggle) {
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

// CURRENT YEAR

document.querySelectorAll("[data-year]").forEach(element => {
  element.textContent = new Date().getFullYear();
});

// BACK TO TOP

$("#backTop")?.addEventListener("click", event => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// SUBTLE SCROLL REVEAL

if ("IntersectionObserver" in window) {
  const revealElements = document.querySelectorAll(
    ".feature-card, .archive-link, .manifesto, .section-top"
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}
