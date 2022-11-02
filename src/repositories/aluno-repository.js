'use strict';

const mongoose = require('mongoose');
const Aluno = mongoose.model('Aluno');
const azure = require('azure-storage');
const guid = require('guid');
const config = require('../config');

exports.get = async () => {
    const res = await Aluno.find({
        ativo: true
    });
    return res;
}

exports.create = async (data) => {
    var aluno = new Aluno(data);
    await aluno.save();
}

exports.patch = async (id, data) => {
    await Aluno.findByIdAndUpdate(id, {
        $set: {
            ativo: data.ativo
        }
    });
}

exports.update = async (id, data) => {
    // Cria o Blob Service
    const blobSvc = azure.createBlobService(config.userImagesBlobConnectionString);

    let filename = guid.raw().toString() + '.jpg';
    let rawdata = data.imagem;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer(matches[2], 'base64');

    //Salva a imagem
    await blobSvc.createBlockBlobFromText('imagens', filename, buffer, {
        contentType: type
    }, function (error, result, response) {
        if (error) {
            filename = 'default-aluno.png'
        }
    });

    await Aluno.findByIdAndUpdate(id, {
        $set: {
            nome: data.nome,
            email: data.email,
            senha: data.senha,
            experiencias: data.experiencias,
            celular: data.celular,
            telefone: data.telefone,
            linkedin: data.linkedin,
            escolaridade: data.escolaridade,
            dataDeNascimento: data.dataDeNascimento,
            cursos: data.cursos,
            sites: data.sites,
            endereco: data.endereco,
            imagem: 'https://networkingfatec.blob.core.windows.net/imagens/' + filename
        }
    });
}