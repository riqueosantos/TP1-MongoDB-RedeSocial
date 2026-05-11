const Post = require('../models/Post');
const Hashtag = require('../models/Hashtag');

//Posts com dados do autor e hashtags
const relatorioPosts = async () => {
  return await Post.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'autor'
      }
    },
    { $unwind: '$autor' },
    {
      $lookup: {
        from: 'hashtags',
        localField: 'hashtags',
        foreignField: '_id',
        as: 'hashtagsDetalhes'
      }
    },
    {
      $project: {
        conteudo: 1,
        curtidas: 1,
        criadoEm: 1,
        'autor.nome': 1,
        'autor.username': 1,
        'hashtagsDetalhes.nome': 1
      }
    }
  ]);
};

//Dashboard geral da rede social
const relatorioDashboard = async () => {
  return await Post.aggregate([
    {
      $facet: {
        totalPosts: [
          { $count: 'total' }
        ],
        postsMaisCurtidos: [
          { $sort: { curtidas: -1 } },
          { $limit: 5 },
          { $project: { conteudo: 1, curtidas: 1 } }
        ],
        mediasCurtidas: [
          {
            $group: {
              _id: null,
              mediaCurtidas: { $avg: '$curtidas' },
              totalCurtidas: { $sum: '$curtidas' }
            }
          }
        ],
        postsComResposta: [
          { $match: { replyTo: { $ne: null } } },
          { $count: 'total' }
        ],
        postsEmComunidade: [
          { $match: { communityId: { $ne: null } } },
          { $count: 'total' }
        ]
      }
    }
  ]);
};

module.exports = {
  relatorioPosts,
  relatorioDashboard
};