'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const schema = new Schema({
    aluno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aluno',
        required: false
    },
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa',
        required: false
    },
    like: {
        type: Number,
        required: true,
        default: 0
    },
    descricao: {
        type: String,
        required: true
    },
    ativo: {
        type: Boolean,
        required: true,
        default: true
    },
});

schema.plugin(uniqueValidator, { message: '{VALUE} já cadastrado!' });
module.exports = mongoose.model('Post', schema);