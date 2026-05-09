import Stripe from "stripe";
import { serverSupabaseServiceRole } from "#supabase/server";
import { Resend } from "resend";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: "2025-04-30.basil",
  });

  // Read raw body for signature verification
  const rawBody = await readRawBody(event);
  const sig = getHeader(event, "stripe-signature");

  if (!rawBody || !sig) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing body or signature",
    });
  }

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      config.stripeWebhookSecret,
    );
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: `Webhook signature invalid: ${(err as Error).message}`,
    });
  }

  // Only handle checkout.session.completed
  if (stripeEvent.type !== "checkout.session.completed") {
    return { received: true };
  }

  const session = stripeEvent.data.object as Stripe.CheckoutSession;
  const reservationId = session.metadata?.reservation_id;
  if (!reservationId) return { received: true };

  const supabase = serverSupabaseServiceRole(event);

  // Update reservation status to confirmed
  const { data: reservation, error } = await supabase
    .from("reservations")
    .update({ status: "confirmed" })
    .eq("id", reservationId)
    .select("*, riad:riads(name, slug), profile:profiles(email, full_name)")
    .single();

  if (error || !reservation) {
    console.error("[webhook] Failed to confirm reservation", error);
    throw createError({ statusCode: 500, statusMessage: "DB update failed" });
  }

  // Send confirmation email via Resend
  try {
    const resend = new Resend(config.resendApiKey);
    const { email, full_name } = reservation.profile as {
      email: string;
      full_name: string | null;
    };
    const riad = reservation.riad as { name: string; slug: string };
    const nights = Math.round(
      (new Date(reservation.check_out).getTime() -
        new Date(reservation.check_in).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const totalEur = (reservation.total_price / 100).toFixed(2);

    await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME || "Dar Baraï"} <${process.env.RESEND_FROM_EMAIL || "reservations@darbarai.com"}>`,
      to: email,
      subject: `Votre réservation est confirmée – ${riad.name}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:auto;color:#1c1917">
          <h1 style="color:#b45309">Réservation confirmée ✓</h1>
          <p>Bonjour ${full_name ?? ""},</p>
          <p>Votre réservation au <strong>${riad.name}</strong> est bien confirmée.</p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0">
            <tr><td style="padding:8px 0;border-bottom:1px solid #e7e5e4"><strong>Arrivée</strong></td><td style="padding:8px 0;border-bottom:1px solid #e7e5e4">${reservation.check_in}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #e7e5e4"><strong>Départ</strong></td><td style="padding:8px 0;border-bottom:1px solid #e7e5e4">${reservation.check_out}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #e7e5e4"><strong>Durée</strong></td><td style="padding:8px 0;border-bottom:1px solid #e7e5e4">${nights} nuit${nights > 1 ? "s" : ""}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #e7e5e4"><strong>Voyageurs</strong></td><td style="padding:8px 0;border-bottom:1px solid #e7e5e4">${reservation.guests}</td></tr>
            <tr><td style="padding:8px 0"><strong>Total</strong></td><td style="padding:8px 0">${totalEur} €</td></tr>
          </table>
          <p>Nous avons hâte de vous accueillir à Marrakech.</p>
          <p style="color:#78716c;font-size:14px">Dar Baraï · Marrakech, Maroc · reservations@darbarai.com</p>
        </div>
      `,
    });
  } catch (emailErr) {
    // Non-blocking: log but don't fail webhook
    console.error("[webhook] Email send failed", emailErr);
  }

  return { received: true };
});
