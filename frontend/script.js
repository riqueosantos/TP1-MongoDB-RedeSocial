const API = 'http://localhost:3000';

const state = {
  usuarioAtual: null,
  usuarios: [],
  posts: [],
  reposts: [],
  hashtags: [],
  communities: [],
  dashboard: null,
  secaoAtual: 'feed',
  postRespondendo: null,
  busca: ''
};

const feed = document.getElementById('feed');
const tituloPagina = document.getElementById('tituloPagina');
const composer = document.getElementById('composer');
const conteudoPost = document.getElementById('conteudoPost');
const contador = document.getElementById('contador');
const mensagem = document.getElementById('mensagem');
const modalResposta = document.getElementById('modalResposta');
const textoResposta = document.getElementById('textoResposta');
const postOriginalResumo = document.getElementById('postOriginalResumo');

async function apiGet(url) {
  const resposta = await fetch(API + url);
  if (!resposta.ok) throw new Error('Erro ao buscar dados em ' + url);
  return resposta.json();
}

async function apiSend(url, metodo, dados) {
  const resposta = await fetch(API + url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: dados ? JSON.stringify(dados) : undefined
  });

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.erro || 'Erro na operação');
  }

  return resposta.json();
}

function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.className = erro ? 'mensagem erro' : 'mensagem';

  setTimeout(() => {
    mensagem.classList.add('oculto');
  }, 3000);
}

function inicial(nome) {
  return (nome || 'U').charAt(0).toUpperCase();
}

function formatarData(data) {
  if (!data) return 'agora';
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  });
}

function textoComHashtags(texto) {
  return texto.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
}

function encontrarUsuario(idOuObjeto) {
  if (!idOuObjeto) return null;
  if (typeof idOuObjeto === 'object') return idOuObjeto;
  return state.usuarios.find(usuario => usuario._id === idOuObjeto);
}

async function carregarDados() {
  try {
    const [usuarios, posts, reposts, hashtags, communities, dashboard] = await Promise.all([
      apiGet('/users'),
      apiGet('/posts'),
      apiGet('/reposts'),
      apiGet('/hashtags'),
      apiGet('/communities'),
      apiGet('/reports/dashboard').catch(() => null)
    ]);

    state.usuarios = usuarios;
    state.posts = posts.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
    state.reposts = reposts;
    state.hashtags = hashtags.sort((a, b) => b.totalUsos - a.totalUsos);
    state.communities = communities;
    state.dashboard = Array.isArray(dashboard) ? dashboard[0] : dashboard;
    state.usuarioAtual = state.usuarioAtual || usuarios[0] || null;

    renderizarTudo();
  } catch (erro) {
    feed.innerHTML = `<div class="vazio">Não foi possível conectar na API. Verifique se o servidor e o MongoDB estão rodando.</div>`;
    mostrarMensagem(erro.message, true);
  }
}

function renderizarTudo() {
  renderizarUsuarioAtual();
  renderizarLateral();
  renderizarSecao();
}

function renderizarUsuarioAtual() {
  const box = document.getElementById('usuarioLogadoBox');
  const avatarComposer = document.getElementById('avatarComposer');

  if (!state.usuarioAtual) {
    box.textContent = 'Nenhum usuário encontrado';
    avatarComposer.textContent = 'U';
    return;
  }

  avatarComposer.textContent = inicial(state.usuarioAtual.nome);
  box.innerHTML = `<strong>${state.usuarioAtual.nome}</strong><br><span>@${state.usuarioAtual.username}</span>`;
}

function renderizarLateral() {
  document.getElementById('hashtagsLista').innerHTML = state.hashtags.slice(0, 5).map(tag => `
    <div class="item-lateral">
      <strong>#${tag.nome}</strong>
      <span>${tag.totalUsos} publicações</span>
    </div>
  `).join('') || '<div class="item-lateral">Nenhuma hashtag encontrada</div>';

  document.getElementById('usuariosLista').innerHTML = state.usuarios
    .filter(usuario => !state.usuarioAtual || usuario._id !== state.usuarioAtual._id)
    .slice(0, 4)
    .map(usuario => `
      <div class="item-lateral">
        <strong>${usuario.nome}</strong>
        <span>@${usuario.username}</span><br>
        <button onclick="seguirUsuario('${usuario._id}')">Seguir</button>
      </div>
    `).join('') || '<div class="item-lateral">Nenhum usuário encontrado</div>';
}

function renderizarSecao() {
  document.querySelectorAll('.menu-item').forEach(botao => {
    botao.classList.toggle('active', botao.dataset.section === state.secaoAtual);
  });

  const titulos = {
    feed: 'Início',
    explorar: 'Explorar',
    comunidades: 'Comunidades',
    salvos: 'Salvos',
    perfil: 'Perfil',
    dashboard: 'Dashboard'
  };

  tituloPagina.textContent = titulos[state.secaoAtual];
  composer.classList.toggle('oculto', state.secaoAtual !== 'feed');

  if (state.secaoAtual === 'feed') renderizarFeed();
  if (state.secaoAtual === 'explorar') renderizarExplorar();
  if (state.secaoAtual === 'comunidades') renderizarComunidades();
  if (state.secaoAtual === 'salvos') renderizarSalvos();
  if (state.secaoAtual === 'perfil') renderizarPerfil();
  if (state.secaoAtual === 'dashboard') renderizarDashboard();
}

function postsFiltrados() {
  const termo = state.busca.toLowerCase().trim();
  let posts = state.posts.filter(post => !post.replyTo);

  if (termo) {
    posts = posts.filter(post => post.conteudo.toLowerCase().includes(termo));
  }

  return posts;
}

function renderizarFeed() {
  const posts = postsFiltrados();
  feed.innerHTML = posts.map(criarHtmlPost).join('') || '<div class="vazio">Nenhum post encontrado.</div>';
}

function criarHtmlPost(post) {
  const autor = encontrarUsuario(post.userId) || { nome: 'Usuário', username: 'usuario' };
  const totalRespostas = state.posts.filter(p => String(p.replyTo) === String(post._id)).length;

  return `
    <article class="post">
      <div class="avatar">${inicial(autor.nome)}</div>
      <div class="post-body">
        <div class="post-header">
          <span class="nome">${autor.nome}</span>
          <span class="username">@${autor.username}</span>
          <span class="data">· ${formatarData(post.criadoEm)}</span>
        </div>
        <p class="conteudo-post">${textoComHashtags(post.conteudo)}</p>
        <div class="acoes">
          <button onclick="abrirResposta('${post._id}')">💬 ${totalRespostas}</button>
          <button onclick="repostar('${post._id}')">🔁</button>
          <button onclick="curtirPost('${post._id}')">♡ ${post.curtidas || 0}</button>
          <button onclick="salvarPost('${post._id}')">🔖</button>
          <button onclick="deletarPost('${post._id}')">🗑️</button>
        </div>
      </div>
    </article>
  `;
}

function renderizarExplorar() {
  const postsOrdenados = [...state.posts].sort((a, b) => (b.curtidas || 0) - (a.curtidas || 0));
  feed.innerHTML = postsOrdenados.map(criarHtmlPost).join('') || '<div class="vazio">Nada para explorar.</div>';
}

function renderizarComunidades() {
  feed.innerHTML = state.communities.map(comunidade => `
    <div class="item-lateral">
      <strong>${comunidade.nome}</strong>
      <p>${comunidade.descricao || 'Sem descrição'}</p>
      <span>${comunidade.membros?.length || 0} membros</span><br>
      <button onclick="entrarComunidade('${comunidade._id}')">Entrar</button>
    </div>
  `).join('') || '<div class="vazio">Nenhuma comunidade encontrada.</div>';
}

function renderizarSalvos() {
  if (!state.usuarioAtual) {
    feed.innerHTML = '<div class="vazio">Nenhum usuário selecionado.</div>';
    return;
  }

  const idsSalvos = state.usuarioAtual.postsSalvos || [];
  const postsSalvos = state.posts.filter(post => idsSalvos.includes(post._id));
  feed.innerHTML = postsSalvos.map(criarHtmlPost).join('') || '<div class="vazio">Você ainda não salvou posts.</div>';
}

function renderizarPerfil() {
  if (!state.usuarioAtual) {
    feed.innerHTML = '<div class="vazio">Nenhum usuário encontrado.</div>';
    return;
  }

  const meusPosts = state.posts.filter(post => {
    const idAutor = typeof post.userId === 'object' ? post.userId._id : post.userId;
    return idAutor === state.usuarioAtual._id;
  });

  feed.innerHTML = `
    <section>
      <div class="perfil-capa"></div>
      <div class="perfil-info">
        <div class="avatar">${inicial(state.usuarioAtual.nome)}</div>
        <h2>${state.usuarioAtual.nome}</h2>
        <p class="username">@${state.usuarioAtual.username}</p>
        <p>${state.usuarioAtual.bio || 'Sem bio cadastrada.'}</p>
        <div class="stats">
          <span><strong>${state.usuarioAtual.seguindo?.length || 0}</strong> seguindo</span>
          <span><strong>${state.usuarioAtual.seguidores?.length || 0}</strong> seguidores</span>
          <span><strong>${meusPosts.length}</strong> posts</span>
        </div>
      </div>
    </section>
    ${meusPosts.map(criarHtmlPost).join('') || '<div class="vazio">Esse perfil ainda não publicou.</div>'}
  `;
}

function renderizarDashboard() {
  const dash = state.dashboard || {};
  const totalPosts = dash.totalPosts?.[0]?.total || state.posts.length;
  const totalRespostas = dash.postsComResposta?.[0]?.total || state.posts.filter(p => p.replyTo).length;
  const totalComunidade = dash.postsEmComunidade?.[0]?.total || state.posts.filter(p => p.communityId).length;
  const totalCurtidas = dash.mediasCurtidas?.[0]?.totalCurtidas || state.posts.reduce((soma, p) => soma + (p.curtidas || 0), 0);

  feed.innerHTML = `
    <div class="dashboard-grid">
      <div class="metric-card"><span>Total de posts</span><strong>${totalPosts}</strong></div>
      <div class="metric-card"><span>Total de curtidas</span><strong>${totalCurtidas}</strong></div>
      <div class="metric-card"><span>Respostas</span><strong>${totalRespostas}</strong></div>
      <div class="metric-card"><span>Posts em comunidades</span><strong>${totalComunidade}</strong></div>
    </div>
    <section class="card-info">
      <h2>Posts mais curtidos</h2>
      ${(dash.postsMaisCurtidos || []).map(post => `
        <div class="item-lateral">
          <strong>${post.conteudo}</strong>
          <span>${post.curtidas} curtidas</span>
        </div>
      `).join('')}
    </section>
  `;
}

async function criarPost() {
  const conteudo = conteudoPost.value.trim();

  if (!state.usuarioAtual) return mostrarMensagem('Cadastre um usuário primeiro.', true);
  if (!conteudo) return mostrarMensagem('Digite algo para postar.', true);

  try {
    await apiSend('/posts', 'POST', {
      userId: state.usuarioAtual._id,
      conteudo
    });
    conteudoPost.value = '';
    contador.textContent = '0/280';
    mostrarMensagem('Post publicado com sucesso!');
    await carregarDados();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function curtirPost(id) {
  try {
    await apiSend(`/posts/${id}/curtir`, 'PATCH');
    await carregarDados();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function deletarPost(id) {
  try {
    await apiSend(`/posts/${id}`, 'DELETE');
    mostrarMensagem('Post apagado.');
    await carregarDados();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function salvarPost(id) {
  if (!state.usuarioAtual) return;

  try {
    const usuarioAtualizado = await apiSend(`/users/${state.usuarioAtual._id}/salvarpost/${id}`, 'POST');
    state.usuarioAtual = usuarioAtualizado;
    mostrarMensagem('Post salvo.');
    await carregarDados();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function seguirUsuario(alvoId) {
  if (!state.usuarioAtual) return;

  try {
    await apiSend(`/users/${state.usuarioAtual._id}/seguir/${alvoId}`, 'POST');
    mostrarMensagem('Agora você está seguindo esse usuário.');
    await carregarDados();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function entrarComunidade(id) {
  if (!state.usuarioAtual) return;

  try {
    await apiSend(`/communities/${id}/entrar/${state.usuarioAtual._id}`, 'POST');
    mostrarMensagem('Você entrou na comunidade.');
    await carregarDados();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function repostar(postId) {
  if (!state.usuarioAtual) return;

  try {
    await apiSend('/reposts', 'POST', {
      userId: state.usuarioAtual._id,
      postOriginal: postId,
      citacao: 'Repostado'
    });
    mostrarMensagem('Repost feito com sucesso.');
    await carregarDados();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

function abrirResposta(postId) {
  const post = state.posts.find(p => p._id === postId);
  state.postRespondendo = post;
  postOriginalResumo.textContent = post ? post.conteudo : '';
  textoResposta.value = '';
  modalResposta.classList.remove('oculto');
}

async function enviarResposta() {
  const conteudo = textoResposta.value.trim();

  if (!conteudo) return mostrarMensagem('Digite uma resposta.', true);
  if (!state.usuarioAtual || !state.postRespondendo) return;

  try {
    await apiSend('/posts', 'POST', {
      userId: state.usuarioAtual._id,
      conteudo,
      replyTo: state.postRespondendo._id
    });
    modalResposta.classList.add('oculto');
    mostrarMensagem('Resposta publicada.');
    await carregarDados();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

document.querySelectorAll('.menu-item').forEach(botao => {
  botao.addEventListener('click', () => {
    state.secaoAtual = botao.dataset.section;
    renderizarSecao();
  });
});

document.getElementById('criarPost').addEventListener('click', criarPost);
document.getElementById('abrirPostagem').addEventListener('click', () => conteudoPost.focus());
document.getElementById('fecharModal').addEventListener('click', () => modalResposta.classList.add('oculto'));
document.getElementById('enviarResposta').addEventListener('click', enviarResposta);

document.getElementById('pesquisa').addEventListener('input', event => {
  state.busca = event.target.value;
  state.secaoAtual = 'feed';
  renderizarSecao();
});

conteudoPost.addEventListener('input', () => {
  contador.textContent = `${conteudoPost.value.length}/280`;
});

carregarDados();
