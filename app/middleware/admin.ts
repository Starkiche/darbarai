// Redirige vers / si l'utilisateur n'est pas admin
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    return;
  }

  const supabase = useSupabaseClient();

  // getSession() est synchrone avec le cache local — fiable dès le premier rendu client
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return navigateTo("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profile?.role !== "admin") {
    return navigateTo("/");
  }
});
