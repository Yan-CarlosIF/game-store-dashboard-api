import { getClients } from "@/controllers/client.controller";
import { FastifyInstance } from "fastify";

export function clientRoutes(app: FastifyInstance) {
  app.get("/get", getClients);
}
