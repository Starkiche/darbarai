// Redirige vers /auth/login si non connecté
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) {
    return;
  }

  const user = useSupabaseUser();
  if (!user.value) {
    return navigateTo("/auth/login");
  }
});
