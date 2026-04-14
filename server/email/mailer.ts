export const runtime = "nodejs";

import nodemailer from "nodemailer";
import { sendBrevoMail } from "../brevo/brevo";

const host = process.env.BREVO_SMTP_HOST!;
const port = Number(process.env.BREVO_SMTP_PORT || 587);
const user = process.env.BREVO_SMTP_USER!;
const pass = process.env.BREVO_SMTP_PASS!;

if (!host || !user || !pass) {
  throw new Error("Missing Brevo SMTP env vars");
}

export const mailer = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
  requireTLS: true,
  tls: {
    minVersion: "TLSv1.2",
  },
});

export const sendMail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) => {
  const fromName = process.env.MAIL_FROM_NAME || "App";
  const fromEmail = process.env.MAIL_FROM_EMAIL || process.env.BREVO_SMTP_USER!;

  return sendBrevoMail({
    // from: `${fromName} <${fromEmail}>`,
    to: [{ email: to }],
    subject,
    // text,
    htmlContent: html,
  });
};
