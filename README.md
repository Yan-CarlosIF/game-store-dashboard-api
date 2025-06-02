# 🕹️ Game Store Dashboard API

API simples para gerenciamento de **clientes**, **produtos** (jogos e eletrônicos) e **pedidos**, desenvolvida com:

- [Fastify](https://fastify.dev/)
- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

---

## 🚀 Funcionalidades

- 🔍 Listagem de clientes, produtos e pedidos
- 📦 Relacionamento entre clientes e seus pedidos
- 📊 Dados realistas (fakes) para simular uma dashboard de e-commerce

---

## 📁 Estrutura do Projeto

```
📦 game-store-dashboard-api
 ┣ 📂 prisma
 ┃ ┣ schema.prisma         → Definição do banco de dados (clientes, produtos e pedidos)
 ┃ ┗ seed.ts               → Script para popular o banco com dados fake
 ┣ 📂 src
 ┃ ┣ 📂 controllers        → controllers de cada rota
 ┃ ┣ 📂 lib                → Instância do Prisma
 ┃ ┣ 📂 routes             → Rotas para clientes, produtos e pedidos
 ┃ ┗ app.ts           → Arquivo principal da aplicação
 ┣ .env                  → Variáveis de ambiente (ex: conexão com banco)
 ┣ package.json
 ┗ tsconfig.json
```

## Deploy: [Render](https://game-store-dashboard-api.onrender.com)

---

## 🛠️ Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/Yan-CarlosIF/game-store-dashboard-api.git
```

2. **Instale as dependências**

```bash
pnpm install
```

3. **Configure o banco de dados**

Crie um arquivo `.env` com o seguinte conteúdo (ajuste conforme necessário):

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/game-store"
```

4. **Crie e popule o banco**

```bash
pnpm prisma migrate dev --name init
pnpm run seed
```

5. **Inicie o servidor**

```bash
pnpm run dev
```

A API estará disponível em: `http://localhost:3001`

---

## 📫 Endpoints principais

| Método | Rota        | Descrição               |
| ------ | ----------- | ----------------------- |
| GET    | `/clients`  | Lista todos os clientes |
| GET    | `/products` | Lista todos os produtos |
| GET    | `/orders`   | Lista todos os pedidos  |

---

## 🧪 Tecnologias usadas

- Fastify
- TypeScript
- Prisma ORM
- PostgreSQL
- Faker (para gerar dados fake)

---

## 📌 Observações

- Esta API é apenas para fins de estudo e simulação de uma dashboard.
- Nenhuma autenticação foi implementada.

---

## 🧑‍💻 Autor

Feito com 💻 por [Yan Carlos](https://github.com/Yan-CarlosIF)
