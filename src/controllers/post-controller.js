'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/post-repository');
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
        if (req.body.imagem != null) {
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
        }

        if (req.body.aluno != null) {
            await repository.create({
                aluno: req.body.aluno,
                descricao: req.body.descricao,
                //imagem: 'https://networkingfatec.blob.core.windows.net/imagens/' + filename
            });
        } else if (req.body.empresa != null) {
            await repository.create({
                empresa: req.body.empresa,
                descricao: req.body.descricao,
                //imagem: 'https://networkingfatec.blob.core.windows.net/imagens/' + filename
            });
        }

        res.status(201).send({
            message: 'Post cadastrada com sucesso'
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
            message: 'Post atualizado com sucesso!'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}