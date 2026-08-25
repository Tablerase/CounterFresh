import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import DeleteIcon from "@/components/DeleteIcon/DeleteIcon.tsx";

export interface CloseButtonProps {
  class?: string;
  position?: "fixed" | "inline";
  size?: number;
}

export default function CloseButton({
  class: className = "",
  position = "fixed",
  size = 32,
}: CloseButtonProps) {
  const isClosing = useSignal(false);
  const isDesktop = useSignal(false);

  useEffect(() => {
    // Detect Deno desktop environment by checking for injected native bindings
    if (
      typeof bindings !== "undefined" &&
      typeof bindings.closeWindow === "function"
    ) {
      isDesktop.value = true;
    }

    // Ensure dev server terminates if window is closed via OS window frame
    const handleUnload = () => {
      try {
        navigator.sendBeacon("/api/close");
      } catch {
        fetch("/api/close", { method: "POST" }).catch(() => {});
      }
    };
    globalThis.addEventListener("pagehide", handleUnload);
    globalThis.addEventListener("beforeunload", handleUnload);
    return () => {
      globalThis.removeEventListener("pagehide", handleUnload);
      globalThis.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  async function handleClose() {
    if (isClosing.value) return;
    isClosing.value = true;

    // 1. Notify server immediately to terminate dev server process
    try {
      fetch("/api/close", { method: "POST" }).catch(() => {});
    } catch {
      // ignore
    }

    // 2. Try Deno desktop native webview bindings
    try {
      if (
        typeof bindings !== "undefined" &&
        typeof bindings.exitApp === "function"
      ) {
        await bindings.exitApp();
        return;
      }
      if (
        typeof bindings !== "undefined" &&
        typeof bindings.closeWindow === "function"
      ) {
        await bindings.closeWindow();
        return;
      }
    } catch (e) {
      console.warn("Failed to close via Deno desktop bindings:", e);
    }

    // 3. Fallback to browser window.close()
    try {
      globalThis.close();
    } catch {
      // Ignored if blocked by browser sandbox
    }

    // Reset indicator if window didn't close (e.g. in normal browser tab)
    setTimeout(() => {
      isClosing.value = false;
    }, 1500);
  }

  // Support Escape key to close the window
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hide the close button completely when running in standard browser
  if (!isDesktop.value) {
    return null;
  }

  const positionClass = position === "fixed"
    ? "fixed top-4 right-4 z-50"
    : "relative";

  return (
    <div class={`${positionClass} ${className}`}>
      <button
        id="close-app-window-button"
        type="button"
        onClick={handleClose}
        disabled={isClosing.value}
        aria-label="Close Application Window"
        title="Close Window (Esc)"
        class={`p-1 cursor-pointer transition-transform duration-200 focus:outline-none select-none ${
          isClosing.value
            ? "opacity-50 cursor-wait"
            : "hover:scale-125 active:scale-95"
        }`}
      >
        <DeleteIcon width={size} height={size} />
      </button>
    </div>
  );
}
