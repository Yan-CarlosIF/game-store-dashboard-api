import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

import { $Enums } from "../../prisma/generated/prisma/client";

type Status = $Enums.Status;

interface getQuery {
  include: {
    cliente: true;
    produtos: {
      include: {
        produto: true;
      };
    };
  };
  where?: { status: { equals: Status } };
}

interface getQueryParams {
  delivered: string;
  canceled: string;
  shipping: string;
}

export async function getOrders(
  req: FastifyRequest<{ Querystring: getQueryParams }>,
  reply: FastifyReply
) {
  try {
    const query: getQuery = {
      include: {
        cliente: true,
        produtos: {
          include: {
            produto: true,
          },
        },
      },
    };

    const { delivered, canceled, shipping } = req.query;

    let statusFilter: Status | undefined = undefined;

    if (delivered === "true" && canceled !== "true" && shipping !== "true") {
      statusFilter = "DELIVERED";
    } else if (
      canceled === "true" &&
      delivered !== "true" &&
      shipping !== "true"
    ) {
      statusFilter = "CANCELED";
    } else if (
      shipping === "true" &&
      delivered !== "true" &&
      canceled !== "true"
    ) {
      statusFilter = "SHIPPING";
    }

    if (statusFilter) query.where = { status: { equals: statusFilter } };

    const orders = await prisma.pedido.findMany(query);

    return reply.status(200).send(orders);
  } catch (err) {
    return reply.status(404).send({ err });
  }
}
