require('dotenv').config();
const nodemailer = require('nodemailer');

const testMail = async () => {
    try {
        console.log("USER:", process.env.EMAIL_USER);
        console.log("PASS:", process.env.EMAIL_PASS);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: (process.env.EMAIL_USER || '').trim(),
                pass: (process.env.EMAIL_PASS || '').trim()
            }
        });
        await transporter.verify();
        console.log('Nodemailer Gmail account ready with real email service 🚀');
        let info = await transporter.sendMail({
            from: '"Consultify Test" <no-reply@consultify.app>',
            to: process.env.EMAIL_USER.trim(), // Send to self
            subject: "Test Mail",
            text: "This is a test email."
        });
        console.log("Email sent successfully: " + info.messageId);
    } catch (err) {
        console.error("Error:", err);
    }
}
testMail();
