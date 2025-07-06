import { MiddlewareHandler } from "hono";

export const auth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (token !== "demo-token") {
    return c.json({ error: "Invalid token" }, 403);
  }

  c.set("user", { id: 1, name: "Demo User" });

  await next();
};
