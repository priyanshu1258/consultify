#!/bin/bash

# 🚀 QUICK START GUIDE FOR WHATSAPP OTP

echo "=========================================="
echo "    WhatsApp OTP Integration - Quick Start"
echo "=========================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi
echo "✓ Node.js: $(node -v)"
echo "✓ NPM: $(npm -v)"
echo ""

# Go to backend
cd "backend" || exit 1

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Install Baileys with legacy-peer-deps
echo "🔗 Installing WhatsApp Baileys..."
npm install "@whiskeysockets/baileys@^6.7.21" --legacy-peer-deps --save
echo "✓ Baileys installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Creating .env file..."
    cat > .env << EOF
PORT=5000
MONGO_URI=mongodb://localhost:27017/consultify
JWT_SECRET=your_jwt_secret_key_here
EOF
    echo "✓ .env created (update it with your values)"
else
    echo "✓ .env already exists"
fi
echo ""

echo "=========================================="
echo "           SETUP COMPLETE ✅"
echo "=========================================="
echo ""
echo "📱 NEXT STEPS:"
echo "1. Make sure MongoDB is running"
echo "2. Start the server:"
echo "   └─ npm start"
echo ""
echo "3. You'll see a WhatsApp QR code:"
echo "   └─ Open WhatsApp > Settings > Linked Devices"
echo "   └─ Scan the QR code shown in terminal"
echo ""
echo "4. Wait for confirmation:"
echo "   └─ '[WhatsApp] Successfully linked and ready to send OTPs!'"
echo ""
echo "5. Test the API:"
echo "   POST /api/auth/send-otp"
echo "   {\"identifier\": \"919876543210\"}"
echo ""
echo "=========================================="
echo ""

# Optional: Start server
read -p "Start server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm start
fi
