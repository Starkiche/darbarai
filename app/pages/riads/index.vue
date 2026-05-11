<template>
  <div class="max-w-7xl mx-auto px-4 py-16">
    <h1 class="section-title text-center mb-4">{{ t("riads.page_title") }}</h1>
    <p class="text-center text-stone-500 mb-12">
      {{ t("riads.page_subtitle") }}
    </p>

    <!-- 2 riads individuels -->
    <div class="grid md:grid-cols-2 gap-10 mb-10">
      <RiadCard v-for="riad in riads" :key="riad.id" :riad="riad" />
    </div>

    <!-- Card combinée -->
    <NuxtLink
      :to="localePath('/riads/les-deux-riads')"
      class="group card overflow-hidden hover:shadow-md transition-shadow block"
    >
      <!-- Double image -->
      <div class="relative h-56 md:h-64 overflow-hidden flex">
        <div class="w-1/2 overflow-hidden">
          <img
            v-if="riads[0]?.cover_image"
            :src="riads[0].cover_image"
            :alt="riads[0].name"
            0
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div class="w-1/2 overflow-hidden">
          <img
            v-if="riads[1]?.cover_image"
            :src="riads[1].cover_image"
            :alt="riads[1].name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <!-- Badge -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5"
        >
          <div class="flex items-center gap-3">
            <img
              src="/images/logo_dar_barai.jpg"
              alt="Dar Baraï"
              class="h-10 w-auto rounded-lg shadow"
            />
            <span class="text-white/60 font-light text-2xl">+</span>
            <img
              src="/images/logo_dar_tanawi.jpg"
              alt="Dar Tanawi"
              class="h-10 w-auto rounded-lg shadow"
            />
          </div>
        </div>
      </div>

      <!-- Contenu -->
      <div class="p-6">
        <h3 class="font-serif text-2xl text-stone-800 mb-2">
          {{ t("riads.combined_title") }}
        </h3>
        <p class="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-4">
          {{ t("riads.combined_description") }}
        </p>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 text-sm text-stone-500">
            <span class="flex items-center gap-1">
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {{
                t("riads.up_to_guests", {
                  n: (riads[0]?.max_guests ?? 0) + (riads[1]?.max_guests ?? 0),
                })
              }}
            </span>
          </div>
          <div class="text-right">
            <p class="text-xs text-stone-400">
              {{ t("riads.from_price", { price: "" }) }}
            </p>
            <p class="font-semibold text-terracotta-700 text-lg">
              {{
                formatPrice(
                  (riads[0]?.base_price_per_night ?? 0) +
                    (riads[1]?.base_price_per_night ?? 0),
                )
              }}<span class="text-sm font-normal text-stone-400">{{
                t("common.per_night")
              }}</span>
            </p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-stone-100">
          <span
            class="text-terracotta-600 text-sm font-medium group-hover:underline"
          >
            {{ t("riads.view_details") }} →
          </span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useI18n, useRiad, useLocalePath } from "#imports";

const { t } = useI18n();
const localePath = useLocalePath();
const { riads, fetchRiads, formatPrice } = useRiad();
await useAsyncData("riads-list", () => fetchRiads());

useSeoMeta({ title: t("seo.riads_title") });
</script>
