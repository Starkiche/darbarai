// Redirige vers /auth/login si non connecté
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    return;
  }

  const supabase = useSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return navigateTo("/auth/login");
  }
});
