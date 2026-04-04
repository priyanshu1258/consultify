# WhatsApp OTP - Troubleshooting Guide

## 🚨 Common Issues & Solutions

---

## ❌ Issue 1: `ERR_INVALID_ARG_TYPE` During npm install

### Error Message:

```
npm error code ERR_INVALID_ARG_TYPE
npm error The "file" argument must be of type string. Received undefined
```

### Cause:

Baileys preinstall script fails on Windows due to path issues.

### ✅ Solutions:

**Option A: Use --legacy-peer-deps (Recommended)**

```bash
cd backend
npm install --legacy-peer-deps
# This ignores peer dependency conflicts
```

**Option B: Install Baileys separately**

```bash
npm install
npm install "@whiskeysockets/baileys@^6.7.21" --legacy-peer-deps --save
```

**Option C: Use Yarn instead**

```bash
npm install -g yarn
yarn add "@whiskeysockets/baileys@^6.7.21" --legacy-peer-deps
```

**Option D: Clean npm cache**

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## ❌ Issue 2: `[WhatsApp] Not connected or not initialized`

### Error Message:

```
Failed to send WhatsApp message. Ensure Baileys is connected.
```

### Cause:

- WhatsApp QR code not scanned
- Session expired
- Baileys crashed

### ✅ Solutions:

**Step 1: Check if server is running**

```bash
# Terminal shows this when connected:
[WhatsApp] Successfully linked and ready to send OTPs!
```

**Step 2: Rescan QR Code**

```bash
# Delete saved session
rm -rf baileys_auth_info/

# Restart server
npm start

# You'll see: "[WhatsApp] Scan this QR code to link..."
# Scan with WhatsApp Settings > Linked Devices > Link a Device
```

**Step 3: Check Phone is Online**

- Ensure WhatsApp is open and active
- Phone must be connected to internet
- Don't put phone in airplane mode

**Step 4: Check Baileys Version**

```bash
npm ls @whiskeysockets/baileys
# Should show: @whiskeysockets/baileys@6.7.21 (or latest)
```

---

## ❌ Issue 3: OTP Not Received on WhatsApp

### Error Message:

No error, but OTP doesn't arrive on phone.

### Cause:

- Wrong mobile number format
- Network connectivity issue
- WhatsApp account not properly linked
- Baileys crashed silently

### ✅ Solutions:

**Check Mobile Format:**

```javascript
// CORRECT FORMAT:
919876543210    // India: 91 + number
14156667777     // USA: 1 + number
442071963000    // UK: 44 + number

// WRONG FORMATS:
+919876543210   // ❌ Has +
91 98765 43210  // ❌ Has spaces
09876543210     // ❌ Missing country code, starts with 0
```

**Test with curl:**

```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "919876543210"}'

# Should respond:
# {"message":"OTP sent successfully via WhatsApp"}
```

**Check Server Logs:**

```
[GENERATED OTP] Channel: whatsapp | ID: 919876543210 | OTP: 234567
[WhatsApp] Message successfully sent to 919876543210
```

**If no logs appear:**

- Server crashed (see console for error)
- Baileys not initialized
- Check Step 2 above (Rescan QR)

**Test Direct Connection:**

```bash
# In whatsappService.js temporarily add:
console.log("[TEST] Socket user:", sock?.user);
console.log("[TEST] Socket connected:", sock?.user?.id);

# Then restart and check output
```

---

## ❌ Issue 4: Server Crashes with Verbose Output

### Error Message:

```
[many lines of internal Baileys logs]
...crashes...
```

### Cause:

Missing or incorrect Pino logger configuration.

### ✅ Solution:

**Check whatsappService.js has Pino:**

```javascript
const pino = require("pino");

sock = makeWASocket({
  auth: state,
  printQRInTerminal: false,
  browser: ["Consultify Admin", "Chrome", "1.0.0"],
  logger: pino({ level: "silent" }), // ← MUST BE HERE
});
```

**If not there, add it:**

```bash
# Install pino
npm install pino

# Update whatsappService.js with the logger config above
```

---

## ❌ Issue 5: "Failed to send WhatsApp message" Even After QR Scan

### Error Message:

```
Failed to send WhatsApp message. Ensure Baileys is connected.
```

### Cause:

- Phone disconnected or offline
- WhatsApp updated (Baileys may need update)
- Rate limiting on WhatsApp
- Baileys session corrupted

### ✅ Solutions:

**Option 1: Relink Account**

```bash
# Delete session
rm -rf baileys_auth_info/

# Restart and rescan QR
npm start
```

**Option 2: Update Baileys**

```bash
npm update "@whiskeysockets/baileys"
```

**Option 3: Check Phone WhatsApp**

- Open WhatsApp on phone
- Go to Settings > Linked Devices
- Check if your device is listed as "Online" (not "Inactive")
- If inactive, remove and rescan QR

**Option 4: Try Different Number**

- Test sending OTP to different phone number
- Verify that specific number isn't blocked

**Option 5: Check Rate Limiting**

- Baileys has rate limits on WhatsApp
- Wait 1-2 minutes before retrying
- Don't spam OTP requests

---

## ❌ Issue 6: Module Not Found: `@whiskeysockets/baileys`

### Error Message:

```
Error: Cannot find module '@whiskeysockets/baileys'
```

### Cause:

- Package not installed
- Wrong installation path
- package.json not updated

### ✅ Solutions:

**Check if installed:**

```bash
npm ls @whiskeysockets/baileys
```

**Install if missing:**

```bash
npm install "@whiskeysockets/baileys@^6.7.21" --legacy-peer-deps --save
```

**Check package.json:**

```json
{
  "dependencies": {
    "@whiskeysockets/baileys": "^6.7.21" // Should be here
  }
}
```

**Reinstall everything:**

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## ❌ Issue 7: Port Already in Use

### Error Message:

```
Error: listen EADDRINUSE: address already in use :::5000
```

### Cause:

- Another process using port 5000
- Previously crashed server still running

### ✅ Solutions:

**Option A: Kill Process on Port 5000**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# macOS/Linux
lsof -i :5000
kill -9 [PID]
```

**Option B: Use Different Port**

```bash
# In .env or server.js
PORT=5001
```

**Option C: Use npm script**

```bash
# Update package.json
"scripts": {
  "start": "node server.js",
  "start:dev": "PORT=5001 node server.js"
}

npm run start:dev
```

---

## ❌ Issue 8: Mobile Number Shows in Log but No Message Sent

### Error Message:

```
[GENERATED OTP] Channel: whatsapp | ID: 919876543210 | OTP: 234567
(then nothing - no "Message successfully sent" log)
```

### Cause:

- `sock.sendMessage()` threw error
- Error not being caught properly
- Network issue at sendMessage stage

### ✅ Solutions:

**Add debugging:**

```javascript
const sendWhatsAppMessage = async (mobile, message) => {
  try {
    if (!sock || !sock.user) {
      console.log("[DEBUG] sock status:", {
        hasSocket: !!sock,
        hasUser: !!sock?.user,
      });
      throw new Error("[WhatsApp] Not connected or not initialized.");
    }

    const cleanMobile = mobile.replace(/[^0-9]/g, "");
    console.log("[DEBUG] Sending to:", cleanMobile);

    const jid = `${cleanMobile}@s.whatsapp.net`;
    console.log("[DEBUG] JID:", jid);

    await sock.sendMessage(jid, { text: message });
    console.log(`[WhatsApp] Message successfully sent to ${cleanMobile}`);
  } catch (error) {
    console.error("[WhatsApp SEND ERROR]:", error.message);
    console.error("[ERROR DETAILS]:", error);
    throw error;
  }
};
```

**Restart and check logs:**

```bash
npm start
# Look for [DEBUG] messages
```

---

## ❌ Issue 9: MongoDB OTP Not Saving

### Error Message:

```
OTP created in logs, but register fails: "Invalid or expired OTP"
```

### Cause:

- MongoDB not running
- Connection string wrong
- Otp model misconfigured

### ✅ Solutions:

**Check MongoDB Connection:**

```bash
# Should see on startup:
MongoDB Connected
```

**Test MongoDB:**

```bash
# Terminal
mongo consultify

# In mongo shell
db.otps.find()
```

**Check Otp Model:**

```javascript
// models/Otp.js should have:
const otpSchema = new Schema({
  identifier: String, // mobile number
  otp: String, // 6-digit code
  createdAt: { type: Date, default: Date.now, expires: 300 }, // 5min TTL
});
```

**Verify in authRoutes.js:**

```javascript
const Otp = require("../models/Otp");

await Otp.deleteMany({ identifier });
await Otp.create({ identifier, otp: otpCode });
```

---

## ❌ Issue 10: "You have logged out. Delete baileys_auth_info folder"

### Error Message:

```
[WhatsApp] You have logged out. Delete "baileys_auth_info" folder to rescan QR.
```

### Cause:

- Logged out from WhatsApp Web
- Session timeout
- WhatsApp forced logout

### ✅ Solutions:

**Delete Session and Rescan:**

```bash
rm -rf baileys_auth_info/
npm start
# Scan QR code again
```

**Physical Device Logout:**

- Open WhatsApp on phone
- Settings > Linked Devices
- Check for your device
- If listed, click three dots and remove it
- Then rescan QR

---

## ✅ Verification Checklist

Run this checklist if things aren't working:

- [ ] Node.js installed? `node -v`
- [ ] MongoDB running? `npm run test-db` (if available)
- [ ] Baileys installed? `npm ls @whiskeysockets/baileys`
- [ ] Pino installed? `npm ls pino`
- [ ] whatsappService.js has pino logger? ✓
- [ ] server.js calls connectToWhatsApp()? ✓
- [ ] Phone has WhatsApp active? ✓
- [ ] QR code scanned recently? ✓
- [ ] baileys_auth_info folder exists? ✓
- [ ] Mobile number format correct? (919876543210)
- [ ] .env file configured? ✓

---

## 🆘 Still Having Issues?

**Enable Debug Mode:**

```javascript
// In whatsappService.js
const pino = require("pino");

// Change from:
logger: pino({ level: "silent" });

// To:
logger: pino({ level: "debug" }); // Shows all logs

// Restart and share errors
```

**Check Baileys GitHub:**
https://github.com/WhiskeySockets/Baileys/issues

**Share these logs:**

1. Full error message from terminal
2. Output from `npm ls` (dependencies)
3. Content of `.env` (without secrets)
4. Your Node.js and npm versions

---

## 📚 Additional Resources

- **Baileys Repo:** https://github.com/WhiskeySockets/Baileys
- **WhatsApp API Docs:** https://developers.facebook.com/docs/whatsapp
- **Pino Logger:** https://getpino.io
- **MongoDB Docs:** https://docs.mongodb.com

---

**Last Updated:** 2024-04-04  
**Status:** ✅ Active & Maintained
