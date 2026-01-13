#!/bin/bash

# Script to run Storybook locally
# Make sure Node.js and pnpm are installed first

set -e

echo "🚀 Starting Storybook setup..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm || {
        echo "⚠️  Could not install pnpm via npm, trying corepack..."
        corepack enable || {
            echo "❌ Could not install pnpm. Please install manually: npm install -g pnpm"
            exit 1
        }
    }
fi

echo "✅ pnpm found: $(pnpm --version)"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
else
    echo "✅ Dependencies already installed"
fi

# Build packages if needed
if [ ! -d "packages/gantt-core/dist" ]; then
    echo "🔨 Building packages..."
    pnpm build || echo "⚠️  Build had some issues, but continuing..."
fi

# Start Storybook
echo "🎨 Starting Storybook..."
echo "📖 Storybook will be available at: http://localhost:6006"
echo ""

pnpm storybook
