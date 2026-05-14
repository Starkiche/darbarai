<template>
  <div class="max-w-3xl mx-auto px-4 py-20">
    <h1 class="section-title mb-12">{{ t("legal.title") }}</h1>

    <section class="mb-10">
      <h2 class="text-sm font-semibold uppercase tracking-widest text-terracotta-600 mb-4">
        {{ t("legal.editor_title") }}
      </h2>
      <div class="space-y-1 text-stone-600">
        <p class="font-semibold text-stone-800">{{ t("legal.editor_name") }}</p>
        <p>{{ t("legal.editor_legal_form") }}</p>
        <p>{{ t("legal.editor_rc") }}</p>
        <p>{{ t("legal.editor_ice") }}</p>
        <p>{{ t("legal.editor_capital") }}</p>
        <p>{{ t("legal.editor_address") }}</p>
        <p>
          <a :href="`mailto:${t('legal.editor_email')}`" class="text-terracotta-600 hover:underline">
            {{ t("legal.editor_email") }}
          </a>
        </p>
      </div>
    </section>

    <section class="mb-10">
      <h2 class="text-sm font-semibold uppercase tracking-widest text-terracotta-600 mb-4">
        {{ t("legal.publication_title") }}
      </h2>
      <p class="text-stone-600">{{ t("legal.publication_name") }}</p>
    </section>

    <section class="mb-10">
      <h2 class="text-sm font-semibold uppercase tracking-widest text-terracotta-600 mb-4">
        {{ t("legal.hosting_title") }}
      </h2>
      <div class="space-y-1 text-stone-600">
        <p class="font-semibold text-stone-800">{{ t("legal.hosting_name") }}</p>
        <p>{{ t("legal.hosting_address") }}</p>
        <p>
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" class="text-terracotta-600 hover:underline">
            vercel.com
          </a>
        </p>
      </div>
    </section>

    <section class="mb-10">
      <h2 class="text-sm font-semibold uppercase tracking-widest text-terracotta-600 mb-4">
        {{ t("legal.data_title") }}
      </h2>
      <p class="text-stone-600 leading-relaxed">{{ t("legal.data_text") }}</p>
    </section>

    <section>
      <h2 class="text-sm font-semibold uppercase tracking-widest text-terracotta-600 mb-4">
        {{ t("legal.cookies_title") }}
      </h2>
      <p class="text-stone-600 leading-relaxed">{{ t("legal.cookies_text") }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: t("legal.seo_title"),
});
</script>
