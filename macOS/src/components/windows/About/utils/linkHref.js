// src/components/windows/About/utils/linkHref.js
export function linkHref(label = "", value = "") {
  const lowerLabel = String(label).toLowerCase();
  const lowerValue = String(value).toLowerCase();

  // email
  if (lowerLabel === "email" || value.includes("@")) {
    return { href: `mailto:${value}`, isEmail: true };
  }

  // pdf / local file
  if (lowerValue.endsWith(".pdf")) {
    const href = value.startsWith("/") ? value : `/${value}`;
    return { href, isEmail: false };
  }

  // normal links (add https if missing)
  if (!value.startsWith("http")) {
    return { href: `https://${value}`, isEmail: false };
  }

  return { href: value, isEmail: false };
}