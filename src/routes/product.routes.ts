import {
  getMostSelledProducts,
  getProducts,
} from "@/controllers/product.controller";
import { FastifyInstance } from "fastify";

export async function productRoutes(app: FastifyInstance) {
  app.get("/get", getProducts);
  app.get("/get-most-selled", getMostSelledProducts);
}
