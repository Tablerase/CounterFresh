import { assertEquals } from "@std/assert";
import { signal } from "@preact/signals";
import { renderToString } from "preact-render-to-string";
import Counter from "./Counter.tsx";

Deno.test("Counter - Renders initial count and increment/decrement buttons", () => {
  const count = signal(42);
  const vnode = <Counter count={count} />;
  const html = renderToString(vnode);

  assertEquals(html.includes("42"), true);
  assertEquals(html.includes('id="decrement"'), true);
  assertEquals(html.includes('id="increment"'), true);
});

Deno.test("Counter - Signal values update when mutated", () => {
  const count = signal(0);
  assertEquals(count.value, 0);

  count.value += 1;
  assertEquals(count.value, 1);

  count.value -= 5;
  assertEquals(count.value, -4);
});
