const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/FaunaGuard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 20000,
});

// Model Inscrição
const inscricaoSchema = new mongoose.Schema({
  email: { type: String, Required: true },
});
const Inscrição = mongoose.model("Inscriçõe", inscricaoSchema);

// Model Contato
const contatoSchema = new mongoose.Schema({
  email: { type: String, Required: true },
});
const Contato = mongoose.model("Contato", contatoSchema);

// Model Cadastro
const cadastroSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  endereco: { type: String, required: true },
  bairro: { type: String, required: true },
  numero: { type: Number, required: true },
  cep: { type: String, required: true },
  uf: { type: String, required: true },
});
const Cadastro = mongoose.model("Cadastro", cadastroSchema);

// Roteamento Inscrição
app.post("/cadastroInscricao", async (req, res) => {
  const email = req.body.email;

  if (email == null) {
    return res.status(400).json({ error: "Preencha o campo" });
  }
  const emailExiste = await Inscrição.findOne({ email: email });
  if (emailExiste) {
    return res
      .status(400)
      .json({ error: "O e-mail digitado já está cadastrado" });
  }

  const inscricao = new Inscrição({
    email: email,
  });

  try {
    const newInscricao = await inscricao.save();
    res.json({
      error: null,
      msg: "Cadastro realizado",
      inscricaoId: newInscricao._id,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Roteamento Contatos
app.post("/cadastroContato", async (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const mensagem = req.body.mensagem;

  if (nome == null || email == null || mensagem == null) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }
  const emailExiste = await Contato.findOne({ email: email });
  if (emailExiste) {
    return res
      .status(400)
      .json({ error: "O e-mail digitado já está cadastrado" });
  }

  const contato = new Contato({
    nome: nome,
    email: email,
    mensagem: mensagem,
  });

  try {
    const newContato = await contato.save();
    res.json({
      error: null,
      msg: "Mensagem enviada com sucesso",
      contatoId: newContato._id,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Roteamento Cadastro
app.post("/cadastroCadastro", async (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const endereco = req.body.endereco;
  const bairro = req.body.bairro;
  const numero = req.body.numero;
  const cep = req.body.cep;
  const uf = req.body.uf;

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
  const emailExiste = await Cadastro.findOne({ email: email });
  if (emailExiste) {
    return res
      .status(400)
      .json({ error: "O e-mail digitado já está cadastrado" });
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
      msg: "Cadastro feito com sucesso",
      cadastroId: newCadastro._id,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Rota para o get de Inscrição
app.get("/cadastroInscricao", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Rota para o get de Contato
app.get("/cadastroContato", async (req, res) => {
  res.sendFile(__dirname + "/pages/contatos.html");
});

// Rota para o get de Cadastro
app.get("/cadastroCadastro", async (req, res) => {
  res.sendFile(__dirname + "/pages/cadastro.html");
});

// Rota raiz
app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Configurando a porta
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
