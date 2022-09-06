'use strict';

const { default: mongoose } = require("mongoose");
const Product = mongoose.model('Product');
const ValidationContract = require('../validators/fluent-validator');

exports.get = (req, res, next) => {
    Product.find({ 
        active: true // consulta somente os produtos ativos
    }, 'title price slug') // campos que eu quero retornar
    .then(data => {
        res.status(200).send(data);
    }).catch(erro => {
        res.status(400).send(erro); 
    });
}

exports.getBySlug = (req, res, next) => {
    Product.findOne({ 
        slug: req.params.slug, // slug que vai na rota
        active: true // consulta somente os produtos ativos
    }, 'title description price slug tags') // campos que eu quero retornar
    .then(data => {
        res.status(200).send(data);
    }).catch(erro => {
        res.status(400).send(erro); 
    });
}

exports.getById = (req, res, next) => {
    Product.findById(req.params.id) // retornar por id
    .then(data => {
        res.status(200).send(data);
    }).catch(erro => {
        res.status(400).send(erro); 
    });
}

exports.getByTag = (req, res, next) => {
    Product.find({
        tags: req.params.tag, // consulta por tag
        active: true
    }, 'title description price slug tags') 
    .then(data => {
        res.status(200).send(data);
    }).catch(erro => {
        res.status(400).send(erro); 
    });
}

exports.post = (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O titulo deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'O descrição deve conter pelo menos 3 caracteres');
    
    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    var product = new Product(req.body);
    product.save()
        .then(x => {
            res.status(201).send({ message: 'Produto cadastrado com sucesso'});
        })
        .catch(e => {
            res.status(400).send({ 
                message: 'Falha ao cadastrar o produto', 
                data: e}); 
        });
};

exports.put = (req, res, next) => {
    Product.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price
        }
    }).then(x => {
        res.status(201).send({
            message: 'Produto atualizado com sucesso!'
        });
    }).catch(e => {
        res.status(400).send({
            message: 'Falha ao atualizar produto',
            data: e
        });
    });
};

exports.delete = (req, res, next) => {
    Product.findByIdAndRemove(req.params.id)
    .then(x => {
        res.status(200).send({
            message: 'Produto removido com sucesso!'
        });
    }).catch(e => {
        res.status(400).send({
            message: 'Falha ao remover o produto',
            data: e
        });
    });
};