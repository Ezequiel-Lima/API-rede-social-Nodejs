'use strict';

const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.get = async () => {
    const res = await Order.find({}).populate('customer', 'name'); //populate busca o customer e o name retorna somente o nome do customer
    return res;
}

exports.create = async (data) => {
    var order = new Order(data);
    await order.save();
}