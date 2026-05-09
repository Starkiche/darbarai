<template>
  <NuxtLink
    :to="localePath(`/riads/${riad.slug}`)"
    class="group card overflow-hidden hover:shadow-md transition-shadow"
  >
    <!-- Image -->
    <div class="relative aspect-[4/3] overflow-hidden bg-stone-100">
      <img
        v-if="riad.cover_image"
        :src="riad.cover_image"
        :alt="name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-stone-400"
      >
        <svg
          class="w-16 h-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
      </div>
    </div>

    <!-- Contenu -->
    <div class="p-6">
      <h3 class="font-serif text-2xl text-stone-800 mb-2">{{ name }}</h3>
      <p class="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-4">
        {{ description }}
      </p>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 text-sm text-stone-500">
          <!-- Voyageurs -->
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
            {{ t("riads.guests", riad.max_guests) }}
          </span>
        </div>

        <!-- Prix -->
        <div class="text-right">
          <p class="text-xs text-stone-400">
            {{ t("riads.from_price", { price: "" }) }}
          </p>
          <p class="font-semibold text-terracotta-700 text-lg">
            {{ formatPrice(riad.base_price_per_night)
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
</template>

<script setup lang="ts">
import type { Riad } from "~/types";

const props = defineProps<{ riad: Riad }>();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const { formatPrice } = useRiad();

const name = computed(() =>
  locale.value === "fr"
    ? props.riad.name
    : props.riad.name_en || props.riad.name,
);
const description = computed(() =>
  locale.value === "fr"
    ? props.riad.description
    : props.riad.description_en || props.riad.description,
);
</script>
