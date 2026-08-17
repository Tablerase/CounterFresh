import { define } from "@/utils.ts";
import { Countdown } from "@/islands/Countdown.tsx";
import { Head } from "fresh/runtime";

export default define.page(() => {
  return (
    <main>
      <div class="relative min-h-screen px-4 py-8 mx-auto text-white">
        <Head>
          <title>About</title>
        </Head>
        <h1 class="text-6xl text-center drop-shadow-2xl drop-shadow-purple-400 
          font-bold font-title m-5 justify-self-center max-inline-screen
          ">
          About
        </h1>
        <div class="flex-row gap-5 justify-center items-center">
          <p class="text-center text-lg drop-shadow-2xl drop-shadow-purple-400 ">
            This Application is a simple counter with an animated experience to
            make it more fun !
          </p>
          {/* TODO: Interactive animated counter to demonstrate above statement */}
          <Countdown />
        </div>
      </div>
    </main>
  );
});
