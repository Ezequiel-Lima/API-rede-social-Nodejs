'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.get = () => {
    return Product
        .find({
            active: true // consulta somente os produtos ativos
        }, 'title price slug'); // campos que eu quero retornar
}

exports.getBySlug = (slug) => {
    return Product
        .findOne({
            slug: slug, // slug que vai na rota
            active: true // consulta somente os produtos ativos
        }, 'title description price slug tags'); // campos que eu quero retornar
}

exports.getById = (id) => {
    return Product
        .findById(id); // retornar por id
}

exports.getByTag = (tag) => {
    return Product
        .find({
            tags: tag, // consulta por tag
            active: true
        }, 'title description price slug tags');
}

exports.create = (data) => {
    var product = new Product(data);
    return product.save();
}

exports.update = (id, data) => {
    return Product
        .findByIdAndUpdate(id, {
            $set: {
                title: data.title,
                description: data.description,
                price: data.price,
                slug: data.slug
            }
        });
}

exports.delete = (id) => {
    return Product
        .findByIdAndRemove(id);
}