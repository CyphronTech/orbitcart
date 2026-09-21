// Light / dark theme.
//
// Default: follow the visitor's system setting (pure CSS, works without JavaScript).
// The toggle in the header lets them override it. The override is remembered in
// localStorage under "cyphron_theme" and is only stored when it differs from the system
// setting, so switching back to the system theme returns to "follow my system".
//
// assets/theme-init.js applies a saved choice before first paint.

const STORAGE_KEY = "cyphron_theme";
const CHANGE_EVENT = "cyphron:theme";
const PAGE_COLORS = { dark: "#090d15", light: "#f1f3f6" };

export function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function currentTheme() {
  const explicit = document.documentElement.getAttribute("data-theme");
  return explicit === "light" || explicit === "dark" ? explicit : systemTheme();
}

function syncBrowserColor() {
  const color = PAGE_COLORS[currentTheme()];
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute("content", color));
}

export function setTheme(theme) {
  const root = document.documentElement;

  try {
    if (theme === systemTheme()) {
      root.removeAttribute("data-theme");
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      root.setAttribute("data-theme", theme);
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  } catch {
    // Storage blocked: the choice still applies to this page view.
    root.setAttribute("data-theme", theme);
  }

  syncBrowserColor();
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function toggleTheme() {
  setTheme(currentTheme() === "dark" ? "light" : "dark");
}

/** Calls `listener` when the toggle is used or the system setting changes. Returns an unsubscribe function. */
export function subscribeTheme(listener) {
  const query = window.matchMedia("(prefers-color-scheme: light)");
  const onSystemChange = () => {
    syncBrowserColor();
    listener();
  };

  window.addEventListener(CHANGE_EVENT, listener);
  query.addEventListener("change", onSystemChange);

  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    query.removeEventListener("change", onSystemChange);
  };
}
