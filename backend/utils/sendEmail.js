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
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
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
