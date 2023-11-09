// Instalando programas
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

// Configurando o roteamento para teste no postman
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

// Configurando o acesso ao mongodb
mongoose.connect("mongodb://127.0.0.1:27017/FaunaGuard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Criando a model de Email
const InscricaoSchema = new mongoose.Schema({
  email: { type: String, required: true },
});

const Inscricao = mongoose.model("Inscricao", InscricaoSchema);

// Configurando os roteamentos Email
app.post("/cadastroemail", async (req, res) => {
  const email = req.body.email;

  // Testando se o campo foi preenchido
  if (email == null) {
    return res.status(400).json({ error: "Preencha o campo" });
  }

  // Testando se o email é válido
  const emailExiste = await Inscricao.findOne({ email: email });

  if (emailExiste) {
    return res.status(400).json({ error: "O e-mail cadastrado já existe!!!" });
  }

  const inscricao = new Inscricao({
    email: email,
  });

  try {
    const newInscricao = await inscricao.save();
    res.json({
      error: null,
      msg: "Cadastro ok",
      inscricaoId: newInscricao._id,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Rota para o get de cadastro
app.get("/cadastroemail", async (req, res) => {
  res.sendFile(__dirname + "pages/home.html");
});

// Tota raiz
app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Configurando a porta
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
