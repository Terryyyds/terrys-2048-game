# Code of Conduct

## Tech Stack

This project uses the following tech stack:

- typescript 5.8
- tailwindcss 4
- pnpm 10.5.2
- eslint 9
- cspell

## TypeScript

This project uses the following TypeScript strict configurations:

- `strict: true`
- `useUnknownInCatchVariables: true`
- `noUncheckedIndexedAccess: true`

- Ensure code type safety, avoid using `any` and `as`, use `unknown` and `never` instead when needed

## React Components

- All React components must use `FC` type annotation
- Avoid using default export, use named export instead if not necessary

```tsx
import { FC } from 'react';

export const Component: FC<Props> = ({ prop }) => {
  return <div>{prop}</div>;
};
```

## Import

- Use `@/` alias to import project internal modules
- Use `import type` syntax to import types

```tsx
import type { ButtonProps } from '@/components/ui/button';
import { cn } from '@/utils/component';
```

When importing files, use the shortest path, do not use `/index` or `/index.ts` suffix, corresponding to VSCode configuration

```json
{
  "typescript.preferences.importModuleSpecifierEnding": "minimal"
}
```

### CSpell Spell Check

If you encounter CSpell warnings, you can add specific terms to the `cspell.config.yaml` file in the project root

```yaml
words:
  - apple
```

## Git Commit Message

The commit message should clearly describe the changes, and be written in English. Except for professional terms, the first letter of the sentence does not need to be capitalized.

```plaintext
feat: ✨ add new feature
chore: 📦 update dependencies
fix: 🐛 something is not working
```

## Guidelines

- Ensure compatibility with Android, iOS, Windows, macOS, Linux, etc.
- Ensure compatibility with Chrome, Safari, Firefox, etc.
- Ensure compliance with WCAG, A11y, etc.
- Do not overly consider compatibility issues with old browsers

## File Naming

Use kebab-case to name files, for example `responsive-tabs.tsx`.

## Comments

Comments are written in English. DO NOT write too many comments, prefer to write code that is self-explanatory.

## Language

- Always use English for comments, code, and documentation.
- Use other languages for communication if needed.
