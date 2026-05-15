import { serverSupabaseClient } from "#supabase/server";
import { getTotalPrice } from "~/server/utils/pricing";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const q = getQuery(event) as { riad_id: string; check_in: string; check_out: string };

  if (!q.riad_id || !q.check_in || !q.check_out) {
    throw createError({ statusCode: 400, statusMessage: "Missing parameters" });
  }

  const { data: riad } = await (supabase as any)
    .from("riads")
    .select("base_price_per_night")
    .eq("id", q.riad_id)
    .single();

  if (!riad) throw createError({ statusCode: 404, statusMessage: "Riad not found" });

  return getTotalPrice(supabase, q.riad_id, q.check_in, q.check_out, riad.base_price_per_night);
});
