'use strict';

const mongoose = require('mongoose');
const Empresa = mongoose.model('Empresa');
const md5 = require('md5');
const azure = require('azure-storage');
const guid = require('guid');
const config = require('../config');

exports.get = async () => {
    const res = await Empresa.find({
        ativo: true
    });
    return res;
}

exports.create = async (data) => {
    var empresa = new Empresa(data);
    await empresa.save();
}

exports.patch = async (id, data) => {
    await Empresa.findByIdAndUpdate(id, {
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
            filename = 'default-empresa.png'
        }
    });

    await Empresa.findByIdAndUpdate(id, {
        $set: {
            nome: data.nome,
            email: data.email,
            senha: md5(data.senha + global.SALT_KEY),
            celular: data.celular,
            telefone: data.telefone,
            linkedin: data.linkedin,
            dataDeFundacao: data.dataDeFundacao,
            sobre: data.sobre,
            vagas: data.vagas,
            sites: data.sites,
            sedesDaEmpresa: data.sedesDaEmpresa,
            imagem: 'https://networkingfatec.blob.core.windows.net/imagens/' + filename
        }
    });
}

exports.authenticate = async(data) => {
    const res = await Empresa.findOne({
        email: data.email,
        senha: data.senha
    });
    return res;
}