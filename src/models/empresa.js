'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const schema = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    celular: {
        type: Number,
        required: true,
        unique: true
    },
    telefone: {
        type: Number,
        required: false
    },
    linkedin: {
        type: String,
        required: false
    },
    ativo: {
        type: Boolean,
        required: true,
        default: true
    },
    imagem: {
        type: String,
        required: false,
        trim: true
    },
    dataDeFundacao: {
        type: Date,
        required: true,
    },
    sobre: {
        type: String,
        required: false
    },
    vagas: [{
        type: String,
        required: false
    }],
    sites: [{
        type: String,
        required: false
    }],
    sedesDaEmpresa: [{
        bairro: {
            type: String,
            required: false
        },
        cidade: {
            type: String,
            required: false,
            enum: ['São paulo', 'Rio de janeiro'],
            default: 'São paulo'
        },
        estado: {
            type: String,
            required: false,
            enum: ['SP', 'RJ'],
            default: 'SP'
        },
    }]
});

schema.plugin(uniqueValidator, { message: '{VALUE} já cadastrado!' });
module.exports = mongoose.model('Empresa', schema);