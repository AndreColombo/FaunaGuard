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

// Criando a model de Cadastro
const CadastroSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  endereco: { type: String, required: true },
  bairro: { type: String, required: true },
  numero: { type: Number, required: true },
  cep: { type: String, required: true },
  uf: { type: String, required: true },
});

const Cadastro = mongoose.model("Cadastro", CadastroSchema);

// Criando a model de Email
const InscricaoSchema = new mongoose.Schema({
  email: { type: String, required: true },
});

const Inscricao = mongoose.model("Inscricao", InscricaoSchema);

// Configurando os roteamentos Cadastro
app.post("/cadastrousuario", async (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const endereco = req.body.endereco;
  const bairro = req.body.bairro;
  const numero = req.body.numero;
  const cep = req.body.cep;
  const uf = req.body.uf;

  // Testando se o campo foi preenchido
  if (
    nome == null ||
    email == null ||
    endereco == null ||
    bairro == null ||
    numero == null ||
    cep == null ||
    uf == null
  ) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  // Testando se o email é válido
  const emailExiste = await Cadastro.findOne({ email: email });

  if (emailExiste) {
    return res.status(400).json({ error: "O e-mail cadastrado já existe!!!" });
  }

  const cadastro = new Cadastro({
    nome: nome,
    email: email,
    endereco: endereco,
    bairro: bairro,
    numero: numero,
    cep: cep,
    uf: uf,
  });

  try {
    const newCadastro = await cadastro.save();
    res.json({
      error: null,
      msg: "Cadastro ok",
      cadastroId: newCadastro._id,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

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
app.get("/cadastrousuario", async (req, res) => {
  res.sendFile(__dirname + "pages/home.html");
});

// Rota raiz
app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Configurando a porta
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
