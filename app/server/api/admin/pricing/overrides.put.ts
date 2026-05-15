import { serverSupabaseClient, serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const authHeader = getHeader(event, "authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  if (!token) throw createError({ statusCode: 401 });
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user?.id) throw createError({ statusCode: 401 });

  const admin = serverSupabaseServiceRole(event);
  const { data: profile } = await (admin as any).from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw createError({ statusCode: 403 });

  const body = await readBody(event) as { riad_id: string; date: string; price_per_night: number; note?: string };

  const { data, error } = await (admin as any)
    .from("pricing_overrides")
    .upsert({ riad_id: body.riad_id, date: body.date, price_per_night: body.price_per_night, note: body.note ?? null }, { onConflict: "riad_id,date" })
    .select()
    .single();
  if (error) throw createError({ statusCode: 500, statusMessage: error.message });
  return data;
});
