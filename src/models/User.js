const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String, default: '' },
  seguidores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  seguindo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  postsSalvos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);