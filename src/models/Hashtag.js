const mongoose = require('mongoose');

const hashtagSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  totalUsos: { type: Number, default: 0 },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hashtag', hashtagSchema);