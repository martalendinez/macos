---
name: pr-description
description: Writes pull request descriptions in Marta's format (Why, What changed, Before/after, How I tested). Use when asked to write, draft or improve a PR description, or when opening a pull request.
---

# Pull request description

A reviewer should understand the change in 30 seconds without opening the diff.

## Format

```markdown
## Why
One or two sentences: the user or business problem, with the number that proves it
(e.g. "2.5:1 contrast, under the 4.5:1 WCAG AA minimum").

## What changed
- One bullet per meaningful change, starting with a verb
- Mention tokens or shared components touched, since they affect other screens

## Before / after
Screenshots or a short recording for anything visual. Label which is which.

## How I tested
- [ ] The automated checks that matter for this change
- [ ] Keyboard only
- [ ] Screen reader (name which one)
- [ ] Light and dark mode
```

## Rules

- Plain words. No "leverage", "utilize", "robust", "seamless".
- Only claim tests that were actually run. Leave an unchecked box rather than invent a result.
- Read the diff before writing. If the code does something the description doesn't mention, say so.
- Keep the title under 60 characters, written as what the PR does: "Fix: Invest button fails WCAG AA contrast".
