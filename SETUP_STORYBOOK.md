# Setup and Run Storybook Locally

## Prerequisites

You need Node.js 18+ installed. If you don't have it:

### Install Node.js

**Option 1: Using Homebrew (macOS)**
```bash
brew install node
```

**Option 2: Download from official website**
- Visit https://nodejs.org/
- Download and install the LTS version (18.x or higher)

**Option 3: Using nvm (Node Version Manager)**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install 18
nvm use 18
```

## Install pnpm

After Node.js is installed, install pnpm:

```bash
npm install -g pnpm
```

Or use corepack (comes with Node.js 16.9+):
```bash
corepack enable
corepack prepare pnpm@8.15.0 --activate
```

## Install Dependencies

```bash
cd "/Users/tim/Desktop/Iris Suite Projects/Gantt"
pnpm install
```

## Run Storybook

```bash
pnpm storybook
```

Storybook will start at: **http://localhost:6006**

## Troubleshooting

### If pnpm install fails:
```bash
# Try with npm instead
npm install
npm run storybook
```

### If port 6006 is already in use:
```bash
# Use a different port
pnpm storybook -- --port 6007
```

### If you get module resolution errors:
```bash
# Build packages first
pnpm build
pnpm storybook
```
