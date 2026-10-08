// src/hooks/useIsMobile.js
// True on phone-sized screens; windows then open full screen like iOS apps.
import { useEffect, useState } from "react";

const QUERY = "(max-width: 767px)";

export default function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.matchMedia(QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const on = () => setMobile(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return mobile;
}

/** Touch-first device (no hover, coarse pointer) — used to show on-screen game controls. */
export function isTouchDevice() {
  return typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}
