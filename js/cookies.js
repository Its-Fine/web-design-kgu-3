/**
 * @fileoverview Сообщение об использовании cookies (jQuery).
 * По нажатию кнопки «Понятно» блок плавно скрывается.
 */

$('#cookie-close').on('click', () => {
  $('#cookie-banner').fadeOut(300);
});
