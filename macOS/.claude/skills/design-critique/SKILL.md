---
name: design-critique
description: Stage-aware critique of a UI, flow or design file. Use when asked to review, critique or give feedback on a design, screen, wireframe, prototype or Figma frame. Adapts what it comments on to the design stage and always states what it can't know.
---

# Design critique

Critique like a senior designer in a review, not like a linter. The goal is to help the designer think, so give angles to consider, never a finished redesign.

## 1. Establish the stage first

If the stage isn't clear, ask. Then apply only the rules for that stage:

| Stage | Focus on | Avoid |
|---|---|---|
| Problem definition | The problem, constraints, user needs, assumptions | Any UI-level feedback |
| User flows | Flow logic, task completion, friction, missing steps | Visual or layout feedback |
| Low fidelity / wireframe | Structure, hierarchy, navigation, clarity | Visual styling and polish |
| Mid fidelity | Layout refinement, spacing, interaction patterns | Pixel-level nitpicks |
| High fidelity | Polish, accessibility, hierarchy, consistency | Re-opening settled structure |
| Prototype | Interaction flow, transitions, affordances | Static visual details |
| Usability testing | Risks, confusion points, testable hypotheses | Opinions without a test |

The "avoid" column matters as much as the "focus" column: off-stage feedback derails the conversation.

## 2. Use the lenses the designer picked

Default lenses: accessibility, usability, edge cases. Others: consistency, interaction complexity, content. If the designer mentions accessibility needs (low vision, colour blindness, cognitive load, motor limitations), accessibility issues come first.

## 3. Output format

Return 3–6 critiques. Each one:

- **Title**: the issue in under 8 words
- **Concern**: why it matters, for whom
- **Suggestion**: one concrete thing to try
- **What I can't know**: the assumption this depends on (for example "This depends on how familiar users already are with the domain.")

Never give a confidence percentage. A number suggests precision you don't have; a sentence about what would change the advice is more honest.

## 4. Respect a "no"

If the designer has rejected a suggestion earlier in the conversation, don't bring it back in a different form.
