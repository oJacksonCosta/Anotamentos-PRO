const login = document.getElementById("login");
const password = document.getElementById("password");
const alterIcon = document.getElementById("alter-icon");
const icon = document.querySelector("#alter-icon > i");

//Ocultar/exibir senha

let showPassword = false;

alterIcon.addEventListener("click", () => {
  if (!showPassword) {
    icon.classList.remove("bi", "bi-eye-slash");
    icon.classList.add("bi", "bi-eye");
    showPassword = true;
    password.type = "text";
    password.focus();
  } else {
    icon.classList.remove("bi", "bi-eye");
    icon.classList.add("bi", "bi-eye-slash");
    showPassword = false;
    password.type = "password";
    password.focus();
  }
});
