'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');

const app = express();
const router = express.Router();

// Connecta ao banco
mongoose.connect(config.connectionString);

// Carregar os Models
const Aluno = require('./models/aluno');
const Empresa = require('./models/empresa');
const Imagem = require('./models/imagem');
const Post = require('./models/post');

// Carregar as Rotas
const indexRoute = require('./routes/index-route');
const alunoRoute = require('./routes/aluno-route');
const empresaRoute = require('./routes/empresa-route');
const imagemRoute = require('./routes/imagem-route');
const postRoute = require('./routes/post-route');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false }));

// Habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    app.use(cors());
    next();
});

app.use('/', indexRoute);
app.use('/alunos', alunoRoute);
app.use('/empresas', empresaRoute);
app.use('/imagens', imagemRoute);
app.use('/posts', postRoute);

module.exports = app;