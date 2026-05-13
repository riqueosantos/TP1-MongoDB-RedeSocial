### Pré-requisitos

- [Node.js](https://nodejs.org/)
- [MongoDB Community](https://www.mongodb.com/try/download/community) instalado localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/TP1-MongoDB-RedeSocial
cd TP1-MongoDB-RedeSocial
```

### 2. Instalar dependências

```bash
npm install
npm install cors
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

MONGO_URI=mongodb://localhost:27017/redesocial
PORT=3000

### 4. Iniciar o MongoDB

No PowerShell como administrador:

```bash
net start MongoDB
```

### 5. Popular o banco com dados de teste

```bash
node scripts/seed.js
```

### 6. Iniciar o servidor

```bash
node --watch index.js
```

### 7. Acessar a aplicação

Abra o arquivo `frontend/index.html` no navegador.