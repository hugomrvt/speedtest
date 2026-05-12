/**
 * Feature switch for selecting a LibreSpeed design
 *
 * This script checks for:
 * 1. URL parameter: ?design=neo | new | old | classic
 * 2. Configuration file: config.json with `design` (preferred) or
 *    `useNewDesign` (legacy) flag
 *
 * Default behavior: Shows the classic design
 *
 * Note: This script is only loaded on the root index.html
 */
(function () {
  "use strict";

  // Don't run this script if we're already on a specific design page
  // This prevents infinite redirect loops
  const currentPath = window.location.pathname;
  if (
    currentPath.includes("index-classic.html") ||
    currentPath.includes("index-modern.html") ||
    currentPath.includes("index-neo.html")
  ) {
    return;
  }

  // Check URL parameters first (they override config)
  const urlParams = new URLSearchParams(window.location.search);
  const designParam = (urlParams.get("design") || "").toLowerCase();

  if (designParam === "neo") {
    redirectTo("index-neo.html");
    return;
  }

  if (designParam === "new" || designParam === "modern") {
    redirectTo("index-modern.html");
    return;
  }

  if (designParam === "old" || designParam === "classic") {
    redirectTo("index-classic.html");
    return;
  }

  // Check config.json for design preference
  try {
    const xhr = new XMLHttpRequest();
    // Use a synchronous request to prevent a flash of the wrong design
    xhr.open("GET", "config.json", false);
    xhr.send(null);

    if (xhr.status >= 200 && xhr.status < 300) {
      const config = JSON.parse(xhr.responseText);
      const target = resolveTarget(config);
      redirectTo(target);
    } else {
      // Config not found or error - default to classic design
      redirectTo("index-classic.html");
    }
  } catch (error) {
    // If there's any error (e.g., network, JSON parse), default to classic design
    console.log("Using default (classic) design:", error.message || "config error");
    redirectTo("index-classic.html");
  }

  function resolveTarget(config) {
    // New explicit "design" field takes precedence
    if (config && typeof config.design === "string") {
      const d = config.design.toLowerCase();
      if (d === "neo") return "index-neo.html";
      if (d === "new" || d === "modern") return "index-modern.html";
      return "index-classic.html";
    }

    // Legacy useNewDesign boolean fallback
    if (config && config.useNewDesign === true) {
      return "index-modern.html";
    }

    return "index-classic.html";
  }

  function redirectTo(target) {
    // Preserve any URL parameters when redirecting
    const currentParams = window.location.search;
    window.location.href = target + currentParams;
  }
})();
