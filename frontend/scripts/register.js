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

//Cadastra o usuário
async function registerUser(user, password) {
  try {
    console.log(user, password);

    const userData = { user, password };

    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Aguarda a resposta e verifica se a requisição foi bem-sucedida
    if (!response.ok) {
      throw new Error("Erro ao cadastrar");
    }

    showMsg("Cadastrado com sucesso!", "sucess-msg");

    // Redireciona após a requisição bem-sucedida
    window.location.href = "login.html";
  } catch (err) {
    showMsg("Erro ao cadastrar: " + err, "error-msg"); // Exibe a mensagem de erro
  }
}

document.getElementById("btn-register").addEventListener("click", (e) => {
  e.preventDefault();
  const user = document.getElementById("user").value;
  const password = document.getElementById("password").value;

  if (!user || !password) {
    showMsg("Todos os campos devem ser preenchidos", "error-msg");
  } else if (password.length < 8) {
    showMsg("A senha não pode ter menos de 8 caracteres", "error-msg");
  } else {
    registerUser(user, password);
  }
});
