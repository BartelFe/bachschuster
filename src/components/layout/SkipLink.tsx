/**
 * Skip-to-main keyboard affordance. Hidden visually until it receives focus
 * (first Tab press on cold page load), then slides into view at the top-left
 * so a screen-reader / keyboard user can jump past the Header straight into
 * the page content.
 *
 * The target #main has tabIndex={-1} so `focus()` works without making it
 * a tab-stop in the normal flow.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-s4 top-s4 z-[400] -translate-y-[200%] rounded-sm border border-accent bg-ink px-s3 py-s2 font-mono text-data-label uppercase tracking-data text-accent transition-transform duration-hover ease-cinematic focus-visible:translate-y-0 focus-visible:outline-none"
      onClick={(e) => {
        // Move keyboard focus to #main after the in-page jump so subsequent
        // Tabs land on focusable elements inside the new main view rather
        // than continuing through the Header chrome.
        const main = document.getElementById('main');
        if (main) {
          // Defer to next tick so the URL hash + smooth scroll settle first.
          window.setTimeout(() => main.focus(), 50);
        }
        e.currentTarget.blur();
      }}
    >
      Zum Hauptinhalt springen
    </a>
  );
}
