<template>
  <div class="overflow-x-auto">
    <div v-if="loading" class="py-12 text-center text-stone-400">
      {{ t("common.loading") }}
    </div>

    <table v-else class="w-full text-sm">
      <thead>
        <tr class="border-b border-stone-200 text-left">
          <th class="pb-3 pr-4 font-medium text-stone-500">Réf.</th>
          <th class="pb-3 pr-4 font-medium text-stone-500">Client</th>
          <th class="pb-3 pr-4 font-medium text-stone-500">Riad</th>
          <th class="pb-3 pr-4 font-medium text-stone-500">Dates</th>
          <th class="pb-3 pr-4 font-medium text-stone-500">Total</th>
          <th class="pb-3 font-medium text-stone-500">Statut</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-stone-100">
        <tr v-if="rows.length === 0">
          <td colspan="6" class="py-8 text-center text-stone-400">
            Aucune réservation.
          </td>
        </tr>
        <tr v-for="res in rows" :key="res.id" class="hover:bg-stone-50">
          <td class="py-3 pr-4 font-mono text-xs text-stone-400">
            {{ res.id.slice(0, 8) }}
          </td>
          <td class="py-3 pr-4">
            <p class="font-medium text-stone-700">
              {{ res.profile?.full_name || "—" }}
            </p>
            <p class="text-xs text-stone-400">{{ res.profile?.email }}</p>
          </td>
          <td class="py-3 pr-4 text-stone-600">{{ res.riad?.name }}</td>
          <td class="py-3 pr-4 text-stone-600 whitespace-nowrap">
            {{ formatDate(res.check_in) }} → {{ formatDate(res.check_out) }}
          </td>
          <td class="py-3 pr-4 font-medium text-stone-800">
            {{ formatPrice(res.total_price) }}
          </td>
          <td class="py-3">
            <span class="badge" :class="statusClass(res.status)">
              {{ t(`reservation.status_${res.status}`) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Reservation } from "~/types";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

const props = defineProps<{
  reservations?: Reservation[];
  limit?: number;
  loading?: boolean;
}>();

const emit = defineEmits<{ refresh: [] }>();

const { t } = useI18n();
const { formatPrice } = useRiad();
const supabase = useSupabaseClient();

const fetchedRows = ref<Reservation[]>([]);

const rows = computed(() => {
  const list = props.reservations ?? fetchedRows.value;
  return props.limit ? list.slice(0, props.limit) : list;
});

// Si limit passé sans reservations, on charge les dernières
if (props.limit && !props.reservations) {
  const { data } = await supabase
    .from("reservations")
    .select("*, riad:riads(name, slug), profile:profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(props.limit);
  fetchedRows.value = data ?? [];
}

const formatDate = (d: string) =>
  format(parseISO(d), "dd MMM yyyy", { locale: fr });

const statusClass = (status: string) =>
  ({
    pending: "badge-warning",
    confirmed: "badge-success",
    cancelled: "badge-error",
    refunded: "badge-info",
  })[status] ?? "badge-info";
</script>
