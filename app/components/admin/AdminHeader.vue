<template>
  <header
    class="h-14 bg-white border-b border-stone-200 px-6 flex items-center justify-between shrink-0"
  >
    <h1 class="text-sm font-medium text-stone-600">{{ pageTitle }}</h1>
    <div class="flex items-center gap-3">
      <span class="text-sm text-stone-500">{{
        profile?.full_name || profile?.email
      }}</span>
      <button
        class="text-xs text-stone-400 hover:text-red-600 transition-colors"
        @click="signOut"
      >
        {{ t("nav.logout") }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { profile, signOut } = useAuth();
const route = useRoute();

const pageTitle = computed(() => {
  if (route.path === "/admin") return t("admin.title");
  if (route.path.startsWith("/admin/reservations"))
    return t("admin.reservations");
  if (route.path.startsWith("/admin/newsletter")) return t("admin.newsletter");
  if (route.path.startsWith("/admin/clients")) return t("admin.clients");
  return "Admin";
});
</script>
