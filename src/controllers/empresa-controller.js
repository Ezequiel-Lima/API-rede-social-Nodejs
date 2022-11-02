'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/empresa-repository');
const guid = require('guid');
const md5 = require('md5');
const sgMail = require('../services/email-service');


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
    contract.isCell(req.body.celular, 'Celular inválido');
    contract.isRequired(req.body.senha, 'Senha inválida');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            nome: req.body.nome,
            email: req.body.email,
            senha: md5(req.body.senha + global.SALT_KEY),
            celular: req.body.celular,
            dataDeFundacao: req.body.dataDeFundacao
        });

        sgMail.send(
            req.body.email,
            'Bem vindo ao NetWorking!',
            global.EMAIL_TMPL.replace('{0}', req.body.nome)
        );

        res.status(201).send({
            message: 'Empresa cadastrado com sucesso'
        });
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).send({
            message: error.message
        });
    }
}

exports.patch = async (req, res, next) => {
    try {
        await repository.patch(req.params.id, req.body);
        res.status(201).send({
            message: 'Empresa atualizada com sucesso!'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.put = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.nome, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'E-mail inválido');
    contract.isCell(req.body.celular, 'Celular inválido');
    contract.isTelephone(req.body.telefone, 'Telefone inválido');
    contract.isRequired(req.body.senha, 'Senha inválida');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.update(req.params.id, req.body);
        res.status(201).send({
            message: 'Empresa atualizada com sucesso!'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}
