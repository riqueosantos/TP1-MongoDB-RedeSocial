const express = require('express');
const router = express.Router();
const {
  inserirCommunity,
  buscarCommunities,
  buscarCommunityPorId,
  entrarNaCommunity,
  sairDaCommunity,
  deletarCommunity
} = require('../crud/communities');

router.post('/', async (req, res) => {
  try {
    const community = await inserirCommunity(req.body);
    res.status(201).json(community);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const communities = await buscarCommunities();
    res.json(communities);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const community = await buscarCommunityPorId(req.params.id);
    if (!community) return res.status(404).json({ erro: 'Comunidade não encontrada' });
    res.json(community);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.post('/:id/entrar/:userId', async (req, res) => {
  try {
    const community = await entrarNaCommunity(req.params.id, req.params.userId);
    res.json(community);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.post('/:id/sair/:userId', async (req, res) => {
  try {
    const community = await sairDaCommunity(req.params.id, req.params.userId);
    res.json(community);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deletarCommunity(req.params.id);
    res.json({ mensagem: 'Comunidade deletada com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;