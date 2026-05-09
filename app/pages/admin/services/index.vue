<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-semibold text-stone-800">
        {{ t("admin.services") }}
      </h1>
      <button class="btn-primary text-sm" @click="openNew">
        + {{ t("admin.service_add") }}
      </button>
    </div>

    <!-- Formulaire ajout / édition -->
    <div v-if="editing" class="card p-6 mb-8 border-l-4 border-terracotta-500">
      <h2 class="font-semibold text-stone-800 mb-5">
        {{ editingId ? t("admin.service_edit") : t("admin.service_add") }}
      </h2>
      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-stone-600 mb-1">{{
            t("admin.service_name_fr")
          }}</label>
          <input v-model="form.name" class="input w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-stone-600 mb-1">{{
            t("admin.service_name_en")
          }}</label>
          <input v-model="form.name_en" class="input w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-stone-600 mb-1">{{
            t("admin.service_desc_fr")
          }}</label>
          <textarea v-model="form.description" rows="3" class="input w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-stone-600 mb-1">{{
            t("admin.service_desc_en")
          }}</label>
          <textarea
            v-model="form.description_en"
            rows="3"
            class="input w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-stone-600 mb-1">{{
            t("admin.service_category")
          }}</label>
          <select v-model="form.category" class="input w-full">
            <option v-for="cat in CATEGORIES" :key="cat" :value="cat">
              {{ t(`services.category_${cat}`) }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-stone-600 mb-1"
            >{{ t("admin.service_icon") }} (emoji)</label
          >
          <input
            v-model="form.icon"
            class="input w-full"
            maxlength="4"
            placeholder="✈️"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-stone-600 mb-1">{{
            t("admin.service_price")
          }}</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="priceEur"
              type="number"
              min="0"
              step="0.5"
              class="input w-32"
              :placeholder="t('admin.service_price_placeholder')"
            />
            <span class="text-stone-400 text-sm"
              >€ (0 = {{ t("services.on_request") }})</span
            >
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-stone-600 mb-1">{{
            t("admin.service_order")
          }}</label>
          <input
            v-model.number="form.sort_order"
            type="number"
            min="0"
            class="input w-24"
          />
        </div>
      </div>
      <div class="flex items-center gap-3 mt-6">
        <button class="btn-primary text-sm" :disabled="saving" @click="save">
          {{ saving ? t("common.loading") : t("common.save") }}
        </button>
        <button class="btn-secondary text-sm" @click="cancelEdit">
          {{ t("common.cancel") }}
        </button>
        <span v-if="saveError" class="text-sm text-red-500">{{
          saveError
        }}</span>
      </div>
    </div>

    <!-- Liste des services -->
    <div class="space-y-3">
      <div
        v-for="service in allServices"
        :key="service.id"
        class="card p-4 flex items-center gap-4"
        :class="service.active ? '' : 'opacity-50'"
      >
        <span class="text-3xl w-10 text-center">{{
          service.icon ?? "✨"
        }}</span>
        <div class="flex-1 min-w-0">
          <div class="font-medium text-stone-800 flex items-center gap-2">
            {{ service.name }}
            <span
              class="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500"
            >
              {{ t(`services.category_${service.category}`) }}
            </span>
            <span
              v-if="!service.active"
              class="text-xs px-2 py-0.5 rounded-full bg-stone-200 text-stone-400"
            >
              {{ t("admin.service_inactive") }}
            </span>
          </div>
          <div class="text-sm text-stone-400 truncate">
            {{ service.description }}
          </div>
        </div>
        <div class="text-sm font-semibold text-terracotta-600 shrink-0">
          {{
            service.price_cents
              ? formatPrice(service.price_cents)
              : t("services.on_request")
          }}
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <!-- Toggle actif -->
          <button
            class="text-xs px-2 py-1 rounded border transition-colors"
            :class="
              service.active
                ? 'border-stone-200 text-stone-500 hover:border-red-300 hover:text-red-500'
                : 'border-olive-300 text-olive-600 hover:bg-olive-50'
            "
            @click="toggleActive(service)"
          >
            {{
              service.active
                ? t("admin.service_deactivate")
                : t("admin.service_activate")
            }}
          </button>
          <button
            class="text-xs px-2 py-1 rounded border border-stone-200 text-stone-500 hover:border-terracotta-300 hover:text-terracotta-600 transition-colors"
            @click="openEdit(service)"
          >
            {{ t("common.edit") }}
          </button>
          <button
            class="text-xs px-2 py-1 rounded border border-stone-200 text-stone-400 hover:border-red-300 hover:text-red-500 transition-colors"
            @click="remove(service.id)"
          >
            {{ t("common.delete") }}
          </button>
        </div>
      </div>

      <div v-if="!allServices.length" class="text-center py-16 text-stone-400">
        {{ t("services.empty") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Service, ServiceCategory } from "~/types";

definePageMeta({ layout: "admin", middleware: "admin" });

const { t } = useI18n();
const { fetchServices, createService, updateService, deleteService } =
  useServices();
const { formatPrice } = useRiad();

const CATEGORIES: ServiceCategory[] = [
  "transport",
  "wellness",
  "excursion",
  "food",
  "other",
];

const allServices = ref<Service[]>([]);

const loadServices = async () => {
  const { data } = await fetchServices(false);
  allServices.value = data;
};
await useAsyncData("admin-services", loadServices);

// Formulaire
const editing = ref(false);
const editingId = ref<string | null>(null);
const saving = ref(false);
const saveError = ref<string | null>(null);

const emptyForm = () => ({
  slug: "",
  name: "",
  name_en: null as string | null,
  description: null as string | null,
  description_en: null as string | null,
  price_cents: null as number | null,
  icon: null as string | null,
  category: "other" as ServiceCategory,
  active: true,
  sort_order: allServices.value.length,
});

const form = reactive(emptyForm());
const priceEur = ref(0);

watch(priceEur, (v) => {
  form.price_cents = v > 0 ? Math.round(v * 100) : null;
});

const openNew = () => {
  Object.assign(form, emptyForm());
  priceEur.value = 0;
  editingId.value = null;
  editing.value = true;
};

const openEdit = (service: Service) => {
  Object.assign(form, { ...service });
  priceEur.value = service.price_cents ? service.price_cents / 100 : 0;
  editingId.value = service.id;
  editing.value = true;
  saveError.value = null;
};

const cancelEdit = () => {
  editing.value = false;
  editingId.value = null;
};

const save = async () => {
  saving.value = true;
  saveError.value = null;

  // Générer le slug depuis le nom si vide
  if (!form.slug) {
    form.slug = form.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const payload = { ...form };
  let error;

  if (editingId.value) {
    ({ error } = await updateService(editingId.value, payload));
  } else {
    ({ error } = await createService(payload));
  }

  saving.value = false;
  if (error) {
    saveError.value = error.message;
  } else {
    editing.value = false;
    editingId.value = null;
    await loadServices();
  }
};

const toggleActive = async (service: Service) => {
  await updateService(service.id, { active: !service.active });
  await loadServices();
};

const remove = async (id: string) => {
  if (!confirm(t("admin.service_confirm_delete"))) {
    return;
  }
  await deleteService(id);
  await loadServices();
};

useSeoMeta({ title: t("admin.services") + " – Admin" });
</script>
