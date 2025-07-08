import { Hono } from "hono";
import { faker } from "@faker-js/faker";
import { auth } from "./auth";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

const app = new Hono();

app.options("*", (c) => {
  return new Response(null, {
    status: 204,
    headers: headers,
  });
});

const plantTypes = [
  { id: "roses", displayName: "Roses", color: "#FF6384" },
  { id: "hydrangeas", displayName: "Hydrangeas", color: "#36A2EB" },
  { id: "tulips", displayName: "Tulips", color: "#FF9F40" },
  { id: "lilies", displayName: "Lilies", color: "#4BC0C0" },
  { id: "peonies", displayName: "Peonies", color: "#9966FF" },
];

function generateFakeStats() {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);

    const plants = plantTypes.map((plant) => ({
      id: plant.id,
      displayName: plant.displayName,
      harvested: faker.number.int({ min: 10, max: 200 }),
      height: faker.number.float({ min: 20, max: 150, fractionDigits: 1 }),
      growthRate: faker.number.float({ min: 0.5, max: 3, fractionDigits: 1 }),
      fertilizerUsed: faker.number.int({ min: 50, max: 300 }),
      waterUsed: faker.number.int({ min: 10, max: 100 }),
      soilMoisture: faker.number.int({ min: 30, max: 90 }),
      sunlightHours: faker.number.int({ min: 4, max: 12 }),
      pestTreatments: faker.number.int({ min: 0, max: 2 }),
      notes: faker.lorem.sentence(),
    }));

    return { date, plants };
  }).reverse();
}

app.get("/api/stats", auth, (c) => {
  const data = generateFakeStats();

  return c.json(
    {
      plantTypes: plantTypes.map(({ id, displayName, color }) => ({
        id,
        label: displayName,
        color,
      })),
      stats: data,
    },
    200,
    headers,
  );
});

app.post("/api/login", async (c) => {
  const body: { username: string; password: string } = await c.req.json();
  const { username, password } = body;

  if (username === "demo@demo.com" && password === "demo") {
    return c.json(
      { token: "demo-token", user: { id: 1, name: "Admin" } },
      200,
      headers,
    );
  }

  return new Response(
    JSON.stringify({ status: 401, message: "Invalid credentials", data: null }),
    {
      status: 401,
      headers: headers,
    },
  );
});

export default app;
