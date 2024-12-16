import showMsg from "../scripts/alert.js";

async function login(username, password) {
  try {
    const response = await fetch("http://localhost:3000/users"); // Espera pela resposta do fetch
    const users = await response.json(); // Espera pela conversão do JSON

    const user = users.find(
      (u) => u.user === username && u.password === password
    );

    if (user) {
      showMsg("Login efetuado com sucesso!", "sucess-msg");

      setTimeout(() => {
        // Salvar no localStorage para manter o estado de login
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userId", user.id); // Salva id do usuário

        // Redirecionar para a página protegida
        window.location.href = "../pages/home.html";
      }, 1000);
    } else {
      showMsg("Credenciais inválidas", "error-msg");
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error); // Captura e exibe o erro
  }
}

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  login(username, password);
});
