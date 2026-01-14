#!/bin/bash

# Development startup script
# This script initializes the local development environment

set -e

echo "🚀 Starting EventFlow Service development environment..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📥 Installing dependencies..."
  npm install
fi

# Start the service in development mode
echo "🔧 Starting service in development mode..."
npm run dev
