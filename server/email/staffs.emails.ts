import { escapeHtml, renderTemplate } from "./email";
import { sendMail } from "./mailer";
import { staffVerificationTemplate, staffWelcomeTemplate } from "./template";

const getYear = () => String(new Date().getFullYear());

export const sendStaffVerificationCodeEmail = async ({
  to,
  schoolName,
  staffName,
  code,
  expiresIn = "10 minutes",
}: {
  to: string;
  schoolName: string;
  staffName: string;
  code: string;
  expiresIn?: string;
}) => {
  const subject = `${schoolName}: Your verification code`;

  const html = renderTemplate(staffVerificationTemplate, {
    schoolName: escapeHtml(schoolName),
    staffName: escapeHtml(staffName),
    code: escapeHtml(code),
    expiresIn: escapeHtml(expiresIn),
    year: getYear(),
  });

  const text = `Hi ${staffName},\n\nYour verification code is: ${code}\nIt expires in ${expiresIn}.\n\nIf you didn't request this, ignore this email.\n\n${schoolName}`;

  return sendMail({ to, subject, html, text });
};

export const sendStaffWelcomeEmail = async ({
  to,
  schoolName,
  staffName,
  email,
  password,
  portalUrl,
}: {
  to: string;
  schoolName: string;
  staffName: string;
  email: string;
  password: string;
  portalUrl: string;
}) => {
  const subject = `Welcome to ${schoolName}`;

  const html = renderTemplate(staffWelcomeTemplate, {
    schoolName: escapeHtml(schoolName),
    staffName: escapeHtml(staffName),
    email: escapeHtml(email),
    password: escapeHtml(password),
    portalUrl: escapeHtml(portalUrl),
    year: getYear(),
  });

  const text = `Welcome, ${staffName}!\n\nYour staff account has been created.\nEmail: ${email}\Password: ${password}\nPortal: ${portalUrl}\n\n${schoolName}`;

  return sendMail({ to, subject, html, text });
};
