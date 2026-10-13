---
name: accessibility-review
description: Reviews UI code or designs against WCAG 2.2 AA, with real contrast maths. Use when asked about accessibility, a11y, contrast, colour-blindness, keyboard navigation, focus states or screen readers.
---

# Accessibility review

Check what can be checked, compute what can be computed, and say clearly what needs a human or a real device.

## Checklist

1. **Contrast.** Run `scripts/contrast.mjs` for every text/background pair. Never estimate by eye.
   - Normal text ≥ 4.5:1, large text (≥ 24px, or ≥ 18.66px bold) ≥ 3:1, UI components and focus rings ≥ 3:1.
   - Check hover, pressed and disabled states too; they are where regressions hide.
2. **Not colour alone.** Status, errors and money in/out need an icon, a sign or a label as well.
3. **Keyboard.** Every action reachable with Tab; visible `:focus-visible`; logical order; no traps; Esc closes overlays.
4. **Names and roles.** Icon buttons have an `aria-label`; custom controls use the right role (`switch`, `tab`, `dialog`); images have meaningful `alt`, or `alt=""` if decorative.
5. **Motion.** Respect `prefers-reduced-motion` for anything larger than a fade.
6. **Targets.** At least 24×24px (WCAG 2.2), aiming for 44×44 on touch.

## Output

Group findings as **Fails AA**, **Risky** and **Passes**, each with the element, the measured value and the fix. For colour fixes, suggest the nearest token that passes, not an arbitrary hex.

## Usage

```bash
node scripts/contrast.mjs "#ffffff" "#5aa9ff"
# 2.46:1  ✗ AA normal text  ✗ AA large text / UI  ✗ AAA
node scripts/contrast.mjs "#ffffff" "#0b63ce"
# 5.69:1  ✓ AA normal text  ✓ AA large text / UI  ✗ AAA
```
