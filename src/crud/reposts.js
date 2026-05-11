const Repost = require('../models/Repost');

const inserirRepost = async (dados) => {
  const repost = new Repost(dados);
  return await repost.save();
};

const buscarReposts = async () => {
  return await Repost.find().populate('userId', 'nome username').populate('postOriginal');
};

const curtirRepost = async (id) => {
  return await Repost.findByIdAndUpdate(id, { $inc: { curtidas: 1 } }, { new: true });
};

const deletarRepost = async (id) => {
  return await Repost.findByIdAndDelete(id);
};

module.exports = {
  inserirRepost,
  buscarReposts,
  curtirRepost,
  deletarRepost
};