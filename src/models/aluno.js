'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    experiencia: {
        type: String,
        required: false
    },
    celular: {
        type: Number,
        required: true
    },
    telefone: {
        type: Number,
        required: false
    },
    linkedin: {
        type: String,
        required: false
    },
    escolaridade: {
        type: String,
        required: true
    },
    dataDeNascimento: {
        type: Date,
        required: true,
    },
    cursos: [{
        type: String,
        required: false
    }],
    sites: [{
        type: String,
        required: false
    }],
    endereco: {
        bairro: {
            type: String,
            required: true
        },
        cidade: {
            type: String,
            required: true,
            enum: ['São paulo', 'Rio de janeiro'],
            default: 'São paulo'
        },
        estado: {
            type: String,
            required: true,
            enum: ['SP', 'RJ'],
            default: 'SP'
        },
    }
});

module.exports = mongoose.model('Customer', schema);