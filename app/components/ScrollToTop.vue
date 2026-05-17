<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-75"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-75"
  >
    <button
      v-if="scrollPercent > 2"
      class="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center"
      aria-label="Retour en haut"
      @click="scrollToTop"
    >
      <!-- Anneau de progression SVG -->
      <svg
        class="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 48 48"
        fill="none"
      >
        <!-- Piste de fond -->
        <circle
          cx="24" cy="24" r="21"
          stroke-width="2.5"
          class="stroke-stone-200"
        />
        <!-- Arc de progression -->
        <circle
          cx="24" cy="24" r="21"
          stroke-width="2.5"
          stroke-linecap="round"
          class="stroke-terracotta-500 transition-all duration-100"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
        />
      </svg>

      <!-- Bouton central -->
      <span class="relative z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
        <svg class="w-4 h-4 text-terracotta-600" viewBox="0 0 24 24">
          <path fill="currentColor" :d="mdiArrowUp" />
        </svg>
      </span>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { mdiArrowUp } from "@mdi/js";

const scrollPercent = ref(0);
const circumference = 2 * Math.PI * 21;

const dashOffset = computed(
  () => circumference * (1 - scrollPercent.value / 100)
);

onMounted(() => {
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    scrollPercent.value =
      docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
  };
  window.addEventListener("scroll", update, { passive: true });
  onUnmounted(() => window.removeEventListener("scroll", update));
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>
