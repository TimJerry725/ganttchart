# npm Package Setup Summary

Your `iris-gantt` package is now configured for npm publishing! Here's what was set up:

## ✅ Completed Setup

### 1. **package.json Updates**
   - Added proper npm metadata (description, keywords, repository, license)
   - Configured modern `exports` field for ES modules and CommonJS
   - Added `dayjs` as a peer dependency (required by TaskEditor and TaskCreator)
   - Set up build scripts including TypeScript declaration generation
   - Added `prepublishOnly` script to auto-build before publishing

### 2. **Build Configuration**
   - Updated `vite.config.ts` to properly bundle CSS as `gantt.css`
   - Externalized all peer dependencies
   - Created `tsconfig.build.json` for TypeScript declaration generation

### 3. **Documentation**
   - Created `README_NPM.md` with npm-specific installation and usage instructions
   - Created `PUBLISHING.md` with step-by-step publishing guide
   - Created `.npmignore` to exclude unnecessary files from the package

## 📦 Package Structure

The published package will include:
```
iris-gantt/
├── dist/
│   ├── iris-gantt.es.js      # ES module
│   ├── iris-gantt.umd.cjs    # UMD module
│   ├── gantt.css              # Styles
│   └── *.d.ts                 # TypeScript declarations
└── README.md                  # Documentation
```

## 🚀 Next Steps

### 1. Test the Build
```bash
npm run build
```

Verify that `dist/` contains:
- `iris-gantt.es.js`
- `iris-gantt.umd.cjs`
- `gantt.css`
- `index.d.ts` and other `.d.ts` files

### 2. Test Locally (Optional)
```bash
npm pack
# This creates a .tgz file you can install in another project
```

### 3. Publish to npm
```bash
npm login
npm publish
```

## 📝 Important Notes

1. **README.md**: npm will use your existing `README.md` by default. If you want npm-specific content, you can:
   - Update `README.md` to work for both GitHub and npm
   - Or copy `README_NPM.md` to `README.md` before publishing

2. **Version Management**: Use `npm version` to bump versions:
   ```bash
   npm version patch  # 1.0.1 -> 1.0.2
   npm version minor  # 1.0.1 -> 1.1.0
   npm version major  # 1.0.1 -> 2.0.0
   ```

3. **Peer Dependencies**: Users must install these:
   ```bash
   npm install react react-dom antd dayjs @fortawesome/react-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
   ```

## 📚 Usage Example (for users)

```tsx
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'

// Use the component...
```

See `README_NPM.md` for complete usage documentation.

## 🔍 Files Created/Modified

- ✅ `package.json` - Updated with npm publishing config
- ✅ `vite.config.ts` - Updated for CSS bundling
- ✅ `tsconfig.build.json` - New file for type generation
- ✅ `README_NPM.md` - npm-specific documentation
- ✅ `PUBLISHING.md` - Publishing guide
- ✅ `.npmignore` - Excludes dev files from package
- ✅ `NPM_SETUP_SUMMARY.md` - This file
