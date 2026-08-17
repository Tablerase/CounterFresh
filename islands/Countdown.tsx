import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export function Countdown() {
  const count = useSignal(7);
  useEffect(() => {
    const timer = setInterval(() => {
      if (count.value <= 0) {
        clearInterval(timer);
      }

      count.value -= 1;
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (count.value <= 0) {
    return (
      <p class="m-5 text-center text-lg drop-shadow-2xl drop-shadow-purple-400 ">
        Made with 💜 by Tablerase
      </p>
    );
  }

  return (
    <p class="m-5 text-center text-lg drop-shadow-2xl drop-shadow-purple-400 ">
      Countdown: {count}
    </p>
  );
}
