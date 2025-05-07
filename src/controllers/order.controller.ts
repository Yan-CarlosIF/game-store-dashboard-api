import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

interface getQuery {
  include: {
    cliente: true;
    produtos: true;
  };
  where?: { status: { equals: "DELIVERED" | "CANCELED" } };
}

interface getQueryParams {
  delivered: string;
  canceled: string;
}

export async function getOrders(
  req: FastifyRequest<{ Querystring: getQueryParams }>,
  reply: FastifyReply
) {
  try {
    const query: getQuery = {
      include: {
        cliente: true,
        produtos: true,
      },
    };

    const { delivered, canceled } = req.query;

    let statusFilter: "DELIVERED" | "CANCELED" | undefined = undefined;

    if (delivered === "true" && canceled !== "true") {
      statusFilter = "DELIVERED";
    } else if (canceled === "true" && delivered !== "true") {
      statusFilter = "CANCELED";
    }

    if (statusFilter) query.where = { status: { equals: statusFilter } };

    const orders = await prisma.pedido.findMany(query);

    return reply.status(200).send(orders);
  } catch (err) {
    return reply.status(404).send({ err });
  }
}
