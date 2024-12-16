//Mostra uma mensagem na tela
export default function showMsg(msg, tag) {
  const body = document.getElementById("body");
  const message = document.createElement("p");

  message.textContent = msg;
  message.classList.add(tag);
  body.appendChild(message);

  setTimeout(() => {
    body.removeChild(message);
  }, 2000);
}
