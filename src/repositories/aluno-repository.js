'use strict';

const mongoose = require('mongoose');
const Aluno = mongoose.model('Aluno');

exports.get = async () => {
    const res = await Aluno.find({});
    return res;
}

exports.create = async (data) => {
    var aluno = new Aluno(data);
    await aluno.save();
}