'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();

// Connecta ao banco
mongoose.connect('mongodb+srv://fatec_group:KULFvu1lRdCo3yCZ@nodestorage.sduiuix.mongodb.net');

// Carregar os Models
const Product = require('./models/product');

// Carregar as Rotas
const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRoute);
app.use('/products', productRoute);

module.exports = app;