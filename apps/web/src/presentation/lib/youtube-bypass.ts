/** Playwright 等で動画 API を待たずにフローを通す */
export function shouldBypassYouTube(): boolean {
  return typeof window !== "undefined" && window.__E2E_BYPASS_YOUTUBE__ === true;
}
