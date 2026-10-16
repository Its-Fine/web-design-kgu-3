/**
 * @fileoverview О нас: стрелки прокрутки ленты отзывов.
 * Кнопки со стрелками задают сдвиг в атрибуте data-scroll.
 */

const track = document.getElementById('reviews-track');

document.querySelectorAll('.arrow[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    track.scrollBy({left: Number(button.dataset.scroll), behavior: 'smooth'});
  });
});
