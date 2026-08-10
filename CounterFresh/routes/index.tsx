import { useSignal } from "@preact/signals";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import Counter from "../islands/Counter.tsx";
import GlyphsBackground from "@/islands/GlyphsBackground.tsx";

export default define.page(function Home(ctx) {
  const count = useSignal(3);

  console.log("Shared value " + ctx.state.shared);

  return (
    <div class="relative min-h-screen px-4 py-8 mx-auto text-white">
      <Head>
        <title>Counter Fresh</title>
      </Head>
      <GlyphsBackground />
      <div class="relative z-10 max-w-screen-md mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        <h1 class="text-4xl font-bold">Counter Fresh</h1>
      </div>
      {/* Discord-style status bar overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {/* Frosted card */}
        <div
          style={{
            background: "rgba(30, 18, 60, 0.72)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(136, 112, 204, 0.35)",
            borderRadius: "16px",
            padding: "40px 56px",
            textAlign: "center",
            boxShadow: "0 8px 64px rgba(100, 66, 172, 0.4)",
            maxWidth: "420px",
          }}
        >
          <h1
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "22px",
              fontWeight: 700,
              color: "#e5dfff",
              letterSpacing: "0.04em",
              marginBottom: 8,
            }}
          >
            system online
          </h1>
          <Counter count={count} />
          <p
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "12px",
              color: "#8870cc",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            connecting to gateway...
          </p>
        </div>
      </div>
    </div>
  );
});
