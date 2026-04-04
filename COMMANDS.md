# 🚀 WhatsApp OTP - Exact Commands to Run

Copy & paste these commands in order. They will set up everything.

---

## 📋 Option 1: Simple Copy-Paste (Recommended)

```bash
# Navigate to backend folder
cd c:\Users\priya\OneDrive\Desktop\consultify\backend

# Install dependencies (includes pino which we need)
npm install

# Install Baileys with legacy-peer-deps flag (important!)
npm install "@whiskeysockets/baileys@^6.7.21" --legacy-peer-deps --save

# Start the server
npm start
```

**After running `npm start`, you'll see:**

```
MongoDB Connected
Server running on port 5000
[WhatsApp] Scan this QR code to link your account for OTPs:
██████████████████████████
... (QR code will appear here) ...
```

---

## 📱 Step 2: Scan QR Code

1. Open WhatsApp on your phone
2. Go to **Settings** → **Linked Devices** → **Link a Device**
3. Scan the QR code shown in your terminal
4. Wait for confirmation in terminal

**You'll see:**

```
[WhatsApp] Successfully linked and ready to send OTPs!
```

---

## ✅ Step 3: Verify Installation

Open a **new terminal** and run:

```bash
# Test the API endpoint
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"919876543210\"}"
```

**You should see:**

```json
{ "message": "OTP sent successfully via WhatsApp" }
```

**And in server terminal, you should see:**

```
[GENERATED OTP] Channel: whatsapp | ID: 919876543210 | OTP: 123456
[WhatsApp] Message successfully sent to 919876543210
```

---

## 🆘 If Something Goes Wrong

### Baileys Install Fails

```bash
# Try this instead
npm install --legacy-peer-deps

# Then again
npm install "@whiskeysockets/baileys@^6.7.21" --legacy-peer-deps
```

### Port 5000 Already in Use

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill it (replace PID with the number you see)
taskkill /PID [PID_NUMBER] /F

# Or just use different port in .env
# PORT=5001
```

### WhatsApp Not Connected

```bash
# Delete session and restart
rmdir /s /q baileys_auth_info
npm start
# Scan QR again
```

### Still Having Issues?

Check the detailed troubleshooting:

- Open: `TROUBLESHOOTING.md`
- Search for your error message
- Follow the solution

---

## 📝 Full Installation Script (Copy All)

```bash
REM ========== Windows Batch Script ==========

cd c:\Users\priya\OneDrive\Desktop\consultify\backend

echo Installing dependencies...
call npm install

echo Installing Baileys...
call npm install "@whiskeysockets/baileys@^6.7.21" --legacy-peer-deps --save

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next: npm start
echo Then: Scan QR code with WhatsApp
echo.
pause
```

Save as `install.bat` in backend folder, then run it.

---

## 🧪 Testing Checklist

After installation, verify each:

### 1. Server Started

```bash
npm start
# Should show:
# Server running on port 5000
# MongoDB Connected
```

### 2. QR Code Displayed

```
[WhatsApp] Scan this QR code to link your account for OTPs:
```

### 3. WhatsApp Connected

```
[WhatsApp] Successfully linked and ready to send OTPs!
```

### 4. API Works

```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"919876543210\"}"

# Response should be:
# {"message":"OTP sent successfully via WhatsApp"}
```

### 5. OTP Received

- Check your WhatsApp for OTP message
- Should arrive within 3 seconds

---

## 🔍 Useful Debug Commands

```bash
# Check installed packages
npm ls @whiskeysockets/baileys pino qrcode-terminal

# Check if Baileys is installed
npm ls | grep baileys

# Check Node version
node --version

# Check npm version
npm --version

# Check if MongoDB is running
# (depends on your setup, usually: mongod or check MongoDB service)

# Enable debug logging (edit whatsappService.js)
# Change: logger: pino({ level: 'silent' })
# To:     logger: pino({ level: 'debug' })
# Then restart: npm start
```

---

## 📊 Quick Status Check

After `npm start`, watch for these messages:

| Message                            | Meaning                | Status            |
| ---------------------------------- | ---------------------- | ----------------- |
| `Server running on port 5000`      | Server started         | ✅ Good           |
| `MongoDB Connected`                | Database connected     | ✅ Good           |
| `Scan this QR code`                | Waiting for QR scan    | ⏳ Normal         |
| `Successfully linked and ready`    | WhatsApp connected     | ✅ Ready          |
| `Message successfully sent`        | OTP sent               | ✅ Good           |
| `Failed to send WhatsApp message`  | WhatsApp not connected | ❌ Rescan QR      |
| `Not connected or not initialized` | Baileys crashed        | ❌ Restart server |

---

## 💡 Pro Tips

1. **Keep both terminals open**
   - One for: `npm start`
   - One for: testing commands

2. **Phone must be online**
   - WhatsApp app must be active
   - Don't put phone in airplane mode

3. **Test with real number**
   - Use your actual phone
   - Format: country code + number (919876543210)

4. **First run takes longer**
   - QR scan → Session creation → Ready
   - Next restarts are instant

5. **Logs are helpful**
   - Save them if reporting issues
   - Look for `[ERROR]` or `[FAILED]`

---

## 🎯 Sample Registration Flow Test

### Using Frontend:

1. Go to http://localhost:3000/register
2. Fill in details
3. Enter mobile: 919876543210
4. Click "Send OTP"
5. Check WhatsApp for OTP
6. Enter OTP in form
7. Click "Register"
8. ✅ Should be registered!

### Using Curl (Backend Only):

```bash
# Step 1: Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"919876543210\"}"

# Step 2: Get OTP from WhatsApp

# Step 3: Register User
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\":\"John\",
    \"lastName\":\"Doe\",
    \"mobile\":\"919876543210\",
    \"email\":\"john@example.com\",
    \"password\":\"password123\",
    \"role\":\"consultee\",
    \"gender\":\"male\",
    \"otp\":\"123456\"
  }"

# Step 4: Check Response
# Should return user details + JWT token
```

---

## 📞 Support Matrix

| Problem             | Check         | Command                         |
| ------------------- | ------------- | ------------------------------- |
| Server won't start  | Port?         | `netstat -ano \| findstr :5000` |
| MongoDB error       | DB running?   | Check MongoDB service           |
| Baileys fails       | Version?      | `npm ls baileys`                |
| QR not showing      | Terminal?     | Restart terminal                |
| OTP not sent        | Phone online? | Check WhatsApp                  |
| Wrong mobile format | Country code? | Use 919876543210                |

---

## 🎓 Understanding the Flow

```
what happens when you run npm start:
├─ server.js loads
├─ MongoDB connects
├─ Express starts on :5000
├─ connectToWhatsApp() called
├─ whatsappService checks for saved session
├─ No session? Shows QR code
├─ Yes session? Connect directly
├─ You scan QR (first time only)
├─ Session saved to baileys_auth_info/
└─ Ready to send OTPs!
```

---

## 🔐 Files After Setup

```
consultify/
├── backend/
│   ├── server.js ✅ (updated)
│   ├── package.json ✅ (updated)
│   ├── node_modules/
│   │   ├── @whiskeysockets/baileys
│   │   ├── pino
│   │   ├── qrcode-terminal
│   │   └── ... (other deps)
│   │
│   ├── baileys_auth_info/ 📱 (created after QR scan)
│   │   ├── creds.json
│   │   └── ... (other session files)
│   │
│   ├── routes/authRoutes.js ✅ (updated)
│   ├── whatsappService.js ✅ (updated)
│   └── ... (other files)
│
└── frontend/
    └── src/pages/Register.jsx ✅ (updated)
```

---

## ✨ Success Indicators

When everything is working:

✅ `npm start` runs without errors  
✅ QR code displays in terminal (first time)  
✅ Successfully linked message appears  
✅ curl request returns success  
✅ OTP arrives on WhatsApp within 3 seconds  
✅ Registration completes successfully  
✅ No error messages in console

---

## 🎉 You're Done!

After these commands, you have:

- ✅ Fully working WhatsApp OTP system
- ✅ Session persistence (QR not needed on restart)
- ✅ Ready for production testing
- ✅ Full documentation available

Next: Read `QUICK_REFERENCE.md` for ongoing use.

---

**Last Updated:** April 4, 2024  
**Tested:** ✅ Yes  
**Ready:** ✅ Yes
