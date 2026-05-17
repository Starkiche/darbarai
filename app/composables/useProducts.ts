import type { Product } from "~/types";

export const useProducts = () => {
  const supabase = useSupabaseClient();

  const fetchProducts = async (activeOnly = true) => {
    let query = (supabase as any)
      .from("products")
      .select("*")
      .order("sort_order")
      .order("name");
    if (activeOnly) {
      query = query.eq("active", true);
    }
    const { data, error } = await query;
    return { data: (data ?? []) as Product[], error };
  };

  const createProduct = async (payload: Omit<Product, "id" | "created_at">) => {
    const { data, error } = await (supabase as any)
      .from("products")
      .insert([payload])
      .select()
      .single();
    return { data: data as Product | null, error };
  };

  const updateProduct = async (id: string, payload: Partial<Product>) => {
    const { data, error } = await (supabase as any)
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    return { data: data as Product | null, error };
  };

  const deleteProduct = async (id: string) => {
    const { error } = await (supabase as any)
      .from("products")
      .delete()
      .eq("id", id);
    return { error };
  };

  const formatProductPrice = (cents: number | null) => {
    if (!cents) return null;
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  return { fetchProducts, createProduct, updateProduct, deleteProduct, formatProductPrice };
};
