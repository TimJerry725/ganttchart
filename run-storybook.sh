#!/bin/bash

# Script to run Storybook
# Make sure Node.js and npm are installed first

set -e

echo "🚀 Starting Storybook..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    echo "Please install npm (comes with Node.js)"
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Start Storybook
echo "🎨 Starting Storybook..."
echo "📖 Storybook will be available at: http://localhost:6006"
echo ""

npm run storybook
