import nodemailer from 'nodemailer';

// Create a transporter using Hostinger SMTP settings
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP_USER or SMTP_PASS is not configured. Email will not be sent.");
    return false;
  }

  try {
    const fromAddress = `"DJW Pickleball" <${process.env.SMTP_USER}>`;
    
    const info = await transporter.sendMail({
      from: fromAddress,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
    });
    
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email via nodemailer:", error);
    throw error;
  }
}
