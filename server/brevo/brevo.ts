// utils/brevo.ts
import axios from "axios";

const BREVO_API_KEY = (process.env.BREVO_API_KEY ?? "").trim();
if (!BREVO_API_KEY) throw new Error("BREVO_API_KEY is missing");

// console.log(BREVO_API_KEY);

const BREVO_BASE_URL = "https://api.brevo.com/v3";

type SendBrevoMailArgs = {
  to: { email: string; name?: string }[];
  subject?: string;

  // choose ONE of these
  htmlContent?: string;
  textContent?: string;
  templateId?: number;

  // optional
  params?: Record<string, any>; // template variables
  sender?: { name: string; email: string };
  replyTo?: { email: string; name?: string };
  headers?: Record<string, string>; // where you can put idempotencyKey if you want
};

export async function sendBrevoMail(args: SendBrevoMailArgs) {
  const sender = args.sender ?? {
    name: process.env.MAIL_FROM_NAME || "App",
    email: process.env.MAIL_FROM_EMAIL || "",
  };

  if (!sender.email) throw new Error("MAIL_FROM_EMAIL is missing");

  // Brevo expects: sender, to, subject, and either htmlContent/textContent OR templateId
  const payload: any = {
    sender,
    to: args.to,
    subject: args.subject,
    htmlContent: args.htmlContent,
    textContent: args.textContent,
    templateId: args.templateId,
    params: args.params,
    replyTo: args.replyTo,
    headers: args.headers,
  };

  // remove undefined fields
  Object.keys(payload).forEach(
    (k) => payload[k] === undefined && delete payload[k],
  );

  try {
    const res = await axios.post(`${BREVO_BASE_URL}/smtp/email`, payload, {
      headers: {
        "api-key": BREVO_API_KEY, // required :contentReference[oaicite:1]{index=1}
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 15000,
    });

    return res.data; // typically contains messageId
  } catch (err: any) {
    // Brevo returns useful details in err.response.data
    const status = err?.response?.status;
    const data = err?.response?.data;
    console.log(data, status);

    const message =
      data?.message || data?.error || err.message || "Brevo send failed";

    // bubble up a clean error
    const e: any = new Error(
      `Brevo send failed (${status ?? "no-status"}): ${message}`,
    );
    e.statusCode = status ?? 500;
    e.brevo = data;
    throw e;
  }
}
