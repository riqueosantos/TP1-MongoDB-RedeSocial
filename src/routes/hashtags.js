const express = require('express');
const router = express.Router();
const {
  inserirHashtag,
  buscarHashtags,
  incrementarUsoHashtag
} = require('../crud/hashtags');

router.post('/', async (req, res) => {
  try {
    const hashtag = await inserirHashtag(req.body.nome);
    res.status(201).json(hashtag);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const hashtags = await buscarHashtags();
    res.json(hashtags);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.patch('/:id/incrementar', async (req, res) => {
  try {
    const hashtag = await incrementarUsoHashtag(req.params.id);
    res.json(hashtag);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;