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

  const id = getRouterParam(event, "id");
  const { error } = await (admin as any).from("pricing_overrides").delete().eq("id", id);
  if (error) throw createError({ statusCode: 500, statusMessage: error.message });
  return { ok: true };
});
