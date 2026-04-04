# WhatsApp OTP Integration - Migration Guide

## Overview

This document outlines the changes made to migrate from **Email OTP** to **WhatsApp OTP** system using Baileys library.

---

## Changes Made

### 1. **Backend Changes**

#### A. `whatsappService.js` (Modified)

- **Added Logger**: Integrated `pino` logger with `printQRInTerminal: false` to prevent verbose logging that causes crashes
- **Key Functions**:
  - `connectToWhatsApp()`: Initializes Baileys connection with QR code display
  - `sendWhatsAppMessage()`: Sends OTP messages to mobile numbers (requires country code, e.g., 919876543210)

#### B. `authRoutes.js` (Modified)

**Removed:**

- `nodemailer` dependency
- Email transporter initialization (`initializeTransporter()`)
- Email sending logic
- Optional `channel` parameter from `/send-otp` endpoint

**Changes:**

- `/api/auth/send-otp` - Now **WhatsApp only**
  - **Input**: `identifier` (mobile number) required
  - **No longer needs**: email or channel parameter
  - Always sends via WhatsApp
- `/api/auth/register` - Updated OTP verification
  - Uses `mobile` as identifier instead of conditional channel logic
  - Expects OTP sent via WhatsApp

#### C. `server.js` (Modified)

- Added import: `const { connectToWhatsApp } = require("./whatsappService");`
- Added initialization call: `connectToWhatsApp();` in the `app.listen()` callback
- WhatsApp connection starts automatically when server starts

#### D. `package.json` (Updated)

- **Removed**: `nodemailer` (^8.0.4)
- **Kept**: `pino` (^10.3.1) for Baileys logger
- **Note**: `@whiskeysockets/baileys` should be installed separately if needed

### 2. **Frontend Changes**

#### A. `Register.jsx` (Modified)

**Before:**

```javascript
const { data } = await api.post("/api/auth/send-otp", { email });
```

**After:**

```javascript
const { data } = await api.post("/api/auth/send-otp", {
  identifier: mobile,
  channel: "whatsapp",
});
```

---

## Installation & Setup

### 1. **Install Node Modules**

```bash
cd backend
npm install
```

### 2. **Install Baileys (Manual)**

Due to compatibility issues, install Baileys without automated building:

```bash
npm install --save "@whiskeysockets/baileys@^6.7.21" --legacy-peer-deps
```

Or use Yarn (recommended):

```bash
yarn add "@whiskeysockets/baileys@^6.7.21" "qrcode-terminal@^0.12.0" --legacy-peer-deps
```

### 3. **Environment Variables (.env)**

Make sure you have:

```env
MONGO_URI=mongodb://localhost:27017/consultify
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## How It Works

### **QR Code Scanning (First Time Setup)**

1. Start the backend server: `npm start`
2. You'll see: `[WhatsApp] Scan this QR code to link your account for OTPs:`
3. Scan the QR with WhatsApp
4. Baileys authentication info is stored in `baileys_auth_info/` folder
5. Connection established: `[WhatsApp] Successfully linked and ready to send OTPs!`

### **OTP Flow**

1. **User registers** → Frontend calls `/api/auth/send-otp` with `{ identifier: "+919876543210", channel: "whatsapp" }`
2. **Backend generates** 6-digit OTP and stores in MongoDB
3. **Baileys sends** OTP via WhatsApp to the mobile number
4. **User enters OTP** → Backend validates and registers user

---

## Important Notes

### **Mobile Number Format**

- Include country code (e.g., 91 for India)
- Remove +, spaces, or dashes
- **Correct**: `919876543210`
- **Incorrect**: `+91 9876543210`, `09876543210`

### **Troubleshooting**

| Issue                                         | Solution                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------- |
| `[WhatsApp] Not connected or not initialized` | Scan QR code again. Delete `baileys_auth_info/` folder and restart server |
| `Failed to send WhatsApp message`             | Ensure the account is active and QR scan was successful                   |
| `ERR_INVALID_ARG_TYPE` during npm install     | Use `npm install --legacy-peer-deps`                                      |
| Crashes with verbose logging                  | Logger configured with `pino({ level: 'silent' })`                        |

### **Production Considerations**

- Store `baileys_auth_info/` folder safely (contains session credentials)
- Use a dedicated WhatsApp Business Account for better reliability
- Consider backup OTP methods (SMS) for critical apps
- Monitor Baileys connection status and implement reconnection logic

---

## API Changes Summary

### DELETE ❌

- `POST /api/auth/send-otp` with `{ email, channel }`

### NEW ✅

- `POST /api/auth/send-otp` with `{ identifier }` (mobile only)
  ```json
  {
    "identifier": "919876543210"
  }
  ```

### Updated ✅

- `POST /api/auth/register` - No longer accepts `channel` parameter

---

## Files Modified

- ✅ `backend/whatsappService.js` - Enhanced with Pino logger
- ✅ `backend/routes/authRoutes.js` - Removed email, email-only WhatsApp
- ✅ `backend/server.js` - Added Baileys initialization
- ✅ `backend/package.json` - Removed nodemailer
- ✅ `frontend/src/pages/Register.jsx` - Updated OTP request payload

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Scan QR code to link WhatsApp account
3. ✅ Test OTP generation and sending
4. ✅ Update Login page if OTP login is supported
5. ✅ Consider adding SMS fallback (optional)
