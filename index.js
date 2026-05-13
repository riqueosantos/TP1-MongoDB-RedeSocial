const express = require('express');
const conectarBanco = require('./src/db/connection');
require('dotenv').config();

const usersRoutes = require('./src/routes/users');
const postsRoutes = require('./src/routes/posts');
const repostsRoutes = require('./src/routes/reposts');
const communitiesRoutes = require('./src/routes/communities');
const hashtagsRoutes = require('./src/routes/hashtags');
const reportsRoutes = require('./src/routes/reports');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

conectarBanco();

app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);
app.use('/reposts', repostsRoutes);
app.use('/communities', communitiesRoutes);
app.use('/hashtags', hashtagsRoutes);
app.use('/reports', reportsRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});