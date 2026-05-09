<template>
  <div class="text-center">
    <NuxtLink to="/" class="inline-block mb-8">
      <img
        src="/images/logo.svg"
        alt="Dar Baraï"
        class="h-12 mx-auto"
        onerror="this.style.display = 'none'"
      />
      <span class="text-2xl font-playfair text-terracotta-700">Dar Baraï</span>
    </NuxtLink>

    <div class="card max-w-md mx-auto">
      <h1 class="section-title mb-2">{{ t("auth.forgot_password") }}</h1>
      <p class="text-stone-500 text-sm mb-6">
        {{ t("auth.forgot_password_hint") }}
      </p>

      <form v-if="!sent" @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-stone-700 mb-1">{{
            t("auth.email")
          }}</label>
          <input v-model="email" type="email" class="input-field" required />
        </div>
        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? t("common.loading") : t("auth.send_reset_link") }}
        </button>
      </form>

      <div v-else class="py-4">
        <div class="text-green-700 text-sm mb-4">
          {{ t("auth.reset_email_sent") }}
        </div>
        <NuxtLink
          :to="localePath('/auth/login')"
          class="btn-secondary w-full text-center block"
        >
          {{ t("auth.back_to_login") }}
        </NuxtLink>
      </div>

      <div class="mt-4 text-center">
        <NuxtLink
          :to="localePath('/auth/login')"
          class="text-sm text-terracotta-600 hover:underline"
        >
          {{ t("auth.back_to_login") }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "auth" });
const { t } = useI18n();
const localePath = useLocalePath();
const supabase = useSupabaseClient();

const email = ref("");
const loading = ref(false);
const sent = ref(false);
const error = ref<string | null>(null);

const onSubmit = async () => {
  loading.value = true;
  error.value = null;
  const { error: err } = await supabase.auth.resetPasswordForEmail(
    email.value,
    {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  );
  loading.value = false;
  if (err) {
    error.value = err.message;
  } else {
    sent.value = true;
  }
};

useSeoMeta({ title: t("auth.forgot_password") });
</script>
