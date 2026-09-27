const express = require('express');
const prisma = require('./prismaClient');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API rodando com Node.js + Prisma + PostgreSQL' });
});

// CREATE
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({ data: { name, email } });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - todos
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// READ - por id
app.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(user);
});

// UPDATE
app.put('/users/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { name, email },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
app.delete('/users/:id', async (req, res) => {
  await prisma.user.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});