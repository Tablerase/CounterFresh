import { assertEquals } from "@std/assert";
import { renderToString } from "preact-render-to-string";
import Home from "@/routes/index.tsx";
import About from "@/routes/about.tsx";
import App from "@/routes/_app.tsx";

Deno.test("Pages - Home page renders title and participant structure", () => {
  // @ts-expect-error - mock context for page component
  const vnode = Home({ state: { shared: "test-shared-state" } });
  const html = renderToString(vnode);

  assertEquals(html.includes("Counter Fresh"), true);
  assertEquals(html.includes("participantList"), true);
  assertEquals(html.includes("addParticipant"), true);
});

Deno.test("Pages - About page renders description and countdown", () => {
  // @ts-expect-error - mock context for page component
  const vnode = About({});
  const html = renderToString(vnode);

  assertEquals(html.includes("About"), true);
  assertEquals(
    html.includes(
      "This Application is a simple counter with an animated experience",
    ),
    true,
  );
  assertEquals(html.includes("Countdown:"), true);
});

Deno.test("Pages - App layout wraps components with head tags and background", () => {
  const MockChild = () => <div id="child-content">Child Content</div>;
  // @ts-expect-error - mock context for app layout
  const vnode = App({ Component: MockChild });
  const html = renderToString(vnode);

  assertEquals(html.includes("<title>CounterFresh</title>"), true);
  assertEquals(html.includes('href="/counter-logo.svg"'), true);
  assertEquals(html.includes('href="/favicon.ico"'), true);
  assertEquals(html.includes('id="child-content"'), true);
});
