<template>
  <div v-if="riad1 && riad2">
    <!-- ===== HERO ===== -->
    <div class="relative h-[70vh] min-h-[500px] overflow-hidden flex">
      <div class="w-1/2 overflow-hidden">
        <img
          :src="riad1.cover_image"
          :alt="name1"
          class="w-full h-full object-cover scale-105"
        />
      </div>
      <div class="w-1/2 overflow-hidden">
        <img
          :src="riad2.cover_image"
          :alt="name2"
          class="w-full h-full object-cover scale-105"
        />
      </div>
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
      />
      <div class="absolute bottom-10 left-6 md:left-12 text-white max-w-3xl">
        <div class="flex items-center gap-4 mb-3">
          <img
            src="/images/logo_dar_barai.jpg"
            :alt="name1"
            class="h-16 md:h-20 w-auto rounded-lg shadow-lg flex-shrink-0"
          />
          <span class="text-white/50 font-light text-4xl">+</span>
          <img
            src="/images/logo_dar_tanawi.jpg"
            :alt="name2"
            class="h-16 md:h-20 w-auto rounded-lg shadow-lg flex-shrink-0"
          />
          <h1 class="font-serif text-3xl md:text-5xl">
            {{ t("riads.combined_title") }}
          </h1>
        </div>
        <div class="flex flex-wrap gap-4 text-white/90 text-sm md:text-base">
          <span class="flex items-center gap-1.5">
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
            {{ t("riads.up_to_guests", { n: totalGuests }) }}
          </span>
          <span v-if="totalArea" class="flex items-center gap-1.5">
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
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            {{ totalArea }} m²
          </span>
          <span class="font-semibold">
            {{ formatPrice(totalPrice) }} {{ t("common.per_night") }}
          </span>
        </div>
      </div>
    </div>

    <!-- ===== CONTENU ===== -->
    <div class="max-w-7xl mx-auto px-4 py-14 grid lg:grid-cols-3 gap-14">
      <!-- COLONNE PRINCIPALE -->
      <div class="lg:col-span-2 space-y-14">
        <!-- Descriptions côte à côte -->
        <section class="grid md:grid-cols-2 gap-8">
          <div>
            <h3
              class="font-serif text-xl text-stone-800 mb-3 flex items-center gap-2"
            >
              <img
                src="/images/logo_dar_barai.jpg"
                class="h-8 w-auto rounded"
                :alt="name1"
              />
              {{ name1 }}
            </h3>
            <p class="text-stone-600 leading-relaxed">{{ desc1 }}</p>
          </div>
          <div>
            <h3
              class="font-serif text-xl text-stone-800 mb-3 flex items-center gap-2"
            >
              <img
                src="/images/logo_dar_tanawi.jpg"
                class="h-8 w-auto rounded"
                :alt="name2"
              />
              {{ name2 }}
            </h3>
            <p class="text-stone-600 leading-relaxed">{{ desc2 }}</p>
          </div>
        </section>

        <!-- Couchage combiné -->
        <section v-if="combinedSleeping.length">
          <h2 class="section-title mb-6">{{ t("riads.sleeping_title") }}</h2>
          <div class="grid sm:grid-cols-2 gap-4">
            <div
              v-for="(room, i) in combinedSleeping"
              :key="i"
              class="rounded-xl bg-sand-50 border border-sand-100 p-4 flex items-start gap-3"
            >
              <svg
                class="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5"
                viewBox="0 0 24 24"
              >
                <path fill="currentColor" :d="mdiBedKingOutline" />
              </svg>
              <div>
                <div class="font-medium text-stone-800 flex items-center gap-2">
                  <img
                    :src="room._logo"
                    class="h-5 w-auto rounded opacity-80"
                    :alt="room._riad"
                  />
                  {{
                    locale === "fr" ? room.label : room.label_en || room.label
                  }}
                </div>
                <div class="text-sm text-stone-500">
                  {{ locale === "fr" ? room.beds : room.beds_en || room.beds }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Équipements combinés -->
        <section v-if="combinedAmenities.length">
          <h2 class="section-title mb-6">{{ t("riads.amenities_title") }}</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              v-for="amenity in combinedAmenities"
              :key="amenity"
              class="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-100"
            >
              <span class="text-xl">{{ amenityEmoji(amenity) }}</span>
              <span class="text-sm font-medium text-stone-700 capitalize">
                {{ t(`riads.amenity_${amenity.replace(/-/g, "_")}`, amenity) }}
              </span>
            </div>
          </div>
        </section>

        <!-- Services combinés -->
        <section v-if="combinedServices.length">
          <h2 class="section-title mb-6">{{ t("riads.services_title") }}</h2>
          <div
            class="divide-y divide-stone-100 border border-stone-100 rounded-xl overflow-hidden"
          >
            <div
              v-for="(service, i) in combinedServices"
              :key="i"
              class="flex items-center justify-between px-5 py-4 bg-white hover:bg-stone-50 transition-colors"
            >
              <div>
                <div class="font-medium text-stone-800 flex items-center gap-2">
                  <img
                    :src="service._logo"
                    class="h-5 w-auto rounded opacity-70"
                    :alt="service._riad"
                  />
                  {{
                    locale === "fr"
                      ? service.name
                      : service.name_en || service.name
                  }}
                </div>
                <div class="text-sm text-stone-500">
                  {{
                    locale === "fr"
                      ? service.description
                      : service.description_en || service.description
                  }}
                </div>
              </div>
              <div
                class="text-sm font-semibold text-terracotta-600 shrink-0 ml-4"
              >
                {{
                  service.price_cents === 0
                    ? t("riads.service_included")
                    : formatPrice(service.price_cents)
                }}
              </div>
            </div>
          </div>
        </section>

        <!-- Galeries côte à côte -->
        <section v-if="riad1.gallery?.length || riad2.gallery?.length">
          <h2 class="section-title mb-8">{{ t("riads.gallery_title") }}</h2>

          <!-- Galerie riad 1 -->
          <div v-if="riad1.gallery?.length" class="mb-10">
            <h3
              class="text-base font-semibold text-terracotta-600 uppercase tracking-wider mb-4 flex items-center gap-2"
            >
              <img
                src="/images/logo_dar_barai.jpg"
                class="h-6 w-auto rounded"
                :alt="name1"
              />
              {{ name1 }}
            </h3>
            <div
              v-for="(group, gi) in riad1.gallery"
              :key="`r1-${gi}`"
              class="mb-8"
            >
              <h4
                class="text-sm font-medium text-stone-400 uppercase tracking-wide mb-3"
              >
                {{
                  locale === "fr" ? group.label : group.label_en || group.label
                }}
              </h4>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <img
                  v-for="(photo, pi) in group.photos"
                  :key="pi"
                  :src="photo"
                  :alt="`${group.label} ${pi + 1}`"
                  class="rounded-xl aspect-square object-cover w-full hover:opacity-90 transition-opacity cursor-pointer"
                  @click="openLightbox(group.photos, pi)"
                />
              </div>
            </div>
          </div>

          <!-- Galerie riad 2 -->
          <div v-if="riad2.gallery?.length">
            <h3
              class="text-base font-semibold text-olive-600 uppercase tracking-wider mb-4 flex items-center gap-2"
            >
              <img
                src="/images/logo_dar_tanawi.jpg"
                class="h-6 w-auto rounded"
                :alt="name2"
              />
              {{ name2 }}
            </h3>
            <div
              v-for="(group, gi) in riad2.gallery"
              :key="`r2-${gi}`"
              class="mb-8"
            >
              <h4
                class="text-sm font-medium text-stone-400 uppercase tracking-wide mb-3"
              >
                {{
                  locale === "fr" ? group.label : group.label_en || group.label
                }}
              </h4>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <img
                  v-for="(photo, pi) in group.photos"
                  :key="pi"
                  :src="photo"
                  :alt="`${group.label} ${pi + 1}`"
                  class="rounded-xl aspect-square object-cover w-full hover:opacity-90 transition-opacity cursor-pointer"
                  @click="openLightbox(group.photos, pi)"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Localisation -->
        <section v-if="riad1.location">
          <h2 class="section-title mb-6">{{ t("riads.location_title") }}</h2>
          <div
            class="flex items-start gap-3 p-5 rounded-xl bg-stone-50 border border-stone-100"
          >
            <svg
              class="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <div class="font-medium text-stone-800">
                {{ riad1.location.address }}
              </div>
              <div
                v-if="riad1.location.neighborhood"
                class="text-sm text-stone-500 mt-0.5"
              >
                {{ riad1.location.neighborhood }}
              </div>
              <a
                v-if="riad1.location.google_maps_url"
                :href="riad1.location.google_maps_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-terracotta-600 hover:underline mt-2 inline-block"
                >{{ t("riads.view_on_map") }} →</a
              >
            </div>
          </div>
        </section>

        <!-- Règles + horaires -->
        <section class="grid sm:grid-cols-2 gap-6">
          <div
            v-if="combinedRules.length"
            class="p-5 rounded-xl bg-stone-50 border border-stone-100"
          >
            <h3 class="font-semibold text-stone-800 mb-3">
              {{ t("riads.house_rules_title") }}
            </h3>
            <ul class="space-y-1.5">
              <li
                v-for="(rule, i) in combinedRules"
                :key="i"
                class="text-sm text-stone-600 flex items-start gap-2"
              >
                <span class="text-stone-300 mt-0.5">—</span> {{ rule }}
              </li>
            </ul>
          </div>
          <div
            class="p-5 rounded-xl bg-stone-50 border border-stone-100 space-y-4"
          >
            <div>
              <h3 class="font-semibold text-stone-800 mb-2">
                {{ t("riads.checkin_title") }}
              </h3>
              <p class="text-sm text-stone-600">
                {{ t("riads.checkin_from", { time: riad1.checkin_time }) }}
              </p>
              <p class="text-sm text-stone-600">
                {{ t("riads.checkout_before", { time: riad1.checkout_time }) }}
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- COLONNE DROITE : résumé + contact -->
      <div class="lg:col-span-1">
        <div class="sticky top-24 space-y-6">
          <!-- Résumé prix -->
          <div class="card p-6">
            <h3 class="font-serif text-xl text-stone-800 mb-4">
              {{ t("riads.combined_booking_title") }}
            </h3>
            <div
              class="space-y-3 text-sm text-stone-600 border-t border-stone-100 pt-4"
            >
              <div class="flex justify-between">
                <span>{{ name1 }}</span>
                <span class="font-medium"
                  >{{ formatPrice(riad1.base_price_per_night) }} /
                  {{ t("common.night") }}</span
                >
              </div>
              <div class="flex justify-between">
                <span>{{ name2 }}</span>
                <span class="font-medium"
                  >{{ formatPrice(riad2.base_price_per_night) }} /
                  {{ t("common.night") }}</span
                >
              </div>
              <div
                class="flex justify-between border-t border-stone-100 pt-3 text-base font-semibold text-stone-800"
              >
                <span>{{ t("common.total") }}</span>
                <span class="text-terracotta-700"
                  >{{ formatPrice(totalPrice) }} / {{ t("common.night") }}</span
                >
              </div>
            </div>
            <div class="mt-4 p-3 rounded-lg bg-sand-50 text-xs text-stone-500">
              {{ t("riads.combined_booking_note") }}
            </div>
            <!-- Liens vers chaque riad -->
            <div class="mt-5 space-y-2">
              <NuxtLink
                :to="localePath('/riads/dar-barai#booking')"
                class="btn-primary w-full text-center block"
              >
                {{ t("riads.book_riad", { name: name1 }) }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/riads/dar-tanawi#booking')"
                class="btn-secondary w-full text-center block"
              >
                {{ t("riads.book_riad", { name: name2 }) }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- LIGHTBOX -->
    <Teleport to="body">
      <div
        v-if="lightbox.open"
        class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        @click.self="lightbox.open = false"
      >
        <button
          class="absolute top-4 right-4 text-white/80 hover:text-white"
          @click="lightbox.open = false"
        >
          <svg
            class="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          v-if="lightbox.index > 0"
          class="absolute left-4 text-white/80 hover:text-white"
          @click="lightbox.index--"
        >
          <svg
            class="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <img
          :src="lightbox.photos[lightbox.index]"
          class="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
          :alt="`Photo ${lightbox.index + 1}`"
        />
        <button
          v-if="lightbox.index < lightbox.photos.length - 1"
          class="absolute right-4 text-white/80 hover:text-white"
          @click="lightbox.index++"
        >
          <svg
            class="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <div class="absolute bottom-4 text-white/60 text-sm">
          {{ lightbox.index + 1 }} / {{ lightbox.photos.length }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Riad, RiadSleepingArrangement, RiadService } from "~/types";
import { mdiBedKingOutline } from "@mdi/js";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const { getRiadBySlug, formatPrice } = useRiad();

const [riad1, riad2] = (await Promise.all([
  getRiadBySlug("dar-barai"),
  getRiadBySlug("dar-tanawi"),
])) as [Riad, Riad];

if (!riad1 || !riad2) {
  throw createError({ statusCode: 404 });
}

const name1 = computed(() =>
  locale.value === "fr" ? riad1.name : riad1.name_en || riad1.name,
);
const name2 = computed(() =>
  locale.value === "fr" ? riad2.name : riad2.name_en || riad2.name,
);
const desc1 = computed(() =>
  locale.value === "fr"
    ? riad1.description
    : riad1.description_en || riad1.description,
);
const desc2 = computed(() =>
  locale.value === "fr"
    ? riad2.description
    : riad2.description_en || riad2.description,
);

const totalGuests = computed(() => riad1.max_guests + riad2.max_guests);
const totalArea = computed(
  () => (riad1.area_sqm ?? 0) + (riad2.area_sqm ?? 0) || null,
);
const totalPrice = computed(
  () => riad1.base_price_per_night + riad2.base_price_per_night,
);

// Couchage : on marque l'origine avec le logo
const combinedSleeping = computed(() => [
  ...(riad1.sleeping_arrangements ?? []).map((r: RiadSleepingArrangement) => ({
    ...r,
    _riad: riad1.name,
    _logo: "/images/logo_dar_barai.jpg",
  })),
  ...(riad2.sleeping_arrangements ?? []).map((r: RiadSleepingArrangement) => ({
    ...r,
    _riad: riad2.name,
    _logo: "/images/logo_dar_tanawi.jpg",
  })),
]);

// Équipements : union sans doublons
const combinedAmenities = computed(() => [
  ...new Set([...(riad1.amenities ?? []), ...(riad2.amenities ?? [])]),
]);

// Services : concat avec origine
const combinedServices = computed(() => [
  ...(riad1.services ?? []).map((s: RiadService) => ({
    ...s,
    _riad: riad1.name,
    _logo: "/images/logo_dar_barai.jpg",
  })),
  ...(riad2.services ?? []).map((s: RiadService) => ({
    ...s,
    _riad: riad2.name,
    _logo: "/images/logo_dar_tanawi.jpg",
  })),
]);

// Règles : union sans doublons
const combinedRules = computed(() => {
  const rules =
    locale.value === "fr"
      ? [...(riad1.house_rules ?? []), ...(riad2.house_rules ?? [])]
      : [
          ...(riad1.house_rules_en?.length
            ? riad1.house_rules_en
            : (riad1.house_rules ?? [])),
          ...(riad2.house_rules_en?.length
            ? riad2.house_rules_en
            : (riad2.house_rules ?? [])),
        ];
  return [...new Set(rules)];
});

// Lightbox
const lightbox = reactive({ open: false, photos: [] as string[], index: 0 });
const openLightbox = (photos: string[], index: number) => {
  lightbox.photos = photos;
  lightbox.index = index;
  lightbox.open = true;
};
const onKeydown = (e: KeyboardEvent) => {
  if (!lightbox.open) {
    return;
  }
  if (e.key === "Escape") {
    lightbox.open = false;
  }
  if (e.key === "ArrowLeft" && lightbox.index > 0) {
    lightbox.index--;
  }
  if (e.key === "ArrowRight" && lightbox.index < lightbox.photos.length - 1) {
    lightbox.index++;
  }
};
onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));

const amenityEmoji = (slug: string): string =>
  (
    ({
      piscine: "🏊",
      hammam: "♨️",
      wifi: "📶",
      climatisation: "❄️",
      terrasse: "🌿",
      "petit-dejeuner": "🥐",
      cuisine: "🍳",
      parking: "🚗",
      jardin: "🌳",
      cheminee: "🔥",
      blanchisserie: "👕",
      "navette-aeroport": "✈️",
    }) as Record<string, string>
  )[slug] ?? "✓";

useSeoMeta({
  title: `${riad1.name} & ${riad2.name} – Réservez les deux riads`,
  description: t("riads.combined_description"),
});
</script>
