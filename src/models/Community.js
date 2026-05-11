const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, default: '' },
  moderadores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  membros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Community', communitySchema);