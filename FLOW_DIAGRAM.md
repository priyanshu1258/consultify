# WhatsApp OTP Flow Diagram

## 🔄 Registration Flow (WhatsApp OTP)

```
┌─────────────────────────────────────────────────────────────────┐
│                         REGISTRATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

Frontend (Register.jsx)
    │
    │ 1. User enters mobile: "919876543210"
    │
    ├──> POST /api/auth/send-otp
    │    { identifier: "919876543210", channel: "whatsapp" }
    │
    │ Backend (authRoutes.js)
    │    │
    │    ├──> Generate OTP: "123456"
    │    ├──> Save OTP in MongoDB (Otp collection)
    │    │
    │    └──> sendWhatsAppMessage()
    │         │
    │         └──> whatsappService.js
    │              │
    │              ├──> Clean mobile: "919876543210"
    │              ├──> Format JID: "919876543210@s.whatsapp.net"
    │              │
    │              └──> Baileys Socket
    │                   │
    │                   └──> WhatsApp Server 📱
    │                        │
    │                        └──> User's Phone
    │                             "Your verification code is: 123456"
    │
    │    Response: { message: "OTP sent successfully via WhatsApp" }
    │
    │ 2. User receives WhatsApp OTP on phone
    │
    ├──> Enters OTP in Register form
    │
    ├──> POST /api/auth/register
    │    {
    │      firstName: "John",
    │      lastName: "Doe",
    │      mobile: "919876543210",
    │      email: "john@example.com",
    │      password: "password123",
    │      otp: "123456"  ← Entered by user
    │    }
    │
    │ Backend validates:
    │    ├──> Check OTP matches DB
    │    ├──> Check mobile not registered
    │    ├──> Create User
    │    ├──> Delete OTP from DB (cleanup)
    │    └──> Return JWT token
    │
    └──> User logged in! ✅

```

## 🔌 Server Startup Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER STARTUP FLOW                         │
└─────────────────────────────────────────────────────────────────┘

npm start
    │
    ├──> server.js loads
    │    │
    │    ├──> mongoose.connect()
    │    │    └──> MongoDB connected ✓
    │    │
    │    ├──> app.listen(5000)
    │    │    └──> Server running on port 5000 ✓
    │    │
    │    └──> connectToWhatsApp() [NEW]
    │         │
    │         └──> whatsappService.js
    │              │
    │              ├──> useMultiFileAuthState("baileys_auth_info")
    │              │    ├──> Check if session exists
    │              │    ├── YES──> Load saved session
    │              │    └──NO──> Show QR code
    │              │
    │              ├──> makeWASocket(config)
    │              │    ├──> logger: pino({ level: "silent" })  [FIXED]
    │              │    └──> Prevents verbose output crashes
    │              │
    │              └──> sock.ev.on("connection.update", ...)
    │                   │
    │                   ├── IF QR──> Display QR code
    │                   │           Scan with WhatsApp
    │                   │
    │                   ├──IF OPEN──> console.log(
    │                   │       "[WhatsApp] Successfully linked and ready!"
    │                   │    )
    │                   │
    │                   └──IF CLOSE──> Auto-reconnect
    │
    └──> Ready to send OTPs! 🚀

```

## 📊 Data Flow in OTP Sending

```
┌──────────────────────────────────────────────────────────────┐
│           OTP GENERATION & STORAGE FLOW                       │
└──────────────────────────────────────────────────────────────┘

Request:
  /api/auth/send-otp
  { identifier: "919876543210" }
       │
       ├──> const otpCode = Math.floor(100000 + Math.random() * 900000)
       │    Result: "234567" (6-digit)
       │
       ├──> await Otp.deleteMany({ identifier })
       │    Removes any old OTPs for this number
       │
       ├──> await Otp.create({ identifier, otp: otpCode })
       │    Saves in MongoDB:
       │    {
       │      _id: ObjectId(...),
       │      identifier: "919876543210",
       │      otp: "234567",
       │      createdAt: timestamp
       │    }
       │
       └──> await sendWhatsAppMessage(identifier, message)
            │
            ├──> Validate sock is connected
            │
            ├──> cleanMobile = mobile.replace(/[^0-9]/g, "")
            │    "919876543210" → "919876543210" ✓
            │
            ├──> jid = "919876543210@s.whatsapp.net"
            │
            └──> sock.sendMessage(jid, { text: message })
                 │
                 └──> WhatsApp Server
                      │
                      └──> 📱 User's Phone

```

## 🔐 Session Persistence

```
┌──────────────────────────────────────────────────────────────┐
│              BAILEYS SESSION MANAGEMENT                        │
└──────────────────────────────────────────────────────────────┘

First Run:
  ├──> baileys_auth_info/ doesn't exist
  ├──> Show QR code
  ├──> User scans with WhatsApp
  └──> sock.ev.on("creds.update", saveCreds)
       ├──> Creates baileys_auth_info/
       ├──> Saves:
       │   ├──> creds.json (main credentials)
       │   ├──> pre-key-*.json (encryption keys)
       │   └──> session-*.json (session data)
       └──> All future restarts use these files ✓

Subsequent Runs:
  └──> baileys_auth_info/ exists
       ├──> useMultiFileAuthState() loads saved session
       ├──> No QR code needed
       ├──> Auto-connects to WhatsApp ✓
       └──> Ready to send OTPs immediately

Manual Reset:
  └──> rm -rf baileys_auth_info/
       ├──> Deletes all saved session data
       ├──> Next restart requires QR scan
       └──> Useful if you want to switch accounts

```

## 🗂️ File Structure After Integration

```
consultify/
│
├── backend/
│   ├── server.js ✅ [UPDATED]
│   │   └──> Added: const { connectToWhatsApp } = require(...)
│   │   └──> Added: connectToWhatsApp() in app.listen()
│   │
│   ├── whatsappService.js ✅ [UPDATED]
│   │   ├──> Added: const pino = require('pino')
│   │   └──> Added: logger: pino({ level: 'silent' })
│   │
│   ├── routes/
│   │   └── authRoutes.js ✅ [UPDATED]
│   │       ├──> Removed: nodemailer logic
│   │       ├──> Added: WhatsApp-only OTP
│   │       └──> Changed: Expects identifier (mobile)
│   │
│   ├── package.json ✅ [UPDATED]
│   │   ├──> Removed: "nodemailer"
│   │   └──> Kept: "qrcode-terminal", "pino"
│   │
│   └── baileys_auth_info/ 📱 [AUTO-CREATED]
│       ├──> creds.json
│       ├──> pre-key-*.json
│       └──> session-*.json
│
└── frontend/
    └── src/pages/
        └── Register.jsx ✅ [UPDATED]
            └──> Changed: Sends { identifier: mobile, channel: 'whatsapp' }

```

## 📈 Complete User Journey

```
User Journey: Registration with WhatsApp OTP

User Visit Register Page
    ↓
Enter Details (Name, Email, Mobile)
    ↓
Click "Send OTP" Button
    ↓
    ├──> Frontend → POST /api/auth/send-otp
    │    ├──> Backend generates 6-digit code
    │    ├──> Saves to MongoDB
    │    └──> Sends via Baileys → WhatsApp 📱
    │
    ├──> User sees WhatsApp notification
    │    "Welcome to Consultify!
    │     Your verification code is: 234567"
    │
Enter OTP in Form
    ↓
Click "Register" Button
    ↓
    ├──> Frontend → POST /api/auth/register
    │    ├──> Backend validates OTP against DB
    │    ├──> Creates user in MongoDB
    │    ├──> Deletes used OTP
    │    └──> Returns JWT token
    │
✅ USER REGISTERED
    ├──> Session stored in localStorage
    └──> Redirected to Dashboard

```

---

**Key Points:**

- 🟢 Green checkmarks = Already implemented
- 🔵 Blue dots = Automatic flows
- 📱 Mobile = WhatsApp interaction
- ✅ Works offline after session is saved
