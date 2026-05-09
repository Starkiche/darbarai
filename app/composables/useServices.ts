import type { Service } from "~/types";

export const useServices = () => {
  const supabase = useSupabaseClient();

  const fetchServices = async (activeOnly = true) => {
    let query = (supabase as any)
      .from("services")
      .select("*")
      .order("sort_order")
      .order("name");
    if (activeOnly) {
      query = query.eq("active", true);
    }
    const { data, error } = await query;
    return { data: (data ?? []) as Service[], error };
  };

  const createService = async (payload: Omit<Service, "id" | "created_at">) => {
    const { data, error } = await (supabase as any)
      .from("services")
      .insert([payload])
      .select()
      .single();
    return { data: data as Service | null, error };
  };

  const updateService = async (id: string, payload: Partial<Service>) => {
    const { data, error } = await (supabase as any)
      .from("services")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    return { data: data as Service | null, error };
  };

  const deleteService = async (id: string) => {
    const { error } = await (supabase as any)
      .from("services")
      .delete()
      .eq("id", id);
    return { error };
  };

  return { fetchServices, createService, updateService, deleteService };
};
