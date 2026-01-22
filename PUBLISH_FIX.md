# Fix for npm 404 Publishing Error

## The Error

```
npm error code E404
npm error 404 Not Found - GET https://registry.npmjs.org/-/v1/done?authId=***
```

## Solution

This error is usually from a failed publish attempt or npm registry hiccup. Here's how to fix it:

### Step 1: Verify You're Logged In

```bash
npm whoami
# Should show: timjerry
```

If not logged in:
```bash
npm login
```

### Step 2: Verify Package Ownership

```bash
npm view iris-gantt maintainers
# Should show: timjerry <tim@steam-a.com>
```

### Step 3: Build the Package

```bash
npm run build
```

### Step 4: Publish

```bash
# Option 1: Publish directly
npm publish

# Option 2: If you get errors, try with --access flag
npm publish --access public

# Option 3: If still having issues, clear npm cache first
npm cache clean --force
npm publish
```

## Common Issues

### Issue: "Package name already exists"

**Solution:** The version number needs to be incremented. Current version is 1.0.2, which is correct.

### Issue: "You do not have permission"

**Solution:** Make sure you're logged in as the package owner:
```bash
npm whoami
npm login
```

### Issue: "404 Not Found" during publish

**Solution:** This is usually a temporary npm registry issue. Try:
1. Wait a few minutes and retry
2. Clear npm cache: `npm cache clean --force`
3. Check npm status: https://status.npmjs.org/

### Issue: Authentication errors

**Solution:** Re-authenticate:
```bash
npm logout
npm login
```

## Verification After Publishing

```bash
# Check the published version
npm view iris-gantt version

# Should show: 1.0.2

# Check all versions
npm view iris-gantt versions

# Install the new version in another project
npm install iris-gantt@latest
```

## Publishing Checklist

- [ ] Version bumped in package.json (currently 1.0.2)
- [ ] Build completed successfully (`npm run build`)
- [ ] Logged into npm (`npm whoami` shows your username)
- [ ] Package ownership verified
- [ ] All tests pass (if you have tests)
- [ ] README is up to date
- [ ] No sensitive data in package

## After Publishing

1. **Tag the release in git:**
   ```bash
   git tag v1.0.2
   git push origin v1.0.2
   ```

2. **Update your project:**
   ```bash
   # In your other project
   npm update iris-gantt
   ```

3. **Verify installation:**
   ```bash
   npm list iris-gantt
   # Should show 1.0.2
   ```
