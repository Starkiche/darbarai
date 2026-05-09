<template>
  <div>
    <h1 class="text-2xl font-semibold text-stone-800 mb-8">
      {{ t("admin.title") }}
    </h1>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      <AdminStatCard
        :label="t('admin.stat_total_reservations')"
        :value="totalReservations ?? 0"
        icon="calendar"
      />
      <AdminStatCard
        :label="t('admin.stat_pending')"
        :value="pendingCount ?? 0"
        icon="clock"
        color="amber"
      />
      <AdminStatCard
        :label="t('admin.stat_clients')"
        :value="totalClients ?? 0"
        icon="users"
      />
      <AdminStatCard
        :label="t('admin.stat_riads')"
        :value="2"
        icon="home"
        color="olive"
      />
    </div>

    <!-- Dernières réservations -->
    <div class="card p-6">
      <h2 class="font-semibold text-stone-700 mb-4">
        {{ t("admin.recent_reservations") }}
      </h2>
      <AdminReservationsTable :limit="5" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "admin", layout: "admin" });
const supabase = useSupabaseClient();
const { t } = useI18n();

const [
  { count: totalReservations },
  { count: pendingCount },
  { count: totalClients },
] = await Promise.all([
  supabase.from("reservations").select("*", { count: "exact", head: true }),
  supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending"),
  supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "client"),
]);

useSeoMeta({ title: t("admin.seo_title") });
</script>
