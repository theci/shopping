#!/bin/bash

echo "🚀 E-Commerce Monorepo Setup"
echo "=============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi
echo "✅ Node.js $(node --version) found"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi
echo "✅ pnpm $(pnpm --version) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Create .env files
echo ""
echo "📝 Creating .env files..."

if [ ! -f "apps/web/.env.local" ]; then
    cp apps/web/.env.example apps/web/.env.local
    echo "✅ Created apps/web/.env.local"
fi

if [ ! -f "apps/admin/.env.local" ]; then
    cp apps/admin/.env.example apps/admin/.env.local
    echo "✅ Created apps/admin/.env.local"
fi

if [ ! -f "apps/mobile/.env.local" ]; then
    cp apps/mobile/.env.example apps/mobile/.env.local
    echo "✅ Created apps/mobile/.env.local"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Start backend:  cd backend && ./gradlew bootRun"
echo "  2. Start web:      pnpm --filter web dev"
echo "  3. Start admin:    pnpm --filter admin dev"
echo "  4. Start mobile:   pnpm --filter mobile dev"
echo ""
echo "Or use Docker:"
echo "  docker-compose up --build"
