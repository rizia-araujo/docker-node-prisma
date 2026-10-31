const express = require('express');

function criarAlunoRoutes(alunoService) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      const aluno = await alunoService.criar(req.body);
      res.status(201).json(aluno);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/', async (req, res) => {
    const alunos = await alunoService.listar();
    res.json(alunos);
  });

  router.get('/:id', async (req, res) => {
    const aluno = await alunoService.buscarPorId(Number(req.params.id));
    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
    res.json(aluno);
  });

  router.put('/:id', async (req, res) => {
    try {
      const aluno = await alunoService.atualizar(Number(req.params.id), req.body);
      res.json(aluno);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await alunoService.remover(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: 'Aluno não encontrado' });
    }
  });

  return router;
}

module.exports = { criarAlunoRoutes };