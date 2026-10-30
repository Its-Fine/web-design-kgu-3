const subscribeForm = document.getElementById("subscribe-form");
const subscribeEmail = document.getElementById("subscribe-email");
const subscribeMessage = document.getElementById("subscribe-message");

subscribeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = subscribeEmail.value.trim();
  subscribeMessage.textContent = `Адрес ${email} успешно добавлен в список рассылки`;
  subscribeForm.reset();
});
