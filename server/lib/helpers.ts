import Cookies from "js-cookie";

type CookieOptions = Parameters<typeof Cookies.set>[2];
export const TOKEN_COOKIE =
  process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? "intelluser";

const cookieOpts: CookieOptions = {
  expires: 1,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function saveToken(token: string, days = 7) {
  Cookies.set(TOKEN_COOKIE, token, { ...cookieOpts, expires: days });
}
export function clearToken() {
  Cookies.remove(TOKEN_COOKIE, { path: "/" });
}
export function getToken() {
  return Cookies.get(TOKEN_COOKIE) ?? null;
}

// lib/cloudinary-upload.ts
export async function uploadToCloudinary(
  file: File,
  opts?: {
    folder?: string;
    resourceType?: "image" | "video" | "raw";
    publicId?: string;
  },
) {
  const res = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      folder: opts?.folder,
      public_id: opts?.publicId,
      resource_type: opts?.resourceType ?? "image",
    }),
  });
  const sig = await res.json();
  if (!res.ok) throw new Error(sig?.error || "Failed to get signature");

  const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${sig.resource_type}/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);
  if (opts?.publicId) form.append("public_id", opts.publicId);

  const up = await fetch(endpoint, { method: "POST", body: form });
  const data = await up.json();
  if (!up.ok) throw new Error(data?.error?.message || "Upload failed");

  // data.secure_url, data.public_id, data.bytes, data.format, etc.
  return data;
}
