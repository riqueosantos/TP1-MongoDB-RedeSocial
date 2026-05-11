const express = require('express');
const router = express.Router();
const {
  inserirPost,
  buscarPosts,
  buscarPostPorId,
  buscarRespostas,
  curtirPost,
  deletarPost
} = require('../crud/posts');

router.post('/', async (req, res) => {
  try {
    const post = await inserirPost(req.body);
    res.status(201).json(post);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await buscarPosts();
    res.json(posts);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await buscarPostPorId(req.params.id);
    if (!post) return res.status(404).json({ erro: 'Post não encontrado' });
    res.json(post);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/:id/respostas', async (req, res) => {
  try {
    const respostas = await buscarRespostas(req.params.id);
    res.json(respostas);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.patch('/:id/curtir', async (req, res) => {
  try {
    const post = await curtirPost(req.params.id);
    res.json(post);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deletarPost(req.params.id);
    res.json({ mensagem: 'Post deletado com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;