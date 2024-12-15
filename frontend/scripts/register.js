//Mostra uma mensagem na tela
function showMsg(msg) {
  const body = document.getElementById("body");
  const message = document.createElement("p");

  message.textContent = msg;
  message.classList.add("error-msg");
  body.appendChild(message);

  setTimeout(() => {
    body.removeChild(message);
  }, 2000);
}

document.getElementById("btn-register").addEventListener("click", (e) => {
  e.preventDefault();
  const user = document.getElementById("user").value;
  const password = document.getElementById("password").value;

  if (!user || !password) {
    showMsg("Todos os campos devem ser preenchidos");
  } else if (password.length < 8) {
    showMsg("A senha não pode ter menos de 8 caracteres");
  } else {
    console.log(user, password);

    const userData = { user, password };

    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((window.location.href = "../pages/login.html"))
      .catch((err) => {
        showMsg("Erro ao cadastrar: "), err;
      });
  }
});
