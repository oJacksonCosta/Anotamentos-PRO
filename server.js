import jsonServer from "json-server";

// Criando o servidor e a instância do roteador
const server = jsonServer.create();
const router = jsonServer.router("db.json"); // Referência ao banco de dados
const middlewares = jsonServer.defaults(); // Middlewares padrões do JSON Server

server.use(middlewares);

// Middleware para verificar se o usuário já existe
server.use((req, res, next) => {
  // Verifica se a requisição é um POST para '/users'
  if (req.method === "POST" && req.path === "/users") {
    const newUser = req.body; // Dados do usuário a ser cadastrado
    const users = router.db.get("users").value(); // Busca todos os usuários

    // Verifica se já existe um usuário com o mesmo nome
    const exists = users.some((user) => user.user === newUser.user);

    if (exists) {
      // Retorna erro se o usuário já existe
      return res.status(400).json({ error: "Usuário já existe" });
    }
  }
  // Chama o próximo middleware ou roteador
  next();
});

// Usa o roteador para servir as rotas
server.use(router);

// Inicia o servidor na porta 3000
server.listen(3000, () => {
  console.log("JSON Server is running");
});
