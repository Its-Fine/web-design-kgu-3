/**
 * @fileoverview Корзина: выбор способа оплаты и способа получения.
 * Внутри каждой группы кнопок активна только одна.
 */

/**
 * Делает выбранной только одну кнопку из группы.
 * @param {string} selector Селектор кнопок группы.
 */
function initSingleSelect(selector) {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.classList.remove('is-selected'));
      button.classList.add('is-selected');
    });
  });
}

initSingleSelect('.payment-option');
initSingleSelect('.delivery-button');
