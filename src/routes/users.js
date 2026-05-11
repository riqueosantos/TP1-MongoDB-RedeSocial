const express = require('express');
const router = express.Router();
const {
  inserirUsuario,
  buscarUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  deletarUsuario,
  seguirUsuario,
  deixarDeSeguir,
  salvarPost
} = require('../crud/users');

router.post('/', async (req, res) => {
  try {
    const user = await inserirUsuario(req.body);
    res.status(201).json(user);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await buscarUsuarios();
    res.json(users);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await buscarUsuarioPorId(req.params.id);
    if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(user);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await atualizarUsuario(req.params.id, req.body);
    res.json(user);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deletarUsuario(req.params.id);
    res.json({ mensagem: 'Usuário deletado com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.post('/:id/seguir/:alvoId', async (req, res) => {
  try {
    await seguirUsuario(req.params.id, req.params.alvoId);
    res.json({ mensagem: 'Seguindo com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.post('/:id/deixardeseguir/:alvoId', async (req, res) => {
  try {
    await deixarDeSeguir(req.params.id, req.params.alvoId);
    res.json({ mensagem: 'Deixou de seguir com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.post('/:id/salvarpost/:postId', async (req, res) => {
  try {
    const user = await salvarPost(req.params.id, req.params.postId);
    res.json(user);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;