const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkIfRepositoryExists(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Id Inválido" });
  }

  const repository = repositories.find((f) => f.id === id);

  if (!repository) {
    return response.status(400).json({ error: "Repositório não encontrado." });
  }

  // dica, adicionando parametros
  request.params = {
    index: repositories.indexOf(repository),
    id: repository.id,
  };

  return next();
};

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;
    const repository = { id: uuid(), title, url, techs, likes: 0 }; 

    repositories.push(repository);
    return response.json(repository);
});

app.put("/repositories/:id", checkIfRepositoryExists,(request, response) => {
  const { title, url, techs } = request.body;

  const repository = { 
    id: request.params.id,  
    title,
    url,
    techs,
    likes: repositories[request.params.index].likes,
  };

  repositories[request.params.index] = repository;
  return response.json(repository)
});

app.delete("/repositories/:id", checkIfRepositoryExists,(request, response) => {
  repositories.splice(request.params.index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", checkIfRepositoryExists, (request, response) => {
  repositories[request.params.index].likes++;
  return response.status(200).json(repositories[request.params.index]); 
});

module.exports = app;
