# Install pnpm

This project uses **pnpm** workspaces, which npm doesn't support. You need to install pnpm first.

## Quick Install

```bash
npm install -g pnpm
```

Or using corepack (comes with Node.js 16.9+):

```bash
corepack enable
corepack prepare pnpm@8.15.0 --activate
```

## Verify Installation

```bash
pnpm --version
```

Should show: `8.15.0` or higher

## Then Install Dependencies

```bash
pnpm install
```

## Run Storybook

```bash
pnpm storybook
```

## Why pnpm?

This is a monorepo with workspace dependencies (`workspace:*`), which pnpm handles better than npm. The project structure requires pnpm for proper dependency resolution.
