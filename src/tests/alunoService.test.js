import { describe, it, expect, vi, beforeEach } from 'vitest';
import alunoServiceModule from '../services/alunoService.js';

const { criarAlunoService } = alunoServiceModule;

describe('alunoService', () => {
  let prismaFalso;
  let service;

  beforeEach(() => {
    // o "estoquista de mentira": cada método é uma função espiã
    prismaFalso = {
      aluno: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };
    service = criarAlunoService(prismaFalso);
  });

  it('cria um aluno chamando o prisma com os dados certos', async () => {
    const entrada = { name: 'Maria', email: 'maria@teste.com' };
    prismaFalso.aluno.create.mockResolvedValue({ id: 1, ...entrada });

    const resultado = await service.criar(entrada);

    expect(prismaFalso.aluno.create).toHaveBeenCalledWith({ data: entrada });
    expect(resultado).toEqual({ id: 1, ...entrada });
  });

  it('lista todos os alunos', async () => {
    const lista = [{ id: 1, name: 'Maria', email: 'maria@teste.com' }];
    prismaFalso.aluno.findMany.mockResolvedValue(lista);

    const resultado = await service.listar();

    expect(resultado).toEqual(lista);
    expect(prismaFalso.aluno.findMany).toHaveBeenCalledTimes(1);
  });

  it('busca aluno por id', async () => {
    prismaFalso.aluno.findUnique.mockResolvedValue({ id: 5, name: 'João' });

    const resultado = await service.buscarPorId(5);

    expect(prismaFalso.aluno.findUnique).toHaveBeenCalledWith({ where: { id: 5 } });
    expect(resultado.name).toBe('João');
  });

  it('retorna null quando o aluno não existe', async () => {
    prismaFalso.aluno.findUnique.mockResolvedValue(null);

    const resultado = await service.buscarPorId(999);

    expect(resultado).toBeNull();
  });

  it('repassa o erro do banco quando o e-mail já existe', async () => {
    prismaFalso.aluno.create.mockRejectedValue(new Error('Unique constraint failed'));

    await expect(
      service.criar({ name: 'Maria', email: 'repetido@teste.com' })
    ).rejects.toThrow('Unique constraint failed');
  });
});