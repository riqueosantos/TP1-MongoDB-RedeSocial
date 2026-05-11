const express = require('express');
const router = express.Router();
const { relatorioPosts, relatorioDashboard } = require('../aggregations/reports');

router.get('/posts', async (req, res) => {
  try {
    const relatorio = await relatorioPosts();
    res.json(relatorio);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/dashboard', async (req, res) => {
  try {
    const dashboard = await relatorioDashboard();
    res.json(dashboard);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;