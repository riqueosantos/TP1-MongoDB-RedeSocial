const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conteudo: { type: String, required: true },
  hashtags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hashtag' }],
  curtidas: { type: Number, default: 0 },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', default: null },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);