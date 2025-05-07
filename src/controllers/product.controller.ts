import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getProducts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const products = await prisma.produto.findMany({
      include: {
        jogo: true,
        eletronico: true,
      },
    });

    return reply.status(200).send(products);
  } catch (err) {
    return reply.status(404).send({ err });
  }
}

type getQueryParams = {
  limit?: string;
  dateFrom?: string;
  dateTo?: string;
};

export async function getMostSelledProducts(
  req: FastifyRequest<{ Querystring: getQueryParams }>,
  reply: FastifyReply
) {
  const { limit, dateFrom, dateTo } = req.query;

  const dateFilter: { data?: { gte?: Date; lte?: Date } } = {};

  if (dateFrom) {
    dateFilter.data = {
      ...dateFilter.data,
      gte: new Date(dateFrom),
    };
  }

  if (dateTo) {
    dateFilter.data = {
      ...dateFilter.data,
      lte: new Date(dateTo),
    };
  }

  try {
    // Agrupar por produtos com base nos pedidos filtrados por data
    const mostSelled = await prisma.produtoPedido.groupBy({
      by: ["idProduto"],
      _count: {
        idProduto: true,
      },
      where: {
        pedido: dateFilter, // Aqui filtra pela data do pedido relacionado
      },
      orderBy: {
        _count: {
          idProduto: "desc",
        },
      },
      take: limit ? parseInt(limit) : undefined,
    });

    const products = await prisma.produto.findMany({
      where: {
        id: {
          in: mostSelled.map((p) => p.idProduto),
        },
      },
      include: {
        pedidos: {
          include: {
            pedido: true, // inclui os dados do pedido para ver data, status, etc.
          },
        },
      },
    });

    return reply.status(200).send(products);
  } catch (err) {
    return reply
      .status(500)
      .send({ error: "Erro ao buscar produtos mais vendidos.", details: err });
  }
}
