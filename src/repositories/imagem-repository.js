'use strict';

const mongoose = require('mongoose');
const ImagemDeVaga = mongoose.model('ImagemDeVaga');

exports.get = async () => {
    const res = await ImagemDeVaga.find({ ativo: true }).populate('empresa', 'nome'); 
    return res;
}

exports.create = async (data) => {
    var imagem = new ImagemDeVaga(data);
    await imagem.save();
}

exports.patch = async (id, data) => {
    await ImagemDeVaga.findByIdAndUpdate(id, {
        $set: {
            ativo: data.ativo
        }
    });
}