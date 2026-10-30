const track = document.getElementById("reviews-track");

document.querySelectorAll(".arrow[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    track.scrollBy({ left: Number(button.dataset.scroll), behavior: "smooth" });
  });
});
