const express = require('express');
const router = express.Router();
const {
  inserirRepost,
  buscarReposts,
  curtirRepost,
  deletarRepost
} = require('../crud/reposts');

router.post('/', async (req, res) => {
  try {
    const repost = await inserirRepost(req.body);
    res.status(201).json(repost);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const reposts = await buscarReposts();
    res.json(reposts);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.patch('/:id/curtir', async (req, res) => {
  try {
    const repost = await curtirRepost(req.params.id);
    res.json(repost);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deletarRepost(req.params.id);
    res.json({ mensagem: 'Repost deletado com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;