const THEME_KEY = "theme";

function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    // хранилище недоступно — тема просто не запомнится
  }
}

if (loadTheme() === "dark") {
  document.documentElement.classList.add("theme-dark");
}

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) {
    return;
  }
  const isDarkNow = document.documentElement.classList.contains("theme-dark");
  themeToggle.setAttribute("aria-pressed", String(isDarkNow));

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("theme-dark");
    themeToggle.setAttribute("aria-pressed", String(isDark));
    saveTheme(isDark ? "dark" : "light");
  });
});
