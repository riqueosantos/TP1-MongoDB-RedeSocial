const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../src/models/User');
const Post = require('../src/models/Post');
const Repost = require('../src/models/Repost');
const Community = require('../src/models/Community');
const Hashtag = require('../src/models/Hashtag');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Conectado ao banco!');

  // Limpa o banco
  await User.deleteMany();
  await Post.deleteMany();
  await Repost.deleteMany();
  await Community.deleteMany();
  await Hashtag.deleteMany();
  console.log('Banco limpo!');

  // Hashtags
  const [h1, h2, h3] = await Hashtag.insertMany([
    { nome: 'NoSQL', totalUsos: 5 },
    { nome: 'MongoDB', totalUsos: 8 },
    { nome: 'JavaScript', totalUsos: 12 }
  ]);
  console.log('Hashtags criadas!');

  // Usuários
  const [u1, u2, u3] = await User.insertMany([
    { nome: 'Carlos Silva', username: 'carlos', email: 'carlos@email.com', bio: 'Desenvolvedor e estudante de ADS' },
    { nome: 'Lucas Henrique', username: 'lucas', email: 'lucas@email.com', bio: 'Frontend developer' },
    { nome: 'Ana Souza', username: 'ana', email: 'ana@email.com', bio: 'Apaixonada por banco de dados' }
  ]);
  console.log('Usuários criados!');

  // Seguindo
  await User.findByIdAndUpdate(u1._id, { $push: { seguindo: u2._id } });
  await User.findByIdAndUpdate(u2._id, { $push: { seguidores: u1._id } });
  await User.findByIdAndUpdate(u1._id, { $push: { seguindo: u3._id } });
  await User.findByIdAndUpdate(u3._id, { $push: { seguidores: u1._id } });
  await User.findByIdAndUpdate(u2._id, { $push: { seguindo: u1._id } });
  await User.findByIdAndUpdate(u1._id, { $push: { seguidores: u2._id } });
  console.log('Seguindo configurado!');

  // Comunidade
  const [c1] = await Community.insertMany([
    { nome: 'Devs NoSQL', descricao: 'Comunidade para devs que amam NoSQL', moderadores: [u1._id], membros: [u1._id, u2._id, u3._id] }
  ]);
  console.log('Comunidades criadas!');

  // Posts
  const [p1, p2, p3, p4] = await Post.insertMany([
    { userId: u1._id, conteudo: 'Aprendendo MongoDB, incrível essa tecnologia!', hashtags: [h1._id, h2._id], curtidas: 10 },
    { userId: u2._id, conteudo: 'JavaScript é a linguagem do futuro!', hashtags: [h3._id], curtidas: 7 },
    { userId: u3._id, conteudo: 'NoSQL vs SQL, qual você prefere?', hashtags: [h1._id], curtidas: 15, communityId: c1._id },
    { userId: u1._id, conteudo: 'Aggregation Framework do MongoDB é poderoso demais!', hashtags: [h2._id], curtidas: 5 }
  ]);
  console.log('Posts criados!');

  // Replies
  await Post.insertMany([
    { userId: u2._id, conteudo: 'Concordo! MongoDB mudou minha vida!', replyTo: p1._id, curtidas: 3 },
    { userId: u3._id, conteudo: 'Prefiro NoSQL para dados não estruturados!', replyTo: p3._id, curtidas: 2 }
  ]);
  console.log('Replies criados!');

  // Posts salvos
  await User.findByIdAndUpdate(u1._id, { $push: { postsSalvos: p3._id } });
  await User.findByIdAndUpdate(u2._id, { $push: { postsSalvos: p1._id } });
  console.log('Posts salvos configurados!');

  // Reposts
  await Repost.insertMany([
    { userId: u2._id, postOriginal: p1._id, citacao: 'Muito bom esse conteúdo!', curtidas: 2 },
    { userId: u3._id, postOriginal: p2._id, citacao: '', curtidas: 0 }
  ]);
  console.log('Reposts criados!');

  console.log('\n✅ Seed concluído com sucesso!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});