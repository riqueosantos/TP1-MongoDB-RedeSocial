const Community = require('../models/Community');

const inserirCommunity = async (dados) => {
  const community = new Community(dados);
  return await community.save();
};

const buscarCommunities = async () => {
  return await Community.find();
};

const buscarCommunityPorId = async (id) => {
  return await Community.findById(id);
};

const entrarNaCommunity = async (communityId, userId) => {
  return await Community.findByIdAndUpdate(communityId, { $push: { membros: userId } }, { new: true });
};

const sairDaCommunity = async (communityId, userId) => {
  return await Community.findByIdAndUpdate(communityId, { $pull: { membros: userId } }, { new: true });
};

const deletarCommunity = async (id) => {
  return await Community.findByIdAndDelete(id);
};

module.exports = {
  inserirCommunity,
  buscarCommunities,
  buscarCommunityPorId,
  entrarNaCommunity,
  sairDaCommunity,
  deletarCommunity
};