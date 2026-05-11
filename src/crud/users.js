const User = require('../models/User');

const inserirUsuario = async (dados) => {
  const user = new User(dados);
  return await user.save();
};

const buscarUsuarios = async () => {
  return await User.find();
};

const buscarUsuarioPorId = async (id) => {
  return await User.findById(id);
};

const atualizarUsuario = async (id, dados) => {
  return await User.findByIdAndUpdate(id, dados, { new: true });
};

const deletarUsuario = async (id) => {
  return await User.findByIdAndDelete(id);
};

const seguirUsuario = async (meuId, alvoId) => {
  await User.findByIdAndUpdate(meuId, { $push: { seguindo: alvoId } });
  await User.findByIdAndUpdate(alvoId, { $push: { seguidores: meuId } });
};

const deixarDeSeguir = async (meuId, alvoId) => {
  await User.findByIdAndUpdate(meuId, { $pull: { seguindo: alvoId } });
  await User.findByIdAndUpdate(alvoId, { $pull: { seguidores: meuId } });
};

const salvarPost = async (userId, postId) => {
  return await User.findByIdAndUpdate(userId, { $push: { postsSalvos: postId } }, { new: true });
};

module.exports = {
  inserirUsuario,
  buscarUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  deletarUsuario,
  seguirUsuario,
  deixarDeSeguir,
  salvarPost
};