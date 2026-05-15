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

  const body = await readBody(event) as {
    id?: string;
    riad_id: string;
    name: string;
    start_date: string;
    end_date: string;
    price_per_night: number;
  };

  if (body.id) {
    const { data, error } = await (admin as any)
      .from("pricing_seasons")
      .update({ name: body.name, start_date: body.start_date, end_date: body.end_date, price_per_night: body.price_per_night })
      .eq("id", body.id)
      .select()
      .single();
    if (error) throw createError({ statusCode: 500, statusMessage: error.message });
    return data;
  }

  const { data, error } = await (admin as any)
    .from("pricing_seasons")
    .insert({ riad_id: body.riad_id, name: body.name, start_date: body.start_date, end_date: body.end_date, price_per_night: body.price_per_night })
    .select()
    .single();
  if (error) throw createError({ statusCode: 500, statusMessage: error.message });
  return data;
});
