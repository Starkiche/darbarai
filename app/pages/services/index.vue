<template>
  <div>
    <!-- Hero -->
    <div class="bg-sand-50 py-20 px-4 text-center">
      <h1 class="section-title mb-4">{{ t("services.page_title") }}</h1>
      <p class="text-stone-500 text-lg max-w-2xl mx-auto">
        {{ t("services.page_subtitle") }}
      </p>
    </div>

    <!-- Contenu -->
    <div class="max-w-7xl mx-auto px-4 py-16">
      <template v-if="servicesByCategory.length">
        <div
          v-for="cat in servicesByCategory"
          :key="cat.category"
          class="mb-16"
        >
          <h2
            class="text-sm font-semibold uppercase tracking-widest text-terracotta-600 mb-6"
          >
            {{ t(`services.category_${cat.category}`) }}
          </h2>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="service in cat.items"
              :key="service.id"
              class="card p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center gap-4">
                <span class="text-4xl">{{ service.icon ?? "✨" }}</span>
                <div>
                  <h3 class="font-serif text-xl text-stone-800">
                    {{
                      locale === "fr"
                        ? service.name
                        : service.name_en || service.name
                    }}
                  </h3>
                  <p class="text-sm font-medium text-terracotta-600 mt-0.5">
                    <template
                      v-if="
                        service.price_cents === null ||
                        service.price_cents === 0
                      "
                    >
                      {{ t("services.on_request") }}
                    </template>
                    <template v-else>
                      {{ formatPrice(service.price_cents) }}
                      {{ t("services.per_person") }}
                    </template>
                  </p>
                </div>
              </div>
              <p
                v-if="
                  locale === 'fr' ? service.description : service.description_en
                "
                class="text-stone-500 text-sm leading-relaxed flex-1"
              >
                {{
                  locale === "fr"
                    ? service.description
                    : service.description_en || service.description
                }}
              </p>
              <a
                :href="
                  'mailto:contact@darbarai.com?subject=' +
                  encodeURIComponent(
                    locale === 'fr'
                      ? service.name
                      : service.name_en || service.name,
                  )
                "
                class="btn-secondary text-sm text-center mt-auto"
              >
                {{ t("services.request") }}
              </a>
            </div>
          </div>
        </div>
      </template>

      <!-- État vide -->
      <div v-else class="text-center py-20 text-stone-400">
        <span class="text-5xl mb-4 block">✨</span>
        <p>{{ t("services.empty") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Service, ServiceCategory } from "~/types";

const { t, locale } = useI18n();
const { fetchServices } = useServices();
const { formatPrice } = useRiad();

const { data: services } = await useAsyncData("services-public", async () => {
  const { data } = await fetchServices(true);
  return data;
});

const CATEGORY_ORDER: ServiceCategory[] = [
  "transport",
  "wellness",
  "excursion",
  "food",
  "other",
];

const servicesByCategory = computed(() => {
  const list = services.value ?? [];
  return CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: list.filter((s: Service) => s.category === cat),
  })).filter((g) => g.items.length > 0);
});

useSeoMeta({
  title: t("services.seo_title"),
  description: t("services.page_subtitle"),
});
</script>
