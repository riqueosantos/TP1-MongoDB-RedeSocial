const mongoose = require('mongoose');

const repostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postOriginal: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  citacao: { type: String, default: '' },
  curtidas: { type: Number, default: 0 },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Repost', repostSchema);