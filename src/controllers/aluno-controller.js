'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/aluno-repository');
const guid = require('guid');

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
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.nome, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'E-mail inválido');

    try {
        await repository.create({
            nome: req.body.nome,
            email: req.body.email,
            celular: req.body.celular,
            escolaridade: req.body.escolaridade, // retirar
            dataDeNascimento: req.body.dataDeNascimento,
            endereco: req.body.endereco //retirar requirdo
        });
        res.status(201).send({
            message: 'Aluno cadastrado com sucesso'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}