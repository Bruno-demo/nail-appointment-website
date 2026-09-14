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
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true";
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error("SMTP configuration missing (SMTP_HOST/SMTP_USER/SMTP_PASS)");
  }

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
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;
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
