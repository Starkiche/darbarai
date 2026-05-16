<template>
  <div>
    <h1 class="text-2xl font-semibold text-stone-800 mb-6">Tarifs</h1>

    <!-- Sélecteur de riad -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="r in riads"
        :key="r.id"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="selectedRiadId === r.id ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'"
        @click="selectedRiadId = r.id"
      >
        {{ r.name }}
      </button>
    </div>

    <div v-if="selectedRiad" class="grid lg:grid-cols-[1fr_320px] gap-6 items-start">

      <!-- Calendrier -->
      <div class="card p-5">
        <!-- Navigation mois -->
        <div class="flex items-center justify-between mb-5">
          <button class="p-1.5 rounded-lg hover:bg-stone-100 transition-colors" @click="prevMonth">
            <svg class="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 class="text-base font-semibold text-stone-800 capitalize">{{ monthLabel }}</h2>
          <button class="p-1.5 rounded-lg hover:bg-stone-100 transition-colors" @click="nextMonth">
            <svg class="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- Légende -->
        <div class="flex items-center gap-4 mb-4 text-xs text-stone-500">
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-stone-100 border border-stone-200 inline-block"/><span>Prix de base</span></span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-blue-100 border border-blue-200 inline-block"/><span>Saison</span></span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300 inline-block"/><span>Override</span></span>
        </div>

        <!-- Grille jours de la semaine -->
        <div class="grid grid-cols-7 mb-1">
          <div v-for="d in ['L','M','M','J','V','S','D']" :key="d" class="text-center text-xs font-medium text-stone-400 py-1">{{ d }}</div>
        </div>

        <!-- Grille du mois -->
        <div class="grid grid-cols-7 gap-1">
          <!-- Jours vides avant le 1er -->
          <div v-for="n in firstDayOffset" :key="'empty-' + n" />

          <!-- Jours du mois -->
          <button
            v-for="day in daysInMonth"
            :key="day.date"
            class="relative rounded-lg p-1 text-center transition-colors hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-terracotta-400"
            :class="[
              day.source === 'override' ? 'bg-amber-100 border border-amber-300' :
              day.source === 'season' ? 'bg-blue-50 border border-blue-200' :
              'bg-stone-50 border border-stone-200',
              day.isPast ? 'opacity-40 cursor-default' : 'cursor-pointer',
              selectedDate === day.date ? 'ring-2 ring-terracotta-500' : '',
            ]"
            :disabled="day.isPast"
            @click="openDateModal(day)"
          >
            <p class="text-xs font-medium text-stone-700">{{ day.dayNum }}</p>
            <p class="text-[10px] leading-tight font-semibold mt-0.5" :class="day.source === 'override' ? 'text-amber-700' : day.source === 'season' ? 'text-blue-700' : 'text-stone-500'">
              {{ formatPriceShort(day.price) }}
            </p>
          </button>
        </div>
      </div>

      <!-- Panneau droit : saisons + override modal -->
      <div class="space-y-4">

        <!-- Modal override date -->
        <div v-if="dateModal.open" class="card p-5 border-2 border-terracotta-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-stone-800">{{ formatDateLabel(dateModal.date) }}</h3>
            <button class="text-stone-400 hover:text-stone-600" @click="dateModal.open = false">✕</button>
          </div>
          <p class="text-xs text-stone-500 mb-3">
            Prix actuel :
            <span class="font-semibold text-stone-700">{{ formatPriceShort(dateModal.currentPrice) }}</span>
            <span class="ml-1 text-stone-400">({{ dateModal.source === 'override' ? 'override' : dateModal.source === 'season' ? 'saison' : 'base' }})</span>
          </p>
          <label class="block text-sm font-medium text-stone-700 mb-1">Prix override (€)</label>
          <div class="flex gap-2">
            <input
              v-model.number="dateModal.inputPrice"
              type="number"
              min="0"
              step="1"
              class="input w-full"
              placeholder="Ex: 320"
            />
            <button class="btn-primary px-3 py-2 text-sm" :disabled="dateModal.saving" @click="saveOverride">
              {{ dateModal.saving ? '...' : 'OK' }}
            </button>
          </div>
          <button
            v-if="dateModal.source === 'override'"
            class="mt-2 text-xs text-red-500 hover:text-red-700 underline"
            @click="deleteOverride"
          >
            Supprimer l'override
          </button>
        </div>

        <!-- Saisons -->
        <div class="card p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-stone-800">Saisons</h3>
            <button class="text-xs text-terracotta-600 hover:text-terracotta-800 font-medium" @click="openSeasonForm()">+ Nouvelle</button>
          </div>

          <!-- Liste des saisons -->
          <div v-if="seasons.length === 0" class="text-xs text-stone-400 text-center py-3">Aucune saison définie.</div>
          <div v-else class="space-y-2 mb-4">
            <div
              v-for="s in seasons"
              :key="s.id"
              class="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="text-sm font-medium text-stone-800 truncate">{{ s.name }}</p>
                  <p class="text-xs text-stone-500 mt-0.5">{{ formatDateLabel(s.start_date) }} → {{ formatDateLabel(s.end_date) }}</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-sm font-semibold text-blue-700">{{ formatPriceShort(s.price_per_night) }}</span>
                  <button class="text-stone-400 hover:text-stone-600 text-xs" @click="openSeasonForm(s)">✎</button>
                  <button class="text-red-400 hover:text-red-600 text-xs" @click="deleteSeason(s.id)">✕</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulaire ajout/modif saison -->
          <div v-if="seasonForm.open" class="border-t border-stone-100 pt-4 space-y-3">
            <h4 class="text-sm font-medium text-stone-700">{{ seasonForm.id ? 'Modifier' : 'Nouvelle saison' }}</h4>
            <input v-model="seasonForm.name" type="text" class="input w-full text-sm" placeholder="Ex: Haute saison été" />
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-xs text-stone-500 mb-1 block">Début</label>
                <input v-model="seasonForm.start_date" type="date" class="input w-full text-sm" />
              </div>
              <div>
                <label class="text-xs text-stone-500 mb-1 block">Fin</label>
                <input v-model="seasonForm.end_date" type="date" class="input w-full text-sm" />
              </div>
            </div>
            <div>
              <label class="text-xs text-stone-500 mb-1 block">Prix / nuit (€)</label>
              <input v-model.number="seasonForm.price" type="number" min="0" step="1" class="input w-full text-sm" placeholder="Ex: 350" />
            </div>
            <div class="flex gap-2">
              <button class="btn-primary text-sm py-2 px-4" :disabled="seasonForm.saving" @click="saveSeason">
                {{ seasonForm.saving ? '...' : 'Enregistrer' }}
              </button>
              <button class="text-sm text-stone-500 hover:text-stone-700 px-2" @click="seasonForm.open = false">Annuler</button>
            </div>
            <p v-if="seasonForm.error" class="text-xs text-red-600">{{ seasonForm.error }}</p>
          </div>
        </div>

        <!-- Prix de base -->
        <div class="card px-5 py-4 text-sm text-stone-600">
          <span class="font-medium text-stone-700">Prix de base :</span>
          {{ formatPriceShort(selectedRiad.base_price_per_night) }} / nuit
          <NuxtLink :to="`/admin/riads/${selectedRiad.slug}`" class="ml-2 text-xs text-terracotta-600 hover:underline">Modifier →</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, parseISO, getDaysInMonth, startOfMonth, getDay, isBefore, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

definePageMeta({ middleware: "admin", layout: "admin" });
useSeoMeta({ title: "Tarifs – Admin" });

const supabase = useSupabaseClient();

// ─── Riads ────────────────────────────────────────────────────────────────────

const { data: riads } = await useAsyncData("admin:pricing:riads", async () => {
  const { data } = await (supabase as any)
    .from("riads")
    .select("id, name, slug, base_price_per_night")
    .order("name");
  return data ?? [];
});

const selectedRiadId = ref<string>(riads.value?.[0]?.id ?? "");
const selectedRiad = computed(() => riads.value?.find((r: any) => r.id === selectedRiadId.value));

// ─── Navigation mois ──────────────────────────────────────────────────────────

const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth()); // 0-based

const monthLabel = computed(() =>
  format(new Date(currentYear.value, currentMonth.value, 1), "MMMM yyyy", { locale: fr })
);

const prevMonth = () => {
  if (currentMonth.value === 0) { currentYear.value--; currentMonth.value = 11; }
  else currentMonth.value--;
};
const nextMonth = () => {
  if (currentMonth.value === 11) { currentYear.value++; currentMonth.value = 0; }
  else currentMonth.value++;
};

// ─── Données pricing ──────────────────────────────────────────────────────────

const seasons = ref<any[]>([]);
const overrides = ref<any[]>([]);

const fetchPricing = async () => {
  if (!selectedRiadId.value) return;
  const [{ data: s }, { data: o }] = await Promise.all([
    (supabase as any)
      .from("pricing_seasons")
      .select("*")
      .eq("riad_id", selectedRiadId.value)
      .order("start_date"),
    (supabase as any)
      .from("pricing_overrides")
      .select("*")
      .eq("riad_id", selectedRiadId.value),
  ]);
  seasons.value = s ?? [];
  overrides.value = o ?? [];
};

watch([selectedRiadId, currentMonth, currentYear], fetchPricing, { immediate: true });

// ─── Calendrier ───────────────────────────────────────────────────────────────

const firstDayOffset = computed(() => {
  const first = startOfMonth(new Date(currentYear.value, currentMonth.value, 1));
  const dow = getDay(first); // 0 = dimanche
  return dow === 0 ? 6 : dow - 1; // lundi = 0
});

interface CalendarDay {
  date: string;
  dayNum: number;
  price: number;
  source: "override" | "season" | "base";
  overrideId?: string;
  isPast: boolean;
}

const daysInMonth = computed<CalendarDay[]>(() => {
  const count = getDaysInMonth(new Date(currentYear.value, currentMonth.value, 1));
  const todayStr = startOfDay(today).toISOString().slice(0, 10);
  const base = selectedRiad.value?.base_price_per_night ?? 0;
  const overrideMap = new Map(overrides.value.map((o: any) => [o.date, o]));

  return Array.from({ length: count }, (_, i) => {
    const d = i + 1;
    const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    const override = overrideMap.get(dateStr) as any;
    if (override) {
      return { date: dateStr, dayNum: d, price: override.price_per_night, source: "override", overrideId: override.id, isPast: dateStr < todayStr };
    }
    const season = seasons.value.find((s: any) => s.start_date <= dateStr && s.end_date >= dateStr);
    if (season) {
      return { date: dateStr, dayNum: d, price: season.price_per_night, source: "season", isPast: dateStr < todayStr };
    }
    return { date: dateStr, dayNum: d, price: base, source: "base", isPast: dateStr < todayStr };
  });
});

// ─── Format ───────────────────────────────────────────────────────────────────

const formatPriceShort = (cents: number) => `${Math.round(cents / 100)}€`;
const formatDateLabel = (d: string) => format(parseISO(d), "d MMM yyyy", { locale: fr });

// ─── Override modal ───────────────────────────────────────────────────────────

const selectedDate = ref<string>("");
const dateModal = reactive({
  open: false,
  date: "",
  currentPrice: 0,
  source: "base" as "base" | "season" | "override",
  overrideId: undefined as string | undefined,
  inputPrice: 0,
  saving: false,
});

const openDateModal = (day: CalendarDay) => {
  selectedDate.value = day.date;
  dateModal.open = true;
  dateModal.date = day.date;
  dateModal.currentPrice = day.price;
  dateModal.source = day.source;
  dateModal.overrideId = day.overrideId;
  dateModal.inputPrice = Math.round(day.price / 100);
  dateModal.saving = false;
};

const getToken = async () => {
  const { data } = await supabase.auth.getSession();
  if (data.session?.expires_at && data.session.expires_at * 1000 < Date.now() + 60_000) {
    const { data: r } = await supabase.auth.refreshSession();
    return r.session?.access_token ?? "";
  }
  return data.session?.access_token ?? "";
};

const saveOverride = async () => {
  dateModal.saving = true;
  const token = await getToken();
  await $fetch("/api/admin/pricing/overrides", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: {
      riad_id: selectedRiadId.value,
      date: dateModal.date,
      price_per_night: Math.round(dateModal.inputPrice * 100),
    },
  });
  await fetchPricing();
  dateModal.open = false;
  dateModal.saving = false;
};

const deleteOverride = async () => {
  if (!dateModal.overrideId) return;
  dateModal.saving = true;
  const token = await getToken();
  await $fetch(`/api/admin/pricing/overrides/${dateModal.overrideId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  await fetchPricing();
  dateModal.open = false;
  dateModal.saving = false;
};

// ─── Saisons ──────────────────────────────────────────────────────────────────

const seasonForm = reactive({
  open: false,
  id: undefined as string | undefined,
  name: "",
  start_date: "",
  end_date: "",
  price: 0,
  saving: false,
  error: "",
});

const openSeasonForm = (s?: any) => {
  seasonForm.open = true;
  seasonForm.id = s?.id;
  seasonForm.name = s?.name ?? "";
  seasonForm.start_date = s?.start_date ?? "";
  seasonForm.end_date = s?.end_date ?? "";
  seasonForm.price = s ? Math.round(s.price_per_night / 100) : 0;
  seasonForm.saving = false;
  seasonForm.error = "";
};

const saveSeason = async () => {
  if (!seasonForm.name || !seasonForm.start_date || !seasonForm.end_date || !seasonForm.price) {
    seasonForm.error = "Tous les champs sont requis.";
    return;
  }
  seasonForm.saving = true;
  seasonForm.error = "";
  const token = await getToken();
  try {
    await $fetch("/api/admin/pricing/seasons", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: {
        id: seasonForm.id,
        riad_id: selectedRiadId.value,
        name: seasonForm.name,
        start_date: seasonForm.start_date,
        end_date: seasonForm.end_date,
        price_per_night: Math.round(seasonForm.price * 100),
      },
    });
    await fetchPricing();
    seasonForm.open = false;
  } catch (e: any) {
    seasonForm.error = e?.data?.message ?? "Erreur.";
  } finally {
    seasonForm.saving = false;
  }
};

const deleteSeason = async (id: string) => {
  const token = await getToken();
  await $fetch(`/api/admin/pricing/seasons/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  await fetchPricing();
};
</script>
