const nodemailer = require("nodemailer");

const buildTextFallback = (subject, html) => {
  const linkMatch = html ? html.match(/href=["']([^"']+)["']/i) : null;
  const verifyLink = linkMatch ? linkMatch[1] : "";
  const lines = [
    subject,
    "",
    "Please verify your email to finish setting up your Yves Nail Salon account."
  ];

  if (verifyLink) {
    lines.push("", `Verify link: ${verifyLink}`);
  }

  lines.push("", "If you did not request this, you can ignore this email.");
  return lines.join("\n");
};

const sendEmail = async (to, subject, html) => {
  const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const smtpSecure = String(process.env.SMTP_SECURE || process.env.EMAIL_SECURE || "false").toLowerCase() === "true";
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!smtpUser || !smtpPass) {
    throw new Error("SMTP configuration missing (EMAIL_USER/EMAIL_PASS or SMTP_USER/SMTP_PASS)");
  }

  console.log("SMTP probe:", {
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    user: smtpUser,
    from: process.env.EMAIL_FROM || smtpUser
  });

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  const fromName = process.env.EMAIL_FROM_NAME || "Yves Nail Salon";
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || smtpUser;
  const replyTo = process.env.EMAIL_REPLY_TO || fromEmail;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    replyTo,
    to,
    subject,

    // Plain text fallback (important for spam filters)
    text: buildTextFallback(subject, html),

    // HTML version
    html,

    // Extra headers
    headers: {
      "X-Mailer": "Nodemailer",
      "X-Priority": "3",
      "Importance": "Normal"
    }
  });
};

module.exports = sendEmail;
