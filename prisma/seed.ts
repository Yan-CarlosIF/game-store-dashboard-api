import { PrismaClient, Status } from "./generated/prisma/client";
import { clientes } from "./constants/clientes";
import { jogos } from "./constants/jogos";
import { eletronicos } from "./constants/eletronicos";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Deletar dados existentes
  await prisma.produtoPedido.deleteMany();
  await prisma.genero.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.itemEletronico.deleteMany();
  await prisma.jogo.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.cliente.deleteMany();

  // Inserir clientes
  for (const cliente of clientes) {
    await prisma.cliente.create({ data: cliente });
  }

  // Inserir jogos
  for (const jogo of jogos) {
    const produto = await prisma.produto.create({
      data: {
        nome: jogo.nome,
        preco: jogo.preco,
        descricao: jogo.descricao,
        estoque: jogo.estoque,
      },
    });

    await prisma.jogo.create({
      data: {
        idProduto: produto.id,
        desenvolvedora: jogo.desenvolvedora,
        dataLancamento: jogo.dataLancamento,
        plataforma: jogo.plataforma,
      },
    });
  }

  // Inserir eletrônicos
  for (const eletronico of eletronicos) {
    const produto = await prisma.produto.create({
      data: {
        nome: eletronico.nome,
        preco: eletronico.preco,
        descricao: eletronico.descricao,
        estoque: eletronico.estoque,
      },
    });

    await prisma.itemEletronico.create({
      data: {
        idProduto: produto.id,
        fabricante: eletronico.fabricante,
        tipo: eletronico.tipo,
      },
    });
  }

  // Inserir pedidos
  for (let i = 0; i < 40; i++) {
    const cliente = clientes[i % clientes.length];

    // Selecionar ao menos 1 produto por pedido
    let produtos = await prisma.produto.findMany({
      take: 2, // tentar pegar até 2 produtos
      skip: i * 2,
    });

    // Se não houver produtos, pegar ao menos 1 produto
    if (produtos.length === 0) {
      const totalProdutos = await prisma.produto.count();
      const randomIndex = faker.number.int({ min: 0, max: totalProdutos - 1 });

      const produtoAleatorio = await prisma.produto.findMany({
        take: 1,
        skip: randomIndex,
      });

      produtos = produtoAleatorio;
    }

    const pedido = await prisma.pedido.create({
      data: {
        valorTotal: produtos.reduce((sum, p) => sum + p.preco, 0),
        status: faker.helpers.arrayElement(Object.values(Status)),
        data: faker.date.between({
          from: new Date("2024-01-01"),
          to: new Date(),
        }),
        cpfCliente: cliente.cpf,
      },
    });

    // Inserir produtos no pedido
    for (const produto of produtos) {
      const quantidade = faker.number.int({ min: 1, max: 10 });

      await prisma.produtoPedido.create({
        data: {
          idPedido: pedido.id,
          idProduto: produto.id,
          quantidade,
          subTotal: produto.preco * quantidade,
        },
      });
    }
  }

  console.log("Seed executado com sucesso.");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
