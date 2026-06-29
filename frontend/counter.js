/* ============================================================
   counter.js — Visitor counter for Cloud Resume Challenge
   
   Replace API_ENDPOINT with your real API Gateway URL after
   you deploy the backend (Terraform / SAM / console).
   
   The Lambda should return JSON: { "count": 42 }
   ============================================================ */

const API_ENDPOINT = "https://y4x2c86dld.execute-api.us-east-1.amazonaws.com";

const countEl   = document.getElementById("count-value");
const statusEl  = document.getElementById("visitor-status");
const cardEl    = document.getElementById("visitor-card");

/**
 * Animate the counter from 0 up to the target number.
 * Fast at the start, slows as it approaches the target
 * for a satisfying mechanical-counter feel.
 */
function animateCount(target) {
  const duration  = 900; // ms
  const start     = performance.now();
  const startVal  = 0;

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(startVal + (target - startVal) * eased);

    countEl.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      countEl.textContent = target.toLocaleString();
      countEl.classList.add("count-animate");
    }
  }

  requestAnimationFrame(step);
}

/**
 * Fetch the visitor count from the API Gateway → Lambda → DynamoDB chain.
 * Shows a loading state, then either the count or a graceful error.
 */
async function fetchVisitorCount() {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const count = data.count ?? data.visitor_count ?? data.Count;

    if (typeof count !== "number") {
      throw new Error("Unexpected response shape");
    }

    animateCount(count);
    statusEl.textContent  = "and counting";
    cardEl.classList.add("loaded");

  } catch (err) {
    // Don't let a broken counter ruin the resume page.
    // Show a quiet fallback instead of an ugly error.
    countEl.textContent  = "–";
    statusEl.textContent = "counter unavailable";
    console.warn("[visitor-counter] Could not fetch count:", err.message);
  }
}

// Kick off the fetch once the DOM is ready
// (script is loaded at end of <body>, so DOM is ready here)
fetchVisitorCount();