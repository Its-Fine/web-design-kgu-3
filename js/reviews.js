// О нас: стрелки прокрутки ленты отзывов.
// Кнопки со стрелками задают сдвиг в атрибуте data-scroll.
const track = document.getElementById('rt');

document.querySelectorAll('.arr[data-scroll]').forEach((btn) => {
  btn.addEventListener('click', () => {
    track.scrollBy({ left: Number(btn.dataset.scroll), behavior: 'smooth' });
  });
});
