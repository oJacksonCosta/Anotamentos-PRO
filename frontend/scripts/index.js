document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const nota = document.getElementById("nota").value;
  const tipo = document.getElementById("tipo").value;
  const prioridade = document.getElementById("prioridade").value;

  const dados = { titulo, nota, tipo, prioridade };

  // console.log(dados);

  fetch("http://localhost:3000/anotacoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Erro:", error));
});
