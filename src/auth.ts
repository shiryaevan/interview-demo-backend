import { MiddlewareHandler } from "hono";

export const auth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ status: 401, message: "Unauthorized", data: null }, 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (token !== "demo-token") {
    return c.json({ status: 403, message: "Invalid token", data: null }, 403);
  }

  c.set("user", { id: 1, name: "Demo User" as const });

  await next();
};
