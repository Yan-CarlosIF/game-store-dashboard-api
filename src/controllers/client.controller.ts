import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getClients(req: FastifyRequest, reply: FastifyReply) {
  try {
    const client = await prisma.cliente.findMany();

    return reply.status(200).send({ client });
  } catch (err) {
    return reply.status(404).send({ err });
  }
}
