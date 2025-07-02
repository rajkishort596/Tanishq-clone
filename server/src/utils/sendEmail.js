import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  // Create a transporter using your email service credentials
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};
