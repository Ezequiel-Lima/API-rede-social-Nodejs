'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.get = async () => {
    const res = await Product.find({
        active: true // consulta somente os produtos ativos
    }, 'title price slug'); // campos que eu quero retornar
    return res;
}

exports.getBySlug = async (slug) => {
    const res = await Product.findOne({
        slug: slug, // slug que vai na rota
        active: true // consulta somente os produtos ativos
    }, 'title description price slug tags'); // campos que eu quero retornar
    return res;
}

exports.getById = async (id) => {
    const res = await Product.findById(id); // retornar por id
    return res;
}

exports.getByTag = async (tag) => {
    const res = Product.find({
        tags: tag, // consulta por tag
        active: true
    }, 'title description price slug tags');
    return res;
}

exports.create = async (data) => {
    var product = new Product(data);
    await product.save();
}

exports.update = async (id, data) => {
    await Product.findByIdAndUpdate(id, {
        $set: {
            title: data.title,
            description: data.description,
            price: data.price,
            slug: data.slug
        }
    });
}

exports.delete = async (id) => {
    await Product.findByIdAndRemove(id);
}