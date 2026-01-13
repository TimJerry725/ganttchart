# Changesets

This directory contains changeset files that track changes for versioning and changelog generation.

## Adding a Changeset

Run `pnpm changeset` to create a new changeset file describing your changes.

## Publishing

When ready to publish, run:
- `pnpm version-packages` - Updates package versions based on changesets
- `pnpm release` - Builds and publishes packages to npm
