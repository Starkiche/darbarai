<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-playfair text-stone-800">
        {{ t("admin.riads") }}
      </h1>
    </div>

    <div v-if="pending" class="text-stone-400">{{ t("common.loading") }}</div>

    <div v-else class="grid md:grid-cols-2 gap-6">
      <div
        v-for="riad in riads"
        :key="riad.id"
        class="card flex flex-col gap-4"
      >
        <!-- Cover image -->
        <div
          class="relative aspect-video rounded-lg overflow-hidden bg-stone-100"
        >
          <img
            v-if="riad.cover_image"
            :src="riad.cover_image"
            :alt="riad.name"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="flex items-center justify-center h-full text-stone-400 text-sm"
          >
            {{ t("admin.no_image") }}
          </div>
        </div>

        <!-- Info -->
        <div class="px-4 pb-2">
          <h2 class="text-lg font-semibold text-stone-800">{{ riad.name }}</h2>
          <p class="text-sm text-stone-500 mt-1 line-clamp-2">
            {{ riad.description }}
          </p>
          <div class="flex gap-4 mt-3 text-sm text-stone-600">
            <span>{{ riad.max_guests }} {{ t("riads.up_to_guests") }}</span>
            <span
              >{{ (riad.base_price_per_night / 100).toFixed(0) }} €
              {{ t("common.per_night") }}</span
            >
          </div>
          <div class="flex gap-2 mt-2 text-xs">
            <span
              :class="riad.ical_airbnb_url ? 'badge-success' : 'badge-warning'"
              class="badge px-2 py-0.5 rounded"
            >
              Airbnb iCal {{ riad.ical_airbnb_url ? "✓" : "—" }}
            </span>
            <span
              :class="riad.ical_booking_url ? 'badge-success' : 'badge-warning'"
              class="badge px-2 py-0.5 rounded"
            >
              Booking iCal {{ riad.ical_booking_url ? "✓" : "—" }}
            </span>
          </div>
        </div>

        <NuxtLink
          :to="`/admin/riads/${riad.slug}`"
          class="btn-primary text-center mt-auto mx-4 mb-4"
        >
          {{ t("admin.edit_riad") }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Riad } from "~/types";

definePageMeta({ layout: "admin", middleware: "admin" });
const { t } = useI18n();
const supabase = useSupabaseClient();

const { data: riads, pending } = await useAsyncData("admin-riads", async () => {
  const { data } = await supabase.from("riads").select("*").order("name");
  return (data ?? []) as Riad[];
});

useSeoMeta({ title: t("admin.seo_riads_title") });
</script>
