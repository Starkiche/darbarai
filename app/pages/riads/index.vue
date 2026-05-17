<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 pt-16 pb-12">
      <h1 class="section-title text-center mb-4">{{ t("riads.page_title") }}</h1>
      <p class="text-center text-stone-500">{{ t("riads.page_subtitle") }}</p>
    </div>

    <!-- Gouvernante pleine largeur -->
    <div class="bg-sand-50 px-4 py-12 text-center mb-12">
      <div class="max-w-2xl mx-auto">
        <h2 class="font-serif text-2xl text-stone-800 mb-3">{{ t("riads.gouvernante_title") }}</h2>
        <p class="text-stone-500 leading-relaxed mb-6">{{ t("riads.gouvernante_text") }}</p>
        <NuxtLink :to="localePath('/contact')" class="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2">
          {{ t("riads.gouvernante_menu_cta") }} →
        </NuxtLink>
      </div>
    </div>

    <div class="flex flex-col gap-10 max-w-2xl mx-auto px-4 pb-16">
      <RiadCard v-for="riad in riads" :key="riad.id" :riad="riad" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const { riads, fetchRiads } = useRiad();
await useAsyncData("riads-list", () => fetchRiads());

useSeoMeta({ title: t("seo.riads_title") });
</script>
