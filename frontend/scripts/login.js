//Mostra uma mensagem na tela
function showMsg(msg, tag) {
  const body = document.getElementById("body");
  const message = document.createElement("p");

  message.textContent = msg;
  message.classList.add(tag);
  body.appendChild(message);

  setTimeout(() => {
    body.removeChild(message);
  }, 2000);
}

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:3000/users")
    .then((response) => response.json())
    .then((users) => {
      const user = users.find(
        (u) => u.user === username && u.password === password
      );
      if (user) {
        showMsg("Login efetuado com sucesso!", "sucess-msg");

        setTimeout(() => {
          // Salvar no localStorage para manter o estado de login
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("userId", user.id); // Salvar id do usuário (se necessário)

          // Redirecionar para a página protegida
          window.location.href = "../pages/home.html";
        }, 1000);
      } else {
        showMsg("Credenciais inválidas", "error-msg");
      }
    })
    .catch((error) => {
      console.error("Erro ao fazer login:", error);
    });
});
