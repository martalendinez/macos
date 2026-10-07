// src/hooks/useLocalState.js
// useState that survives reloads in this browser (falls back to memory if storage is blocked).
import { useEffect, useState } from "react";

export default function useLocalState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : typeof initial === "function" ? initial() : initial;
    } catch {
      return typeof initial === "function" ? initial() : initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private mode / storage full */
    }
  }, [key, value]);

  return [value, setValue];
}
