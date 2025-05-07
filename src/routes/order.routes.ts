import { getOrders } from "@/controllers/order.controller";
import { FastifyInstance } from "fastify";

export function orderRoutes(app: FastifyInstance) {
  app.get("/get", getOrders);
}
