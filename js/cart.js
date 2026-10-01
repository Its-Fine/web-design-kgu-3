// Корзина: выбор способа оплаты и способа получения.
// Внутри каждой группы кнопок активна только одна.
function initSingleSelect(selector) {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('sel'));
      btn.classList.add('sel');
    });
  });
}

initSingleSelect('.pay-opt');
initSingleSelect('.del-btn');
