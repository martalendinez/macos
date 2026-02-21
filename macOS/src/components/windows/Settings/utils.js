// src/components/windows/Settings/utils.js

export const downloadResume = () => {
  const a = document.createElement("a");
  a.href = "/resume.pdf";
  a.download = "Marta_Lendinez_Resume.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

function getShareUrl() {
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
  return canonical || window.location.origin;
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }

  // Fallback for older browsers / blocked permissions
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Tries Web Share API first (mobile-friendly).
 * If unavailable, copies link to clipboard.
 *
 * Returns: { status: "shared" | "copied" | "failed" | "cancelled", url }
 */
export async function sharePortfolio({
  title = "Marta’s portfolio",
  text = "Check out my portfolio ✨",
} = {}) {
  const url = getShareUrl();

  // Native share (best UX when available)
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return { status: "shared", url };
    }
  } catch {
    // user cancelled share sheet
    return { status: "cancelled", url };
  }

  const ok = await copyText(url);
  return { status: ok ? "copied" : "failed", url };
}