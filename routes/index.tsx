import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import GlyphsBackground from "@/islands/GlyphsBackground.tsx";
import ParticipantList from "@/islands/ParticipantList.tsx";

export default define.page(
  function Home(ctx) {
    console.log("Shared value " + ctx.state.shared);

    return (
      <div class="relative min-h-screen px-4 py-8 mx-auto text-white">
        <Head>
          <title>Counter Fresh</title>
        </Head>
        <GlyphsBackground />
        <h1 class="text-6xl text-center drop-shadow-2xl drop-shadow-purple-400 font-bold font-title m-5 justify-self-center max-inline-screen">
          Counter Fresh
        </h1>
        <ParticipantList />
      </div>
    );
  },
);
