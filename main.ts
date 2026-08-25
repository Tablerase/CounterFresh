import { App, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";

export const app = new App<State>();

app.use(staticFiles());

// Manage native desktop window when running inside Deno desktop
let mainWindow: Deno.BrowserWindow | null = null;
if (
  typeof (Deno as unknown as { BrowserWindow?: typeof Deno.BrowserWindow })
    .BrowserWindow !== "undefined"
) {
  mainWindow = new Deno.BrowserWindow({
    title: "Counter Fresh",
  });

  const terminateProcess = () => {
    try {
      mainWindow?.close();
    } catch {
      // ignore
    }
    setTimeout(() => {
      if (Deno.env.get("DENO_TESTING") === "1") return;
      try {
        Deno.exit(0);
      } catch (e) {
        console.warn("Could not call Deno.exit:", e);
      }
    }, 20);
  };

  mainWindow.bind("closeWindow", () => {
    terminateProcess();
    return Promise.resolve();
  });

  mainWindow.bind("exitApp", () => {
    terminateProcess();
    return Promise.resolve();
  });
}

// API endpoint to close window or exit app
app.post("/api/close", () => {
  setTimeout(() => {
    try {
      if (mainWindow) {
        mainWindow.close();
      }
    } catch {
      // ignore
    }
    if (Deno.env.get("DENO_TESTING") === "1") return;
    try {
      Deno.exit(0);
    } catch (e) {
      console.warn("Could not call Deno.exit:", e);
    }
  }, 20);
  return Response.json({ success: true });
});

// Pass a shared value from a middleware
app.use(async (ctx) => {
  ctx.state.shared = "hello";
  return await ctx.next();
});

// this is the same as the /api/:name route defined via a file. feel free to delete this!
app.get("/api2/:name", (ctx) => {
  const name = ctx.params.name;
  return new Response(
    `Hello, ${name.charAt(0).toUpperCase() + name.slice(1)}!`,
  );
});

// this can also be defined via a file. feel free to delete this!
const exampleLoggerMiddleware = define.middleware((ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  return ctx.next();
});
app.use(exampleLoggerMiddleware);

// Include file-system based routes here
app.fsRoutes();
