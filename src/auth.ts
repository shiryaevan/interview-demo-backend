import { MiddlewareHandler } from "hono";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

export const auth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json(
      { status: 401, message: "Unauthorized", data: null },
      401,
      headers,
    );
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (token !== "demo-token") {
    return c.json(
      { status: 403, message: "Invalid token", data: null },
      403,
      headers,
    );
  }

  c.set("user", { id: 1, name: "Demo User" as const });

  await next();
};
