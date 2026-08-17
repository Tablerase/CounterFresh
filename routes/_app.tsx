import { define } from "../utils.ts";
import CloseButton from "@/islands/CloseButton.tsx";

export default define.page(function App({ Component }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* 1. SVG Favicon (Modern crisp vector icon) */}
        <link rel="icon" href="/counter-logo.svg" type="image/svg+xml" />

        {/* 2. Fallback ICO Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* 3. High-DPI PNG Icon */}
        <link rel="icon" href="/counter-logo@2x.png" type="image/png" />

        {/* 4. Apple Touch Icon (For iOS Home Screen Bookmarks) */}
        <link rel="apple-touch-icon" href="/counter-logo@2x.png" />
        <title>CounterFresh</title>
      </head>
      <body>
        <CloseButton />
        <Component />
      </body>
    </html>
  );
});
