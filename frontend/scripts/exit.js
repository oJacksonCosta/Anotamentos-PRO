//Alterna o botão entre preenchido e vazado

const btnExit = document.getElementById("btn-exit-icon");

btnExit.addEventListener("mouseenter", () => {
  btnExit.classList.remove("bi", "bi-x-square");
  btnExit.classList.add("bi", "bi-x-square-fill");
});
btnExit.addEventListener("mouseleave", () => {
  btnExit.classList.remove("bi", "bi-x-square-fill");
  btnExit.classList.add("bi", "bi-x-square");
});
