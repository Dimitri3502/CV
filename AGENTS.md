# AGENTS

- Keep files small and focused.
- A React component must not exceed 100 lines.
- If a component approaches 100 lines, extract child components or hooks.
- Split UI into dedicated components when logic or markup grows.
- For UI option lists backed by string enums, derive options with `Object.values(MyEnum)`; hardcode arrays only for
  intentional subsets or custom ordering.
- For confirmation modals, prefer the global `useMainContext().handleConfirm` flow over local `ConfirmDialog` instances.
