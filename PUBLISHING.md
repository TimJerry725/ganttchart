# Publishing iris-gantt to npm

## Prerequisites

1. Create an npm account if you don't have one: https://www.npmjs.com/signup
2. Login to npm from your terminal:
   ```bash
   npm login
   ```

## Build the Package

Before publishing, build the package:

```bash
npm run build
```

This will:
- Build the library with Vite (creates `dist/iris-gantt.es.js` and `dist/iris-gantt.umd.cjs`)
- Generate TypeScript declaration files (creates `dist/index.d.ts` and other `.d.ts` files)
- Bundle CSS (creates `dist/gantt.css`)

## Verify the Build

Check that the `dist` folder contains:
- `iris-gantt.es.js` (ES module)
- `iris-gantt.umd.cjs` (UMD module)
- `gantt.css` (styles)
- `index.d.ts` (TypeScript declarations)
- Other `.d.ts` files for all components

## Test the Package Locally (Optional)

Before publishing, you can test the package locally:

```bash
npm pack
```

This creates a `.tgz` file. You can install it in another project:

```bash
cd /path/to/test-project
npm install /path/to/iris-gantt/iris-gantt-1.0.1.tgz
```

## Publishing

### First Time Publishing

```bash
npm publish
```

### Updating the Package

1. Update the version in `package.json`:
   ```bash
   npm version patch  # for bug fixes (1.0.1 -> 1.0.2)
   npm version minor  # for new features (1.0.1 -> 1.1.0)
   npm version major  # for breaking changes (1.0.1 -> 2.0.0)
   ```

2. Build and publish:
   ```bash
   npm run build
   npm publish
   ```

### Publishing a Beta/Alpha Version

```bash
npm version prerelease --preid=beta
npm publish --tag beta
```

Users can then install with:
```bash
npm install iris-gantt@beta
```

## After Publishing

1. Verify the package on npm: https://www.npmjs.com/package/iris-gantt
2. Update the README if needed
3. Create a git tag:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

## Troubleshooting

### "You do not have permission to publish"

- Make sure you're logged in: `npm whoami`
- Check if the package name is already taken
- Verify you own the package or have publish access

### "Package name already exists"

- The name `iris-gantt` might be taken. Consider:
  - Using a scoped package: `@your-username/iris-gantt`
  - Choosing a different name

### TypeScript declarations not found

- Make sure `tsconfig.build.json` is correct
- Run `npm run build:types` separately to debug
- Check that `dist/index.d.ts` exists after build

### CSS not included

- Verify `gantt.css` is in the `dist` folder
- Check that `vite.config.ts` has `cssCodeSplit: false`
- Ensure the CSS import is in `Gantt.tsx`
