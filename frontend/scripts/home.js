import showMsg from "../scripts/alert.js";

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
    btnOptions.id = "options-" + item.id;
    btnOptions.innerHTML = '<i class="bi bi-three-dots-vertical"></i>';
    btnOptions.setAttribute("onchange", "showModal()");

    //Abre e fecha o modal
    let modalIsClose = true;
    btnOptions.addEventListener("click", () => {
      const options = document.getElementById("options-" + item.id);
      const modal = document.getElementById("options-modal-" + item.id);

      if (modalIsClose) {
        modal.classList.remove("options-modal-hidden");
        modal.classList.add("options-modal");
        options.innerHTML = "";
        options.innerHTML = '<i class="bi bi-x-square"></i>';
        modalIsClose = false;
      } else {
        modal.classList.remove("options-modal");
        modal.classList.add("options-modal-hidden");
        options.innerHTML = "";
        options.innerHTML = '<i class="bi bi-three-dots-vertical"></i>';
        modalIsClose = true;
      }
    });

    const optionsModal = document.createElement("div");
    optionsModal.classList.add("options-modal-hidden");
    optionsModal.id = "options-modal-" + item.id;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("modal-btn");
    deleteBtn.id = "btn-delete-" + item.id;
    deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i> Excluir';

    deleteBtn.addEventListener("click", () => {
      const options = document.getElementById("options-" + item.id);
      const modal = document.getElementById("options-modal-" + item.id);

      //Abre o modal de confirmação
      const modalConfirm = document.getElementById("modal-confirm");
      setTimeout(() => {
        modalConfirm.classList.remove("modal-confirm-hidden");
        modalConfirm.classList.add("modal-confirm");
      }, 200);

      document.getElementById("container").classList.add("blur");

      const overlay = document.getElementById("overlay");

      overlay.classList.remove("hide-overlay");
      overlay.classList.add("show-overlay");

      //Fecha o modal de opções
      modal.classList.remove("options-modal");
      modal.classList.add("options-modal-hidden");
      options.innerHTML = "";
      options.innerHTML = '<i class="bi bi-three-dots-vertical"></i>';
      modalIsClose = true;

      document.getElementById("btn-yes").addEventListener("click", async () => {
        //Deletar card
        try {
          const response = await fetch(
            `http://localhost:3000/anotations/${item.id}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            console.log(`Registro com ID ${item.id} foi deletado com sucesso!`);
            // Atualizar a lista ou UI, se necessário
          } else {
            console.error(
              `Erro ao deletar o registro com ID ${item.id}:`,
              response.status
            );
          }
        } catch (error) {
          console.error("Erro na requisição:", error);
        }
      });

      //Fecha o modal de confirmação
      document.getElementById("btn-no").addEventListener("click", () => {
        modalConfirm.classList.remove("modal-confirm");
        modalConfirm.classList.add("modal-confirm-hidden");

        document.getElementById("container").classList.remove("blur");

        overlay.classList.remove("show-overlay");
        overlay.classList.add("hide-overlay");
      });
    });

    const editBtn = document.createElement("button");
    editBtn.classList.add("modal-btn");
    editBtn.id = "btn-edit-" + item.id;
    editBtn.innerHTML = '<i class="bi bi-pencil-square"></i> Editar';
    editBtn.setAttribute("disabled", true);

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
      case "prioridade":
        colorTag.classList.add("blue");
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

    optionsModal.append(deleteBtn, editBtn);
    cardFooter.append(date, labelType);
    card.append(btnOptions, optionsModal, colorTag, title, note, cardFooter);
    cardList.append(card);
  });
}

function clearlist() {
  const cardList = document.getElementById("card-list");
  cardList.replaceChildren();
}

//Cadastra uma nova nota
document
  .getElementById("btn-register-note")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const title = document.getElementById("title").value;
    const type = document.getElementById("type").value;
    const priority = document.getElementById("priority").value;
    const note = document.getElementById("note").value;

    //Obtem a data atual e formata
    const atualDate = new Date();
    const formatador = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" });
    const date = formatador.format(atualDate);

    //Verifica se os campos estão preenchidos
    if (!title || !type || type === "tipo" || !priority || !note) {
      showMsg("Preencha todos os campos!", "error-msg");
      return;
    }

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

//Verifica os selects e desabilita o select de prioridade caso o tipo seja anotação ou ideia
function checkSelects(inputType, inputPriority, defaultValue) {
  const type = document.getElementById(inputType).value;
  const priority = document.getElementById(inputPriority);

  if (type === "anotacao" || type === "ideia" || type === "geral") {
    priority.setAttribute("disabled", true);
    priority.value = "prioridade";
  } else {
    priority.removeAttribute("disabled");
    priority.value = defaultValue;
  }
}
//Habilita a prioridade apenas se for uma tarefa
document.addEventListener("DOMContentLoaded", () => {
  const type = document.getElementById("filter-type");
  const priority = document.getElementById("filter-priority");

  if (type !== "tarefa") {
    priority.setAttribute("disabled", true);
  }
});

document.getElementById("type").addEventListener("change", () => {
  checkSelects("type", "priority", "alta");
});

document.getElementById("filter-type").addEventListener("change", () => {
  checkSelects("filter-type", "filter-priority", "geral");
});

//Lista todos os cartões ao carregar a página
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userId = localStorage.getItem("userId");
    // console.log(userId);

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

//Filtro
async function filter() {
  try {
    const userId = localStorage.getItem("userId");
    const type = document.getElementById("filter-type").value;
    const priority = document.getElementById("filter-priority").value;
    // console.log(type, priority);

    const response = await fetch("http://localhost:3000/anotations");
    const data = await response.json();

    // Filtra as anotações com o userId, tipo e prioridade
    let userNotes = [];

    if (priority === "geral") {
      userNotes = data.filter(
        (note) => note.userId == userId && note.type === type
      );
    } else {
      userNotes = data.filter(
        (note) =>
          note.userId == userId &&
          note.type === type &&
          note.priority === priority
      );
    }

    // console.log(userNotes);
    clearlist();
    listCards(userNotes);
  } catch (err) {
    console.log("Erro: ", err);
  }
}

document.getElementById("filter-type").addEventListener("change", () => {
  filter();
});

document.getElementById("filter-priority").addEventListener("change", () => {
  filter();
});

//Search
async function search() {
  try {
    const userId = localStorage.getItem("userId");
    const search = document.getElementById("search").value.toLowerCase();
    console.log(search, userId);

    const response = await fetch("http://localhost:3000/anotations");
    const data = await response.json();
    console.log("Server: " + data);

    // Filtra as anotações com o userId, tipo e prioridade
    const userNotes = data.filter((note) => note.userId);
    const notesSearch = userNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(search) ||
        note.note.toLowerCase().includes(search)
    );
    console.log(notesSearch);

    // console.log(userNotes);
    clearlist();
    listCards(notesSearch);
  } catch (err) {
    console.log("Erro: ", err);
  }
}

//Filtra pelo botão
document.getElementById("btn-search").addEventListener("click", () => {
  search();
});

//Filtra pelo Enter
document.getElementById("search").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    search();
  }
});
