'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/imagem-repository');
const azure = require('azure-storage');
const guid = require('guid');
const config = require('../config');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.post = async (req, res, next) => {
    try {
        // Cria o Blob Service
        const blobSvc = azure.createBlobService(config.userImagesBlobConnectionString);

        let filename = guid.raw().toString() + '.jpg';
        let rawdata = req.body.imagem;
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');

        //Salva a imagem
        await blobSvc.createBlockBlobFromText('imagens', filename, buffer, {
            contentType: type
        }, function (error, result, response) {
            if (error) {
                filename = 'default-vaga.png'
            }
        });

        const teste = await repository.create({
            empresa: req.body.empresa,
            imagem: 'https://networkingfatec.blob.core.windows.net/imagens/' + filename
        }); console.log(teste);

        res.status(201).send({
            message: 'Imagem cadastrada com sucesso'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
        console.log(error);
    }
}

exports.patch = async (req, res, next) => {
    try {
        await repository.patch(req.params.id, req.body);
        res.status(201).send({
            message: 'Imagem atualizado com sucesso!'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}