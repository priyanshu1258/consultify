#!/bin/bash

# WhatsApp OTP Integration - Setup Script
# This script helps install and configure the WhatsApp OTP system

echo "==================================="
echo "WhatsApp OTP Integration Setup"
echo "==================================="
echo ""

# Navigate to backend
cd backend || exit 1

echo "📦 Installing dependencies..."
npm install

echo ""
echo "⚠️  Installing Baileys (may take a moment)..."
echo "Using legacy-peer-deps flag to avoid build issues..."

# Try npm first, fallback to yarn
if ! npm install "@whiskeysockets/baileys@^6.7.21" --legacy-peer-deps; then
    echo ""
    echo "ℹ️  Trying with Yarn (recommended)..."
    if ! command -v yarn &> /dev/null; then
        echo "❌ Yarn not found. Installing npm package again with skip-optional..."
        npm install "@whiskeysockets/baileys@^6.7.21" --legacy-peer-deps --no-optional
    else
        yarn add "@whiskeysockets/baileys@^6.7.21" "qrcode-terminal@^0.12.0" --legacy-peer-deps
    fi
fi

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "==================================="
echo "Next Steps:"
echo "==================================="
echo ""
echo "1. Start the backend server:"
echo "   npm start"
echo ""
echo "2. You'll see a QR code - scan it with WhatsApp"
echo ""
echo "3. Wait for: '[WhatsApp] Successfully linked and ready to send OTPs!'"
echo ""
echo "4. Test registration with mobile OTP"
echo ""
echo "==================================="
