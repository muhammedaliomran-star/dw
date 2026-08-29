<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Impeccable Design System & Steering Rules (impeccable.style)

This codebase follows the **Impeccable** frontend design language and quality guidelines:

1. **Design Context & Truth**:
   - Reference `DESIGN.md` for project-specific visual rules, color harmony, typography tokens, and spacing ratios.
   - Maintain a crisp, tactile, high-density ERP/POS financial interface with impeccable Arabic ergonomics.

2. **Anti-Patterns & Quality Enforcements**:
   - **No AI-Slop**: Reject arbitrary cyan/purple gradients, generic SaaS buzzwords, or gratuitous glassmorphism.
   - **No Deep Card Nesting**: Flatten depth using typographic hierarchy, refined borders, and mathematical spacing.
   - **Typography & Legibility**: Never use gray text on colored backgrounds. Maintain strict WCAG AA contrast.
   - **Nested Border Radius Formula**: Inner Radius = Outer Radius - Padding.
   - **Pill & Button Text**: Keep text strictly single-line without wrapping in pills, chips, and action badges.
   - **Micro-Interactions**: Use smooth, intentional transitions (`motion/react`) with tactile focus and hover states.

