import * as nodemailer from 'nodemailer';

export const sendMail = async (
  to: string | string[], // Main recipients
  subject: string,
  html: string,
  attachments: Array<{
    filename: string; // Updated to 'filename' to match nodemailer convention
    path: string;
  }> = [],
  cc: string | string[] = [], // Carbon copy recipients
) => {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: 'mail.concaveagri.com', // Outgoing server (SMTP)
    port: 465, // SMTP Port (SSL)
    secure: true, // Use SSL/TLS
    auth: {
      user: process.env.MAIL_USERNAME, // Replace with your actual email
      pass: process.env.MAIL_PASSWORD, // Replace with your actual password
    },
  });

  // Ensure 'to' and 'cc' are arrays
  const recipients = Array.isArray(to) ? to : [to];
  const ccRecipients = Array.isArray(cc) ? cc : [cc];

  // Prepare mail options
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: recipients.join(', '), // Join multiple recipients into a single string
    cc: ccRecipients.join(', '), // Join multiple CC recipients into a single string
    subject,
    html,
    attachments,
  };

  // Send the email
  return await transporter.sendMail(mailOptions);
};
