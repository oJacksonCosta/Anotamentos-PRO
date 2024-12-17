import showMsg from "../scripts/alert.js";

// Função para manipular classes de elementos
const toggleClass = (element, addClass, removeClass) => {
  element.classList.add(addClass);
  element.classList.remove(removeClass);
};

// Redireciona se o usuário não estiver logado
if (!localStorage.getItem("loggedIn")) {
  window.location.href = "login.html";
}

// Funções de Modal
const toggleModal = (modal, overlay, action) => {
  if (action === "open") {
    // Mostrar o modal e overlay, aplicar o desfoque no container
    modal.classList.remove("modal-confirm-hidden");
    modal.classList.add("modal-confirm");
    overlay.classList.remove("hide-overlay");
    overlay.classList.add("show-overlay");
    document.getElementById("container").classList.add("blur");
  } else if (action === "close") {
    // Esconder o modal e overlay, remover o desfoque no container
    modal.classList.remove("modal-confirm");
    modal.classList.add("modal-confirm-hidden");
    overlay.classList.remove("show-overlay");
    overlay.classList.add("hide-overlay");
    document.getElementById("container").classList.remove("blur");
  }
};
// Deletar registro por ID
const deleteRecord = async (id) => {
  try {
    const response = await fetch(
      `https://anotamentos-pro.onrender.com/anotations/${id}`,
      { method: "DELETE" }
    );
    if (!response.ok) throw new Error("Falha ao deletar");
    showMsg(`O registro com ID ${id} foi deletado com sucesso!`, "sucess-msg");
  } catch (error) {
    console.error("Erro na requisição:", error);
    showMsg(`Erro ao deletar o registro com ID ${id}.`, "error-msg");
  }
};

// Centraliza a criação de elementos para as notas
const createCardElement = (item) => {
  const card = document.createElement("div");
  card.classList.add("card");

  const btnOptions = document.createElement("button");
  btnOptions.classList.add("card-options");
  btnOptions.innerHTML = '<i class="bi bi-three-dots-vertical"></i>';
  btnOptions.addEventListener("click", () => {
    optionsModal.classList.toggle("options-modal-hidden");
    optionsModal.classList.toggle("options-modal");
  });

  const optionsModal = document.createElement("div");
  optionsModal.classList.add("options-modal-hidden");

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("modal-btn");
  deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i> Excluir';
  deleteBtn.addEventListener("click", () => {
    const modalConfirm = document.getElementById("modal-confirm");
    const overlay = document.getElementById("overlay");
    toggleModal(modalConfirm, overlay, "open");

    document.getElementById("btn-yes").onclick = async () => {
      await deleteRecord(item.id);
      toggleModal(modalConfirm, overlay, "close");
      listAllCards();
    };

    document.getElementById("btn-no").onclick = () =>
      toggleModal(modalConfirm, overlay, "close");
  });

  const editBtn = document.createElement("button");
  editBtn.classList.add("modal-btn");
  editBtn.innerHTML = '<i class="bi bi-pencil-square"></i> Editar';
  editBtn.disabled = true;

  // Adicionando a lógica de cores com o switch
  const colorTag = document.createElement("div");
  switch (item.priority) {
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
    default:
      colorTag.classList.add("gray");
  }

  const title = document.createElement("h2");
  title.textContent = item.title;

  const note = document.createElement("p");
  const formatedText = item.note.replace(/\n/g, "<br>");
  note.innerHTML = formatedText;

  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer");

  const date = document.createElement("p");
  date.classList.add("date");
  date.innerHTML = `<i class="bi bi-calendar-fill"></i> ${item.date}`;

  const labelType = document.createElement("p");
  labelType.classList.add("label-type");
  labelType.textContent =
    item.type.charAt(0).toUpperCase() + item.type.slice(1);

  optionsModal.append(deleteBtn, editBtn);
  cardFooter.append(date, labelType);
  card.append(btnOptions, optionsModal, colorTag, title, note, cardFooter);

  return card;
};

// Listar cartões
function listCards(notes) {
  const cardList = document.getElementById("card-list");
  cardList.innerHTML = "";

  notes.forEach((item) => {
    cardList.appendChild(createCardElement(item));
  });
}

// Limpa lista de cartões
function clearList() {
  document.getElementById("card-list").replaceChildren();
}

// Listar todos os cartões
async function listAllCards() {
  clearList();
  try {
    const userId = localStorage.getItem("userId");
    const response = await fetch(
      "https://anotamentos-pro.onrender.com/anotations"
    );
    const data = await response.json();
    const userNotes = data.filter((note) => note.userId == userId);
    listCards(userNotes);
  } catch (err) {
    console.error("Erro ao carregar cartões:", err);
  }
}

document.addEventListener("DOMContentLoaded", listAllCards);

// Registrar nova nota
const registerNote = async () => {
  const userId = localStorage.getItem("userId");
  const title = document.getElementById("title").value;
  const type = document.getElementById("type").value;
  const priority = document.getElementById("priority").value;
  const note = document.getElementById("note").value;
  const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
    new Date()
  );

  if (!title || !type || type === "tipo" || !priority || !note) {
    showMsg("Preencha todos os campos!", "error-msg");
    return;
  }

  try {
    const response = await fetch(
      "https://anotamentos-pro.onrender.com/anotations",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, type, priority, note, date }),
      }
    );

    if (!response.ok) throw new Error("Erro ao cadastrar nota");

    clearList();
    listAllCards();
    document.getElementById("form").reset();
    document.getElementById("title").focus();
  } catch (err) {
    console.error("Erro ao registrar nota:", err);
  }
};

document.getElementById("btn-register-note").addEventListener("click", (e) => {
  e.preventDefault();
  registerNote();
});

// Verifica os selects e desabilita o select de prioridade caso o tipo seja anotação, ideia ou geral
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

  if (type === "tipo") {
    priority.value = "prioridade";
  }
}

// Habilita a prioridade apenas se for uma tarefa ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  const type = document.getElementById("filter-type");
  const priority = document.getElementById("filter-priority");

  if (type && type.value !== "tarefa") {
    priority.setAttribute("disabled", true);
  }
});

// Adiciona listeners aos selects para habilitar/desabilitar prioridade dinamicamente
document.getElementById("type").addEventListener("change", () => {
  checkSelects("type", "priority", "alta");
});

document.getElementById("filter-type").addEventListener("change", () => {
  checkSelects("filter-type", "filter-priority", "geral");
});

//Filtros
let notesData = []; // Armazenar as anotações no estado global

// Função para buscar as anotações uma vez e armazená-las no estado global
async function fetchNotes() {
  try {
    const response = await fetch(
      "https://anotamentos-pro.onrender.com/anotations"
    );
    const data = await response.json();
    notesData = data; // Armazena as anotações no estado global
    console.log(notesData);
  } catch (err) {
    console.error("Erro ao buscar as anotações: ", err);
  }
}

// Filtra as anotações conforme o tipo e prioridade
async function filter() {
  try {
    const userId = localStorage.getItem("userId");
    const type = document.getElementById("filter-type").value;
    const priority = document.getElementById("filter-priority").value;

    // Se os dados ainda não foram carregados, faz a requisição
    if (notesData.length === 0) {
      await fetchNotes();
    }

    // Filtra as anotações com o userId, tipo e prioridade
    let filteredNotes = notesData.filter((note) => note.userId == userId);

    if (type !== "tipo") {
      filteredNotes = filteredNotes.filter((note) => note.type === type);
    }

    if (priority !== "geral") {
      filteredNotes = filteredNotes.filter(
        (note) => note.priority === priority
      );
    }

    clearList();
    listCards(filteredNotes);
  } catch (err) {
    console.error("Erro no filtro: ", err);
  }
}

// Função de busca
async function search() {
  try {
    const userId = localStorage.getItem("userId");
    const searchTerm = document.getElementById("search").value.toLowerCase();

    // Se os dados ainda não foram carregados, faz a requisição
    if (notesData.length === 0) {
      await fetchNotes();
    }

    // Filtra as anotações com o userId
    const userNotes = notesData.filter((note) => note.userId == userId);

    // Realiza a busca no título e na nota
    const notesSearch = userNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.note.toLowerCase().includes(searchTerm)
    );

    clearList();
    listCards(notesSearch);
  } catch (err) {
    console.error("Erro na busca: ", err);
  }
}

// Adiciona o evento de filtro para o tipo
document.getElementById("filter-type").addEventListener("change", filter);

// Adiciona o evento de filtro para a prioridade
document.getElementById("filter-priority").addEventListener("change", filter);

// Evento para o botão de busca
document.getElementById("btn-search").addEventListener("click", search);

// Evento para a tecla Enter no campo de busca
document.getElementById("search").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    search();
  }
});

// Chama a função para carregar as anotações assim que a página for carregada
document.addEventListener("DOMContentLoaded", fetchNotes);
