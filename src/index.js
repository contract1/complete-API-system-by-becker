const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
const port = 3000;

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://Marcelo:SSmJwvr1ZLyM7rvz@cluster-star-api.zj5tp11.mongodb.net/?retryWrites=true&w=majority&appName=cluster-star-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definição do modelo Film
const Film = mongoose.model('Film', { 
  title: String, 
  description: String,
  image_url: String,
  trailer_url: String,
});

// Rota GET para verificar a listagem de todos os filmes criados no model Film 
app.get('/', async (req, res) => {
  try {
    const films = await Film.find();
    return res.send(films);
  } catch (error) {
    res.status(500).send('Erro ao buscar filmes: ' + error.message);
  }
});

// Rota DELETE para remover um filme pelo ID
app.delete('/:id', async (req, res) => {
  try {
    const filmId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      return res.status(400).send('ID inválido');
    }

    const film = await Film.findByIdAndDelete(filmId);
    if (!film) {
      return res.status(404).send('Filme não encontrado');
    }

    return res.send('Filme deletado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao deletar o filme: ' + error.message);
  }
});

app.put("/:id", async(req, res) => {
  const film = await Film.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
    image_url: req.body.image_url,
    trailer_url: req.body.trailer_url  
  })
  return res.send(film)
})

// Rota POST para criar um novo filme
app.post('/', async (req, res) => {
  try {
    // Verifica se o filme já existe no banco de dados
    const existingFilm = await Film.findOne({ title: req.body.title });
    if (existingFilm) {
      return res.status(400).send('Esse filme já está cadastrado');
    }

    const film = new Film({
      title: req.body.title,
      description: req.body.description,
      image_url: req.body.image_url,
      trailer_url: req.body.trailer_url,
    });

    const savedFilm = await film.save();
    res.status(201).json(savedFilm); // Retorna o filme salvo em formato JSON
  } catch (error) {
    res.status(500).send('Erro ao salvar o Filme: ' + error.message);
  }
});

// Inicia o servidor na porta 3000
app.listen(port, () => {
  console.log(`Isso aí, neguin! Tá Funcionando na moral na porta ${port}!`);
});
