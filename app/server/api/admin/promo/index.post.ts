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
    code: string;
    type: "percentage" | "fixed";
    value: number;
    valid_from?: string | null;
    valid_until?: string | null;
    max_uses?: number | null;
  };

  if (!body.code || !body.type || body.value === undefined) {
    throw createError({ statusCode: 400, statusMessage: "Missing required fields" });
  }

  const { data, error } = await (admin as any)
    .from("promo_codes")
    .insert({
      code: body.code.trim().toUpperCase(),
      type: body.type,
      value: body.value,
      valid_from: body.valid_from || null,
      valid_until: body.valid_until || null,
      max_uses: body.max_uses || null,
      active: true,
      uses_count: 0,
    })
    .select()
    .single();

  if (error) throw createError({ statusCode: 500, statusMessage: error.message });
  return data;
});
