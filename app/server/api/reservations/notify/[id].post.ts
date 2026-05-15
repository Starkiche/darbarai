import { serverSupabaseClient, serverSupabaseServiceRole } from "#supabase/server";
import { templates, sendEmail, sendToAdmins } from "~/server/utils/emailTemplates";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const id = getRouterParam(event, "id");

  const authHeader = getHeader(event, "authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  if (!token) throw createError({ statusCode: 401 });

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user?.id) throw createError({ statusCode: 401 });

  const admin = serverSupabaseServiceRole(event);

  const { data: reservation } = await (admin as any)
    .from("reservations")
    .select("*, riad:riads(name), profile:profiles(full_name, email)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!reservation) throw createError({ statusCode: 404 });

  const config = useRuntimeConfig();
  if (!config.resendApiKey) return { ok: true };

  const riad = reservation.riad as { name: string };
  const profile = reservation.profile as { full_name: string; email: string | null };

  // Fallback : récupère l'email depuis auth si profiles.email est null
  let clientEmail = profile.email;
  if (!clientEmail) {
    const { data: authData } = await (admin as any).auth.admin.getUserById(user.id);
    clientEmail = authData?.user?.email ?? null;
  }
  if (!clientEmail) return { ok: true };

  const nights = Math.round(
    (new Date(reservation.check_out).getTime() - new Date(reservation.check_in).getTime()) / 86400000
  );
  const emailData = {
    clientName: profile.full_name ?? "",
    clientEmail,
    riadName: riad.name,
    checkIn: reservation.check_in,
    checkOut: reservation.check_out,
    nights,
    guests: reservation.guests,
    totalEur: (reservation.total_price / 100).toFixed(2),
    reservationId: reservation.id,
  };

  await Promise.allSettled([
    sendEmail(config.resendApiKey, clientEmail, templates.reservationRequest(emailData)),
    sendToAdmins(admin, config.resendApiKey, templates.adminNewReservation(emailData, "later")),
  ]);

  return { ok: true };
});
