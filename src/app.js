const express = require('express');
const prisma = require('./prismaClient');
const { criarAlunoService } = require('./services/alunoService');
const { criarAlunoRoutes } = require('./routes/alunoRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API rodando com Node.js + Prisma + PostgreSQL' });
});

const alunoService = criarAlunoService(prisma);
app.use('/alunos', criarAlunoRoutes(alunoService));

module.exports = app;