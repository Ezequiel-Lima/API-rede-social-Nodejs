'use strict';

const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.get = async () => {
    const res = await Post.find({ ativo: true })
    .populate({path:'aluno', select:['nome','tag']})
    .populate({path:'empresa', select:['nome','tag']})
    return res;
}

exports.create = async (data) => {
    var post = new Post(data);
    await post.save();
}

exports.patch = async (id, data) => {
    await Post.findByIdAndUpdate(id, {
        $set: {
            ativo: data.ativo
        }
    });
}