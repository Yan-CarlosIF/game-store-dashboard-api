import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { productRoutes } from "./routes/product.routes";
import { clientRoutes } from "./routes/client.routes";
import { orderRoutes } from "./routes/order.routes";

const app = fastify();

app.register(fastifyCors, {
  origin: ["http://localhost:3000", "https://games-store-dashboard.vercel.app"],
  methods: ["GET", "PATCH", "DElETE", "POST"],
  credentials: true,
});

app.get("/", () => {
  return { API: "Dashboard API" };
});

app.register(productRoutes, { prefix: "/product" });
app.register(clientRoutes, { prefix: "/client" });
app.register(orderRoutes, { prefix: "/order" });

app.listen({ host: "0.0.0.0", port: 3001 }).then(() => {
  console.log("Server running at: http://localhost:3001");
});
