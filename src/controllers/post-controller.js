'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/post-repository');
const azure = require('azure-storage');
const guid = require('guid');
const config = require('../config');
const authService = require('../services/auth-service');

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
        // Recuper o token
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        if (data.tag == 'Aluno') {
            await repository.create({
                aluno: data.id,
                descricao: req.body.descricao
            });
        } else if (data.tag == 'Empresa') {
            await repository.create({
                empresa: data.id,
                descricao: req.body.descricao
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