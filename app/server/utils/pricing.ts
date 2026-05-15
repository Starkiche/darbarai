import type { SupabaseClient } from "@supabase/supabase-js";

export interface PriceBreakdownDay {
  date: string;
  price: number;
  source: "override" | "season" | "base";
  seasonName?: string;
}

export interface PricingResult {
  total: number;
  breakdown: PriceBreakdownDay[];
}

export async function getTotalPrice(
  supabase: SupabaseClient,
  riadId: string,
  checkIn: string,
  checkOut: string,
  basePricePerNight: number,
): Promise<PricingResult> {
  const dates: string[] = [];
  const cur = new Date(checkIn);
  const end = new Date(checkOut);
  while (cur < end) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  if (dates.length === 0) return { total: 0, breakdown: [] };

  const [{ data: overrides }, { data: seasons }] = await Promise.all([
    (supabase as any)
      .from("pricing_overrides")
      .select("date, price_per_night")
      .eq("riad_id", riadId)
      .in("date", dates),
    (supabase as any)
      .from("pricing_seasons")
      .select("start_date, end_date, price_per_night, name")
      .eq("riad_id", riadId)
      .lte("start_date", dates[dates.length - 1])
      .gte("end_date", dates[0])
      .order("created_at", { ascending: false }),
  ]);

  const overrideMap = new Map<string, number>(
    (overrides ?? []).map((o: any) => [o.date, o.price_per_night]),
  );

  const breakdown: PriceBreakdownDay[] = dates.map((date) => {
    if (overrideMap.has(date)) {
      return { date, price: overrideMap.get(date)!, source: "override" };
    }
    const season = (seasons ?? []).find(
      (s: any) => s.start_date <= date && s.end_date >= date,
    );
    if (season) {
      return { date, price: season.price_per_night, source: "season", seasonName: season.name };
    }
    return { date, price: basePricePerNight, source: "base" };
  });

  return { total: breakdown.reduce((s, d) => s + d.price, 0), breakdown };
}
