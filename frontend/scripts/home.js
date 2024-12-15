//Verifica se o usuário está logado
if (!localStorage.getItem("loggedIn")) {
  window.location.href = "login.html";
} else {
  // console.log("Usuário logado!");
}
