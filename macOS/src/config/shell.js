// src/config/shell.js
// Shared desktop metrics so windows, menus and the Dock agree on layout.

export const MENU_BAR_H = 28;
export const DOCK_RESERVE = 92; // space a zoomed window leaves for the Dock
export const WINDOW_MARGIN = 8;

// macOS-like easing curves
export const EASE_OUT = [0.22, 1, 0.36, 1];
export const SPRING_WINDOW = { type: "spring", stiffness: 420, damping: 36, mass: 0.9 };
