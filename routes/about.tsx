import { define } from "@/utils.ts";
import { Countdown } from "@/islands/Countdown.tsx";

export default define.page(() => {
  return (
    <main>
      <h1>About</h1>
      <p>
        This Application is a simple counter with an animated experience to make
        it more fun !
      </p>
      {/* TODO: Interactive animated counter to demonstrate above statement */}
      <Countdown />
      <p>Made with 💜 by Tablerase</p>
    </main>
  );
});
