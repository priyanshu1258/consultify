const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
  fetchLatestBaileysVersion,   // ← fetches WA-accepted version, fixes 405
} = require("@whiskeysockets/baileys");
const QRCode = require("qrcode");
const pino   = require("pino");

/* ── Shared state (read by adminRoutes) ─────────────────────────────── */
const waState = {
  status:    "disconnected", // "disconnected" | "qr_ready" | "connected"
  qrDataUrl: null,
  sock:      null,
};

let retryCount = 0;
const MAX_RETRIES = 5;

/* ── Connect ─────────────────────────────────────────────────────────── */
const connectToWhatsApp = async () => {
  try {
    // Fetch the latest WhatsApp Web version — prevents 405 rejections
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`[WhatsApp] Using WA version ${version.join(".")} (latest: ${isLatest})`);

    const { state, saveCreds } =
      await useMultiFileAuthState("baileys_auth_info");

    waState.sock = makeWASocket({
      version,
      auth: state,
      browser: Browsers.ubuntu("Chrome"),
      logger: pino({ level: "silent" }),
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 25000,
      retryRequestDelayMs: 2000,
      getMessage: async () => ({ conversation: "" }),
    });

    waState.sock.ev.on("creds.update", saveCreds);

    waState.sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      /* New QR — convert to green-branded data URL */
      if (qr) {
        try {
          waState.qrDataUrl = await QRCode.toDataURL(qr, {
            color: { dark: "#128C7E", light: "#ffffff" },
            width: 280,
            margin: 2,
          });
          waState.status = "qr_ready";
          console.log("[WhatsApp] QR ready — open admin panel → WhatsApp tab to scan.");
        } catch (e) {
          console.error("[WhatsApp] QR generation error:", e.message);
        }
        retryCount = 0;
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut;

        waState.status    = "disconnected";
        waState.qrDataUrl = null;
        waState.sock      = null;

        console.log(`[WhatsApp] Connection closed. Code: ${statusCode}`);

        if (isLoggedOut) {
          console.log('[WhatsApp] Logged out — delete "baileys_auth_info" and restart.');
          return;
        }

        if (retryCount < MAX_RETRIES) {
          const delay = Math.min(2000 * 2 ** retryCount, 60000);
          retryCount++;
          console.log(`[WhatsApp] Reconnecting in ${delay / 1000}s… (${retryCount}/${MAX_RETRIES})`);
          setTimeout(() => connectToWhatsApp(), delay);
        } else {
          console.log("[WhatsApp] Max retries reached. Restart server to try again.");
        }

      } else if (connection === "open") {
        retryCount        = 0;
        waState.status    = "connected";
        waState.qrDataUrl = null;
        console.log("[WhatsApp] Connected! Ready to send OTPs.");
      }
    });

  } catch (error) {
    console.error("[WhatsApp] Init error:", error.message);
    waState.status = "disconnected";

    if (retryCount < MAX_RETRIES) {
      const delay = Math.min(2000 * 2 ** retryCount, 60000);
      retryCount++;
      setTimeout(() => connectToWhatsApp(), delay);
    } else {
      console.log("[WhatsApp] Max retries reached. WhatsApp OTP unavailable.");
      waState.sock = null;
    }
  }
};

/* ── Send message ────────────────────────────────────────────────────── */
const sendWhatsAppMessage = async (mobile, message) => {
  if (!waState.sock || !waState.sock.user) {
    throw new Error("[WhatsApp] Not connected.");
  }
  const cleanMobile = mobile.replace(/[^0-9]/g, "");
  const jid = `${cleanMobile}@s.whatsapp.net`;
  await waState.sock.sendMessage(jid, { text: message });
  console.log(`[WhatsApp] Sent to ${cleanMobile}`);
};

module.exports = { connectToWhatsApp, sendWhatsAppMessage, waState };
