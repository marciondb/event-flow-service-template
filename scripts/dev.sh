#!/bin/bash

# Development startup script
# This script initializes the local development environment

set -e

echo "🚀 Starting EventFlow Service development environment..."

# Start Kafka infrastructure
echo "📦 Starting Kafka..."
docker-compose -f docker/kafka/docker-compose.yml up -d

# Wait for Kafka to be ready
echo "⏳ Waiting for Kafka to be ready..."
sleep 5

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📥 Installing dependencies..."
  npm install
fi

# Start the service in development mode
echo "🔧 Starting service in development mode..."
npm run dev
