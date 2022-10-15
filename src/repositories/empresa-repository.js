'use strict';

const mongoose = require('mongoose');
const Empresa = mongoose.model('Empresa');
const md5 = require('md5');

exports.get = async () => {
    const res = await Empresa.find({
        ativo: true
    });
    return res;
}

exports.create = async (data) => {
    var empresa = new Empresa(data);
    await empresa.save();
}

exports.patch = async (id, data) => {
    await Empresa.findByIdAndUpdate(id, {
        $set: {
            ativo: data.ativo
        }
    });
}

exports.update = async (id, data) => {
    await Empresa.findByIdAndUpdate(id, {
        $set: {
            nome: data.nome,
            email: data.email,
            senha: md5(data.senha + global.SALT_KEY),
            celular: data.celular,
            telefone: data.telefone,
            linkedin: data.linkedin,
            dataDeFundacao: data.dataDeFundacao,
            sobre: data.sobre,
            vagas: data.vagas,
            sites: data.sites,
            sedesDaEmpresa: data.sedesDaEmpresa
        }
    });
}