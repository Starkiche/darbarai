import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const admin = serverSupabaseServiceRole(event);
  const { code, total } = await readBody(event) as { code: string; total: number };

  if (!code) throw createError({ statusCode: 400, statusMessage: "Missing code" });

  const { data: promo, error } = await (admin as any)
    .from("promo_codes")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .eq("active", true)
    .single();

  if (error || !promo) throw createError({ statusCode: 404, statusMessage: "Code invalide" });

  const today = new Date().toISOString().slice(0, 10);
  if (promo.valid_from && promo.valid_from > today) throw createError({ statusCode: 400, statusMessage: "Code pas encore actif" });
  if (promo.valid_until && promo.valid_until < today) throw createError({ statusCode: 400, statusMessage: "Code expiré" });
  if (promo.max_uses !== null && promo.uses_count >= promo.max_uses) throw createError({ statusCode: 400, statusMessage: "Code épuisé" });

  const discount = promo.type === "percentage"
    ? Math.round(total * promo.value / 100)
    : Math.min(promo.value, total);

  return {
    id: promo.id,
    code: promo.code,
    type: promo.type,
    value: promo.value,
    discount,
    finalTotal: total - discount,
  };
});
