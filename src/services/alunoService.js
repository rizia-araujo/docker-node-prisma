function criarAlunoService(prisma) {
  return {
    criar(dados) {
      return prisma.aluno.create({
        data: { name: dados.name, email: dados.email },
      });
    },

    listar() {
      return prisma.aluno.findMany();
    },

    buscarPorId(id) {
      return prisma.aluno.findUnique({ where: { id } });
    },

    atualizar(id, dados) {
      return prisma.aluno.update({
        where: { id },
        data: { name: dados.name, email: dados.email },
      });
    },

    remover(id) {
      return prisma.aluno.delete({ where: { id } });
    },
  };
}

module.exports = { criarAlunoService };