<template>
  <div>
    <h1 class="font-serif text-2xl text-center mb-2">
      {{ t("auth.reset_password_title") }}
    </h1>
    <p class="text-stone-500 text-sm text-center mb-6">
      {{ t("auth.reset_password_hint") }}
    </p>

    <div v-if="invalidLink" class="text-center py-4">
      <p class="text-red-600 text-sm mb-4">
        {{ t("auth.invalid_reset_link") }}
      </p>
      <NuxtLink :to="localePath('/auth/forgot-password')" class="btn-secondary">
        {{ t("auth.send_reset_link") }}
      </NuxtLink>
    </div>

    <form v-else-if="!success" @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-stone-700 mb-1">
          {{ t("auth.new_password") }}
        </label>
        <input
          v-model="password"
          type="password"
          required
          minlength="8"
          class="input-field"
          autocomplete="new-password"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-stone-700 mb-1">
          {{ t("auth.confirm_password") }}
        </label>
        <input
          v-model="confirmPassword"
          type="password"
          required
          class="input-field"
          autocomplete="new-password"
        />
      </div>
      <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? t("common.loading") : t("auth.update_password") }}
      </button>
    </form>

    <div v-else class="text-center py-4">
      <p class="text-green-700 text-sm">{{ t("auth.password_updated") }}</p>
    </div>

    <div class="mt-4 text-center">
      <NuxtLink
        :to="localePath('/auth/login')"
        class="text-sm text-stone-400 hover:text-stone-600"
      >
        {{ t("auth.back_to_login") }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "auth" });

const { t } = useI18n();
const localePath = useLocalePath();
const supabase = useSupabaseClient();

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const success = ref(false);
const error = ref<string | null>(null);
const invalidLink = ref(false);

// Supabase envoie le token via le fragment d'URL (#access_token=...)
// Le module @nuxtjs/supabase échange automatiquement la session côté client
// On vérifie qu'une session est bien présente après l'échange
onMounted(async () => {
  // Laisser le temps au module supabase de traiter le fragment URL
  await nextTick();
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    invalidLink.value = true;
  }
});

const onSubmit = async () => {
  error.value = null;
  if (password.value !== confirmPassword.value) {
    error.value = t("auth.passwords_mismatch");
    return;
  }
  loading.value = true;
  const { error: err } = await supabase.auth.updateUser({
    password: password.value,
  });
  loading.value = false;
  if (err) {
    error.value = err.message;
  } else {
    success.value = true;
    setTimeout(() => navigateTo("/account"), 2000);
  }
};
</script>
