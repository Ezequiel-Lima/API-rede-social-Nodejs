'use strict';

const mongoose = require('mongoose');
const Aluno = mongoose.model('Aluno');

exports.get = async () => {
    const res = await Aluno.find({
        ativo: true
    });
    return res;
}

exports.create = async (data) => {
    var aluno = new Aluno(data);
    await aluno.save();
}

exports.patch = async (id, data) => {
    await Aluno.findByIdAndUpdate(id, {
        $set: {
            ativo: data.ativo
        }
    });
}

exports.update = async (id, data) => {
    await Aluno.findByIdAndUpdate(id, {
        $set: {
            nome: data.nome,
            email: data.email,
            experiencias: data.experiencias,
            celular: data.celular,
            telefone: data.telefone,
            linkedin: data.linkedin,
            escolaridade: data.escolaridade,
            dataDeNascimento: data.dataDeNascimento,
            cursos: data.cursos,
            sites: data.sites,
            endereco: data.endereco
        }
    });
}