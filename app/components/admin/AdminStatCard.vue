<template>
  <div class="card p-5 flex items-center gap-4">
    <div
      class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
      :class="colorClass"
    >
      <svg
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <!-- calendar -->
        <path
          v-if="icon === 'calendar'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
        <!-- clock -->
        <path
          v-else-if="icon === 'clock'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <!-- users -->
        <path
          v-else-if="icon === 'users'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
        <!-- home -->
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    </div>
    <div>
      <p class="text-2xl font-bold text-stone-800">{{ value }}</p>
      <p class="text-sm text-stone-500">{{ label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: number;
  icon: "calendar" | "clock" | "users" | "home";
  color?: "terracotta" | "amber" | "olive" | "default";
}>();

const colorClass = computed(() => {
  switch (props.color) {
    case "amber":
      return "bg-amber-100 text-amber-700";
    case "olive":
      return "bg-olive-100 text-olive-700";
    default:
      return "bg-terracotta-100 text-terracotta-700";
  }
});
</script>
