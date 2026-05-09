import Stripe from "stripe";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  // 1. Auth
  const user = await serverSupabaseUser(event);
  if (!user)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const supabase = await serverSupabaseClient(event);

  // 2. Body validation
  const body = await readBody(event);
  const { riad_id, check_in, check_out, guests, special_requests } = body as {
    riad_id: string;
    check_in: string;
    check_out: string;
    guests: number;
    special_requests?: string;
  };

  if (!riad_id || !check_in || !check_out || !guests) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  // 3. Fetch riad
  const { data: riad, error: riadError } = await supabase
    .from("riads")
    .select("id, name, base_price_per_night")
    .eq("id", riad_id)
    .single();

  if (riadError || !riad)
    throw createError({ statusCode: 404, statusMessage: "Riad not found" });

  // 4. Check availability
  const { data: blocks } = await supabase
    .from("availability")
    .select("start_date, end_date")
    .eq("riad_id", riad_id)
    .lte("start_date", check_out)
    .gte("end_date", check_in);

  if (blocks && blocks.length > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: "Dates not available",
    });
  }

  // 5. Calculate total (centimes)
  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);
  const nights = Math.round(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (nights < 1)
    throw createError({ statusCode: 400, statusMessage: "Invalid dates" });
  const total_price = riad.base_price_per_night * nights;

  // 6. Create reservation in DB (status: pending)
  const { data: reservation, error: resError } = await supabase
    .from("reservations")
    .insert({
      riad_id,
      user_id: user.id,
      check_in,
      check_out,
      guests,
      total_price,
      status: "pending",
      special_requests: special_requests ?? null,
    })
    .select()
    .single();

  if (resError || !reservation) {
    throw createError({
      statusCode: 500,
      statusMessage: resError?.message ?? "Failed to create reservation",
    });
  }

  // 7. Create Stripe Checkout Session
  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: "2025-04-30.basil",
  });

  const siteUrl = config.public.siteUrl || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: total_price,
          product_data: {
            name: `${riad.name} — ${nights} nuit${nights > 1 ? "s" : ""}`,
            description: `Arrivée ${check_in} · Départ ${check_out}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      reservation_id: reservation.id,
      user_id: user.id,
    },
    success_url: `${siteUrl}/account?payment=success&reservation=${reservation.id}`,
    cancel_url: `${siteUrl}/riads/${riad_id}?payment=cancelled`,
    customer_email: user.email,
  });

  // 8. Store stripe session id on reservation
  await supabase
    .from("reservations")
    .update({
      stripe_payment_intent_id:
        (session.payment_intent as string) ?? session.id,
    })
    .eq("id", reservation.id);

  return { url: session.url, reservation_id: reservation.id };
});
