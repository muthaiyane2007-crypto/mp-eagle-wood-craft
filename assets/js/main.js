const INSTAGRAM_URL = "https://www.instagram.com/mpeagle_wood_craft/";
const WHATSAPP_URL = "https://wa.me/919000000000";

function setTheme(nextTheme) {
  const body = document.body;
  if (nextTheme === "light") {
    body.classList.add("light");
  } else {
    body.classList.remove("light");
  }
  localStorage.setItem("mpwc-theme", nextTheme);
}

function initTheme() {
  const saved = localStorage.getItem("mpwc-theme");
  setTheme(saved || "dark");
  const toggles = document.querySelectorAll("[data-theme-toggle]");
  toggles.forEach((button) => {
    button.addEventListener("click", () => {
      const isLight = document.body.classList.contains("light");
      setTheme(isLight ? "dark" : "light");
    });
  });
}

function initLoader() {
  const loader = document.querySelector("[data-loader]");
  if (!loader) return;
  setTimeout(() => {
    loader.style.display = "none";
  }, 1500);
}

function addFloatingButtons() {
  const floating = document.createElement("aside");
  floating.className = "floating";
  floating.innerHTML = `
    <a class="ig-float" href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" aria-label="Order on Instagram">IG</a>
    <a class="wa-float" href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" aria-label="Contact on WhatsApp">WA</a>
  `;
  document.body.appendChild(floating);
}

function setImageFallbacks() {
  const fallback =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23201a12'/%3E%3Ctext x='50%25' y='50%25' font-size='34' fill='%23c8a24a' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3EMP EAGLE WOOD CRAFT%3C/text%3E%3C/svg%3E";
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.src = fallback;
    });
  });
}

function highlightNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("[data-nav-link]");
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === path) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLoader();
  setImageFallbacks();
  addFloatingButtons();
  highlightNav();
});
