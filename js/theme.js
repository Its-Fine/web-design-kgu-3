/**
 * @fileoverview Переключение светлой/тёмной темы на всех страницах сайта.
 * JS только ставит/снимает класс theme-dark на <html>, сами стили обеих
 * тем описаны в CSS. Выбор запоминается в localStorage, поэтому тема
 * сохраняется при переходе между страницами. Скрипт подключается в <head>,
 * чтобы тема применялась до отрисовки страницы (без мигания).
 */

const THEME_KEY = 'theme';

/**
 * Читает сохранённую тему.
 * @return {?string} 'dark', 'light' или null.
 */
function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (error) {
    return null;
  }
}

/**
 * Сохраняет выбранную тему.
 * @param {string} theme 'dark' или 'light'.
 */
function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    // хранилище недоступно — тема просто не запомнится
  }
}

if (loadTheme() === 'dark') {
  document.documentElement.classList.add('theme-dark');
}

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) {
    return;
  }
  const isDarkNow = document.documentElement.classList.contains('theme-dark');
  themeToggle.setAttribute('aria-pressed', String(isDarkNow));

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('theme-dark');
    themeToggle.setAttribute('aria-pressed', String(isDark));
    saveTheme(isDark ? 'dark' : 'light');
  });
});
