'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/aluno-repository');
const guid = require('guid');
const md5 = require('md5');
const sgMail = require('../services/email-service');
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
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.nome, 3, 'O nome deve conter o mínimo de 3 caracteres');
    contract.hasMaxLen(req.body.nome, 150, 'O nome deve conter o máximo de 150 caracteres');
    contract.isEmail(req.body.email, 'E-mail inválido');
    contract.isCell(req.body.celular, 'Celular inválido');
    contract.isRequired(req.body.senha, 'Senha inválida');
    contract.isRequired(req.body.dataDeNascimento, 'Data de nascimento obrigatório');

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
            dataDeNascimento: req.body.dataDeNascimento
        });

        sgMail.send(
            req.body.email,
            'Bem vindo ao NetWorking!',
            global.EMAIL_TMPL.replace('{0}', req.body.nome)
        );

        res.status(201).send({
            message: 'Aluno cadastrado com sucesso'
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
            message: 'Aluno atualizado com sucesso!'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.put = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.nome, 3, 'O nome deve conter o mínimo de 3 caracteres');
    contract.hasMaxLen(req.body.nome, 150, 'O nome deve conter o máximo de 150 caracteres')
    contract.isEmail(req.body.email, 'E-mail inválido');
    contract.isCell(req.body.celular, 'Celular inválido');
    contract.isTelephone(req.body.telefone, 'Telefone inválido');
    contract.isRequired(req.body.senha, 'Senha inválida');
    contract.isRequired(req.body.imagem, 'Imagem obrigatório');
    contract.isRequired(req.body.dataDeNascimento, 'Data de nascimento obrigatório');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.update(req.params.id, req.body);
        res.status(201).send({
            message: 'Aluno atualizado com sucesso!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.authenticate = async (req, res, next) => {
    try {
        const aluno = await repository.authenticate({
            email: req.body.email,
            senha: md5(req.body.senha + global.SALT_KEY)
        });

        if(!aluno){
            res.status(404).send({
                message: 'Usuário ou senha inválidos'
            });
            return;
        }

        const token = await authService.generateToken({
            id: aluno.id,
            email: aluno.email,
            nome: aluno.nome,
            tag: aluno.tag
        });
        
        res.status(201).send({
            token: token,
            data: {
                id: aluno.id,
                email: aluno.email,
                nome: aluno.nome,
                tag: aluno.tag
            }
        });
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).send({
            message: error.message
        });
    }
}

exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const aluno = await repository.getByID(data.id);

        if(!aluno){
            res.status(404).send({
                message: 'Cliente não encontrado'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: aluno.id,
            email: aluno.email,
            nome: aluno.nome,
            tag: aluno.tag
        });
        
        res.status(201).send({
            token: tokenData,
            data: {
                id: aluno.id,
                email: aluno.email,
                nome: aluno.nome,
                tag: aluno.tag
            }
        });
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).send({
            message: error.message
        });
    }
}