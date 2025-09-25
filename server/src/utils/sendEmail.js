import nodemailer from "nodemailer";

let transporter;

// Gmail in development, Brevo in production
if (process.env.NODE_ENV === "production") {
  transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT || 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });
} else {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};
