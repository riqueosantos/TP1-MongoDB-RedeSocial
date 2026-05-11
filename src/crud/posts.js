const Post = require('../models/Post');
const Hashtag = require('../models/Hashtag');

const inserirPost = async (dados) => {
  const post = new Post(dados);
  return await post.save();
};

const buscarPosts = async () => {
  return await Post.find().populate('userId', 'nome username');
};

const buscarPostPorId = async (id) => {
  return await Post.findById(id).populate('userId', 'nome username');
};

const buscarRespostas = async (postId) => {
  return await Post.find({ replyTo: postId }).populate('userId', 'nome username');
};

const curtirPost = async (id) => {
  return await Post.findByIdAndUpdate(id, { $inc: { curtidas: 1 } }, { new: true });
};

const deletarPost = async (id) => {
  return await Post.findByIdAndDelete(id);
};

module.exports = {
  inserirPost,
  buscarPosts,
  buscarPostPorId,
  buscarRespostas,
  curtirPost,
  deletarPost
};