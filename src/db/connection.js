const mongoose = require('mongoose');
require('dotenv').config();

const conectarBanco = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado com sucesso!');
  } catch (erro) {
    console.error('Erro ao conectar ao MongoDB:', erro);
    process.exit(1);
  }
};

module.exports = conectarBanco;