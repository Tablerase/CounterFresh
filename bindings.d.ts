export interface DesktopBindings {
  closeWindow(): Promise<void>;
  exitApp(): Promise<void>;
}

declare global {
  // Make `bindings` typed in the webview proxy.
  const bindings: DesktopBindings;
}
