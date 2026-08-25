import { assertEquals } from "@std/assert";
import { app } from "@/main.ts";

import { handler as nameApiHandler } from "@/routes/api/[name].tsx";

const appHandler = app.handler();

Deno.test("API - POST /api/close returns success json", async () => {
  const req = new Request("http://localhost:5173/api/close", {
    method: "POST",
  });
  const res = await appHandler(req);

  assertEquals(res.status, 200);
  assertEquals(
    res.headers.get("content-type")?.includes("application/json"),
    true,
  );

  const data = await res.json();
  assertEquals(data, { success: true });
});

Deno.test("API - GET /api2/:name formats capitalized greeting", async () => {
  const req = new Request("http://localhost:5173/api2/alice");
  const res = await appHandler(req);

  assertEquals(res.status, 200);
  const text = await res.text();
  assertEquals(text, "Hello, Alice!");
});

Deno.test("API Handler - routes/api/[name].tsx handles GET with name parameter", async () => {
  // @ts-expect-error - mock context for unit testing route handler
  const res = await nameApiHandler.GET({
    params: { name: "developer" },
    req: new Request("http://localhost:5173/api/developer"),
  });

  assertEquals(res.status, 200);
  const text = await res.text();
  assertEquals(text, "Hello, Developer!");
});
