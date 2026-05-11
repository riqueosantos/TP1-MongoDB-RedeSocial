const Hashtag = require('../models/Hashtag');

const inserirHashtag = async (nome) => {
  const hashtag = new Hashtag({ nome });
  return await hashtag.save();
};

const buscarHashtags = async () => {
  return await Hashtag.find();
};

const incrementarUsoHashtag = async (id) => {
  return await Hashtag.findByIdAndUpdate(id, { $inc: { totalUsos: 1 } }, { new: true });
};

module.exports = {
  inserirHashtag,
  buscarHashtags,
  incrementarUsoHashtag
};