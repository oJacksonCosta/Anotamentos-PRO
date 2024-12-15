//Verifica se o usuário está logado
if (!localStorage.getItem("loggedIn")) {
  window.location.href = "login.html";
} else {
  // console.log("Usuário logado!");
}

//Lista os cartões
function listCards(notes) {
  const cardList = document.getElementById("card-list");

  notes.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const btnOptions = document.createElement("button");
    btnOptions.classList.add("card-options");
    btnOptions.innerHTML = '<i class="bi bi-three-dots-vertical"></i>';

    const colorTag = document.createElement("div");
    const color = item.priority;
    switch (color) {
      case "alta":
        colorTag.classList.add("red");
        break;
      case "media":
        colorTag.classList.add("orange");
        break;
      case "baixa":
        colorTag.classList.add("green");
        break;
    }

    const title = document.createElement("h2");
    title.textContent = item.title;

    const note = document.createElement("p");
    note.textContent = item.note;

    const cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer");

    const date = document.createElement("p");
    date.classList.add("date");
    date.innerHTML = '<i class="bi bi-calendar-fill"></i> ' + item.date;

    const labelType = document.createElement("p");
    labelType.classList.add("label-type");
    const type = item.type;
    switch (type) {
      case "anotacao":
        labelType.textContent = "Anotação";
        break;
      case "tarefa":
        labelType.textContent = "Tarefa";
        break;
      case "ideia":
        labelType.textContent = "Ideia";
        break;
    }

    cardFooter.append(date, labelType);
    card.append(btnOptions, colorTag, title, note, cardFooter);
    cardList.append(card);
  });
}

//Cadastra uma nova nota
document
  .getElementById("btn-register-note")
  .addEventListener("click", async () => {
    const userId = localStorage.getItem("userId");
    const title = document.getElementById("title").value;
    const type = document.getElementById("type").value;
    const priority = document.getElementById("priority").value;
    const note = document.getElementById("note").value;

    //Obtem a data atual e formata
    const atualDate = new Date();
    const formatador = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" });
    const date = formatador.format(atualDate);

    const noteData = { userId, title, type, priority, note, date };

    try {
      const response = await fetch("http://localhost:3000/anotations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar");
      }

      console.log("nota registrada");
    } catch (err) {
      console.log(err);
    }
  });

//Lista todos os cartões ao carregar a página
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userId = localStorage.getItem("userId");
    console.log(userId);

    const response = await fetch("http://localhost:3000/anotations");
    const data = await response.json();

    // Filtra as anotações com o userId correspondente
    const userNotes = data.filter((note) => note.userId == userId);

    console.log(userNotes);
    listCards(userNotes);
  } catch (err) {
    console.log("Erro: ", err);
  }
});
