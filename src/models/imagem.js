'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const schema = new Schema({
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa'
    },
    imagem: {
        type: String,
        required: true,
        trim: true
    },
    ativo: {
        type: Boolean,
        required: true,
        default: true
    },
});

schema.plugin(uniqueValidator, { message: '{VALUE} já cadastrado!' });
module.exports = mongoose.model('ImagemDeVaga', schema);