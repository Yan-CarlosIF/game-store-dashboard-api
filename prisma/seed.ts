import { PrismaClient, Status } from "../prisma/generated/prisma";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Limpando dados existentes...");
  await prisma.produtoPedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.genero.deleteMany();
  await prisma.jogo.deleteMany();
  await prisma.itemEletronico.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.cliente.deleteMany();

  console.log("Criando clientes...");
  const clientes = await Promise.all(
    Array.from({ length: 10 }).map(() => {
      return prisma.cliente.create({
        data: {
          cpf: faker.string.numeric(11),
          nome: faker.person.fullName(),
          email: faker.internet.email(),
          telefone: faker.phone.number({ style: "national" }),
          rua: faker.location.street(),
          cidade: faker.location.city(),
          numeroCasa: faker.number.int({ min: 1, max: 1000 }),
        },
      });
    })
  );

  const generosDisponiveis = [
    "Ação",
    "Aventura",
    "RPG",
    "Estratégia",
    "Simulação",
    "Esporte",
    "Corrida",
    "Puzzle",
    "Terror",
    "Survival",
    "Plataforma",
    "Sandbox",
    "FPS",
    "TPS",
    "MMORPG",
    "MOBA",
    "Battle Royale",
    "Hack and Slash",
    "Roguelike",
    "Metroidvania",
    "Stealth",
    "Musical",
    "Casual",
    "Visual Novel",
    "Card Game",
    "Educacional",
  ];

  console.log("Criando jogos...");
  const jogos = await Promise.all(
    Array.from({ length: 20 }).map(() => {
      const preco = faker.number.float({
        min: 49.99,
        max: 299.99,
      });

      // Selecionar entre 1 e 4 gêneros únicos aleatórios
      const generosSelecionados = faker.helpers.arrayElements(
        generosDisponiveis,
        faker.number.int({ min: 1, max: 4 })
      );

      return prisma.produto.create({
        data: {
          nome: faker.commerce.productName(),
          preco,
          descricao: faker.commerce.productDescription(),
          estoque: faker.number.int({ min: 10, max: 100 }),
          jogo: {
            create: {
              desenvolvedora: faker.company.name(),
              dataLancamento: faker.date.past({ years: 5 }),
              plataforma: faker.helpers.arrayElement([
                "PC",
                "PS5",
                "Xbox",
                "Switch",
              ]),
            },
          },
          generos: {
            create: generosSelecionados.map((nome) => ({ nome })),
          },
        },
      });
    })
  );

  console.log("Criando eletrônicos...");
  const eletronicos = await Promise.all(
    Array.from({ length: 20 }).map(() => {
      const preco = faker.number.float({
        min: 49.99,
        max: 4999.99,
      });
      return prisma.produto.create({
        data: {
          nome: faker.commerce.productName(),
          preco,
          descricao: faker.commerce.productDescription(),
          estoque: faker.number.int({ min: 5, max: 50 }),
          eletronico: {
            create: {
              fabricante: faker.company.name(),
              tipo: faker.helpers.arrayElement([
                "Fone",
                "Mouse",
                "Teclado",
                "Monitor",
                "Notebook",
              ]),
            },
          },
        },
      });
    })
  );

  const todosProdutos = [...jogos, ...eletronicos];

  console.log("Criando pedidos...");
  for (let i = 0; i < 40; i++) {
    const cliente = faker.helpers.arrayElement(clientes);
    const quantidadeProdutos = faker.number.int({ min: 1, max: 3 });
    const produtosSelecionados = faker.helpers.arrayElements(
      todosProdutos,
      quantidadeProdutos
    );

    const produtosParaPedido = produtosSelecionados.map((produto) => {
      const quantidade = faker.number.int({ min: 1, max: 3 });
      const subTotal = Number((quantidade * produto.preco).toFixed(2));
      return {
        quantidade,
        subTotal,
        produto: { connect: { id: produto.id } },
      };
    });

    const valorTotal = produtosParaPedido.reduce(
      (acc, p) => acc + p.subTotal,
      0
    );

    await prisma.pedido.create({
      data: {
        data: faker.date.between({
          from: faker.date.past({ years: 1 }),
          to: new Date(),
        }),
        status: faker.helpers.arrayElement([
          Status.CANCELED,
          Status.SHIPPING,
          Status.DELIVERED,
        ]),
        valorTotal,
        cpfCliente: cliente.cpf,
        produtos: {
          create: produtosParaPedido,
        },
      },
    });
  }

  console.log("Seed finalizado com sucesso ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
