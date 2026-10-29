/**
 * @fileoverview Акции и новости: переключение светлой/тёмной темы
 * и форма подписки на новости.
 * Стили обеих тем описаны в CSS, скрипт только ставит класс theme-dark.
 */

const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('theme-dark');
  themeToggle.textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
  themeToggle.setAttribute('aria-pressed', String(isDark));
});

const subscribeForm = document.getElementById('subscribe-form');
const subscribeEmail = document.getElementById('subscribe-email');
const subscribeMessage = document.getElementById('subscribe-message');

subscribeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = subscribeEmail.value.trim();
  subscribeMessage.textContent = `Адрес ${email} успешно добавлен в список рассылки`;
  subscribeForm.reset();
});
