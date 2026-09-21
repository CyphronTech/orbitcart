// Runs before the page paints, so a saved light or dark choice never flashes the other theme.
// With no saved choice the stylesheet follows the visitor's system setting on its own.
(function () {
  try {
    var saved = window.localStorage.getItem("cyphron_theme");
    if (saved === "light" || saved === "dark") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  } catch (error) {
    /* Storage blocked: fall back to the system setting. */
  }
})();
