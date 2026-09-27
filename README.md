# API Node.js + Prisma + PostgreSQL com Docker

Projeto desenvolvido para praticar Docker, Docker Compose, volumes, redes e
integração de uma API Node.js (Express + Prisma) com um banco de dados
PostgreSQL, tudo rodando em contêineres.

## Tecnologias utilizadas

- Node.js
- Express
- Prisma (ORM)
- PostgreSQL
- Docker e Docker Compose

## Estrutura do projeto

```
docker-node-prisma/
├── prisma/
│   ├── schema.prisma          # modelo de dados (User)
│   └── migrations/            # migrations do banco
├── src/
│   ├── index.js                # rotas da API (CRUD de usuários)
│   └── prismaClient.js         # instância do Prisma Client
├── Dockerfile                  # imagem da API
├── docker-compose.yml          # orquestração da API + banco
└── package.json
```

## Como rodar o projeto

### Pré-requisitos
- Docker Desktop instalado e aberto

### Subir os contêineres

```bash
docker compose up -d --build
```

Isso vai subir dois contêineres:
- **api**: a aplicação Node.js, na porta `3000`
- **db**: o banco PostgreSQL, com os dados salvos em um volume (não se perdem
  se o contêiner for reiniciado)

Ao subir, a API já aplica automaticamente a migration que cria a tabela `User`.

### Ver se subiu certo

```bash
docker compose ps
docker compose logs -f api
```

## Testando a API

**Rota inicial** (verifica se a API está no ar):
```bash
curl http://localhost:3000/
```

**Criar usuário:**
```bash
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"name\":\"Maria\",\"email\":\"maria@teste.com\"}"
```

**Listar usuários:**
```bash
curl http://localhost:3000/users
```

**Buscar usuário por id:**
```bash
curl http://localhost:3000/users/1
```

**Atualizar usuário:**
```bash
curl -X PUT http://localhost:3000/users/1 -H "Content-Type: application/json" -d "{\"name\":\"Maria Silva\",\"email\":\"maria@teste.com\"}"
```

**Excluir usuário:**
```bash
curl -X DELETE http://localhost:3000/users/1
```

## Parar os contêineres

```bash
docker compose down
```

Para apagar também os dados do banco (o volume):
```bash
docker compose down -v
```

## Dificuldades encontradas durante o desenvolvimento

- O Docker Desktop precisa estar aberto e totalmente iniciado antes de rodar
  `docker compose up`, senão dá erro de conexão com a API do Docker.
- A porta `5432` do PostgreSQL já estava em uso na minha máquina, então
  precisei mapear para uma porta diferente no host (`5433:5432`) no
  `docker-compose.yml`.
- A imagem `node:20-alpine` não vem com OpenSSL instalado por padrão, o que
  fazia o Prisma falhar dentro do contêiner. Resolvido adicionando
  `RUN apk add --no-cache openssl` no `Dockerfile`.
- Entender que, dentro da rede do Docker Compose, a API se conecta ao banco
  pelo nome do serviço (`db`), e não por `localhost`.
