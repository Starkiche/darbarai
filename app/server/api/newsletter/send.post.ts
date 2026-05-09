import { Resend } from "resend";
import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
  // Admin only
  const user = await serverSupabaseUser(event);
  if (!user)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const supabase = serverSupabaseServiceRole(event);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const body = await readBody(event);
  const { subject, subject_en, content_html, content_html_en } = body as {
    subject: string;
    subject_en?: string;
    content_html: string;
    content_html_en?: string;
  };

  if (!subject || !content_html)
    throw createError({
      statusCode: 400,
      statusMessage: "Missing subject or content",
    });

  // Fetch subscribers
  const { data: subscribers, error: subError } = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("newsletter_subscribed", true);

  if (subError)
    throw createError({ statusCode: 500, statusMessage: subError.message });
  if (!subscribers || subscribers.length === 0) return { sent: 0 };

  const config = useRuntimeConfig();
  const resend = new Resend(config.resendApiKey);
  const fromAddress = `${process.env.RESEND_FROM_NAME || "Dar Baraï"} <${process.env.RESEND_FROM_EMAIL || "reservations@darbarai.com"}>`;

  const siteUrl = config.public.siteUrl || "https://www.darbarai.com";

  // Send in batches of 50 (Resend free plan limit)
  const BATCH = 50;
  let sentCount = 0;
  for (let i = 0; i < subscribers.length; i += BATCH) {
    const batch = subscribers.slice(i, i + BATCH);
    await Promise.all(
      batch.map((sub) =>
        resend.emails.send({
          from: fromAddress,
          to: sub.email,
          subject,
          html: `
            ${content_html}
            <hr style="margin:40px 0;border:none;border-top:1px solid #e7e5e4"/>
            <p style="font-size:12px;color:#a8a29e;text-align:center">
              Vous recevez cet email car vous êtes abonné à la newsletter Dar Baraï.<br/>
              <a href="${siteUrl}/account" style="color:#a8a29e">Se désabonner</a>
            </p>
          `,
        }),
      ),
    );
    sentCount += batch.length;
  }

  // Log to newsletters_sent
  await supabase.from("newsletters_sent").insert({
    subject,
    subject_en: subject_en ?? null,
    content_html,
    content_html_en: content_html_en ?? null,
    recipients_count: sentCount,
    sent_by: user.id,
  });

  return { sent: sentCount };
});
