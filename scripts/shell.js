db.users.insertOne({
  nome: "Teste Shell",
  username: "testeshell",
  email: "shell@email.com",
  bio: "Usuário criado pelo shell",
  seguidores: [],
  seguindo: [],
  postsSalvos: [],
  criadoEm: new Date()
});

db.posts.find().pretty();

db.posts.updateOne(
  { conteudo: "Aprendendo MongoDB, incrível essa tecnologia!" },
  { $inc: { curtidas: 1 } }
);

db.users.updateOne(
  { username: "carlos" },
  { $push: { seguindo: ObjectId() } }
);

db.users.deleteOne({ username: "testeshell" });

db.posts.aggregate([
  { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "autor" } },
  { $unwind: "$autor" },
  { $lookup: { from: "hashtags", localField: "hashtags", foreignField: "_id", as: "hashtagsDetalhes" } },
  { $project: { conteudo: 1, curtidas: 1, "autor.nome": 1, "autor.username": 1, "hashtagsDetalhes.nome": 1 } }
]);

db.posts.aggregate([
  { $facet: {
    totalPosts: [{ $count: "total" }],
    postsMaisCurtidos: [{ $sort: { curtidas: -1 } }, { $limit: 5 }, { $project: { conteudo: 1, curtidas: 1 } }],
    mediasCurtidas: [{ $group: { _id: null, mediaCurtidas: { $avg: "$curtidas" }, totalCurtidas: { $sum: "$curtidas" } } }],
    postsComResposta: [{ $match: { replyTo: { $ne: null } } }, { $count: "total" }],
    postsEmComunidade: [{ $match: { communityId: { $ne: null } } }, { $count: "total" }]
  }}
]);