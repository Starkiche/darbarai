import { createHmac } from "crypto";
import { templates, sendEmail } from "~/server/utils/emailTemplates";

// Vérifie la signature HMAC envoyée par Supabase (standard webhooks)
const verifySignature = (rawBody: string, headers: Record<string, string | undefined>, secret: string) => {
  const secretBase64 = secret.replace(/^v1,whsec_/, "");
  const secretBytes = Buffer.from(secretBase64, "base64");

  const id = headers["webhook-id"];
  const timestamp = headers["webhook-timestamp"];
  const signature = headers["webhook-signature"];

  if (!id || !timestamp || !signature) throw new Error("Missing webhook headers");

  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - parseInt(timestamp));
  if (ageSeconds > 300) throw new Error("Webhook too old");

  const computed = createHmac("sha256", secretBytes)
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest("base64");

  const valid = signature.split(" ").some((s) => s.replace(/^v1,/, "") === computed);
  if (!valid) throw new Error("Invalid signature");
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  if (!config.supabaseHookSecret) {
    throw createError({ statusCode: 503, statusMessage: "Hook secret not configured" });
  }

  const rawBody = await readRawBody(event);
  if (!rawBody) throw createError({ statusCode: 400, statusMessage: "Empty body" });

  try {
    verifySignature(rawBody, getHeaders(event), config.supabaseHookSecret);
  } catch (err: any) {
    throw createError({ statusCode: 401, statusMessage: err.message });
  }

  if (!config.resendApiKey) {
    throw createError({ statusCode: 503, statusMessage: "Email not configured" });
  }

  const body = JSON.parse(rawBody) as {
    user: { email: string; user_metadata?: { full_name?: string } };
    email_data: {
      email_action_type: string;
      verification_url: string;
    };
  };

  const { user, email_data } = body;
  const email = user.email;
  const actionType = email_data.email_action_type;
  const url = email_data.verification_url;

  try {
    if (actionType === "signup" || actionType === "email_change_new") {
      await sendEmail(config.resendApiKey, email, templates.confirmSignup({ email, confirmUrl: url }));
    } else if (actionType === "recovery") {
      await sendEmail(config.resendApiKey, email, templates.resetPassword({ email, resetUrl: url }));
    }
  } catch (err) {
    console.error("[email-hook] Send failed:", err);
    throw createError({ statusCode: 500, statusMessage: "Email send failed" });
  }

  return { sent: true };
});
