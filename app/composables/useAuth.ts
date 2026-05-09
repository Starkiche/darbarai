import type { Profile } from "~/types";

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const profile = useState<Profile | null>("auth:profile", () => null);

  const fetchProfile = async (userId?: string) => {
    const id = userId ?? user.value?.id;
    if (!id) {
      profile.value = null;
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    profile.value = data;
  };

  const isAdmin = computed(() => profile.value?.role === "admin");

  if (import.meta.client) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        profile.value = null;
      }
    });
  }

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

  const signInWithEmail = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUpWithEmail = (email: string, password: string, fullName: string) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

  const signOut = async () => {
    await supabase.auth.signOut();
    profile.value = null;
    await navigateTo("/");
  };

  const resetPassword = (email: string) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

  return {
    user,
    profile,
    isAdmin,
    fetchProfile,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
  };
};
