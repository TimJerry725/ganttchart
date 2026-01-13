# Setup Instructions

## Prerequisites

1. **Install Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Or use a version manager like `nvm`:
     ```bash
     nvm install 18
     nvm use 18
     ```

2. **Verify installation**
   ```bash
   node --version
   npm --version
   ```

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run Storybook**
   ```bash
   npm run storybook
   ```

   Storybook will start at: **http://localhost:6006**

## Other Commands

- `npm run build` - Build the library
- `npm run typecheck` - Type check the code
- `npm run lint` - Lint the code
- `npm run build-storybook` - Build static Storybook

## Troubleshooting

If you encounter issues:

1. **Clear cache and reinstall**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version**
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

3. **Update npm**
   ```bash
   npm install -g npm@latest
   ```
