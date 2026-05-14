<template>
  <footer class="bg-stone-900 text-stone-300 pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid md:grid-cols-3 gap-10 mb-12">
        <!-- Marque -->
        <div>
          <p class="font-serif text-2xl text-white mb-3">Dar Baraï</p>
          <p class="text-sm text-stone-400 leading-relaxed">
            {{ t("footer.tagline") }}
          </p>
        </div>

        <!-- Liens -->
        <div>
          <p class="text-white font-medium mb-4">
            {{ t("footer.links_title") }}
          </p>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink
                :to="localePath('/riads/dar-barai')"
                class="hover:text-terracotta-400 transition-colors"
                >Dar Baraï</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                :to="localePath('/riads/dar-tanawi')"
                class="hover:text-terracotta-400 transition-colors"
                >Dar Tanawi</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                :to="localePath('/riads/dar-barai#booking')"
                class="hover:text-terracotta-400 transition-colors"
                >{{ t("nav.book") }}</NuxtLink
              >
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <p class="text-white font-medium mb-4">
            {{ t("footer.contact_title") }}
          </p>
          <ul class="space-y-2 text-sm">
            <li class="flex items-center gap-2">
              <svg
                class="w-4 h-4 text-terracotta-400 shrink-0"
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
              Marrakech, Maroc
            </li>
            <li class="flex items-center gap-2">
              <svg
                class="w-4 h-4 text-terracotta-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <a
                href="mailto:contact@darbarai.com"
                class="hover:text-terracotta-400 transition-colors"
                >contact@darbarai.com</a
              >
            </li>
          </ul>
        </div>
      </div>

      <div
        class="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500"
      >
        <p>
          © {{ new Date().getFullYear() }} Dar Baraï & Dar Tanawi.
          {{ t("footer.rights") }}
        </p>
        <NuxtLink
          :to="localePath('/legal')"
          class="hover:text-white transition-colors"
        >
          {{ t("footer.legal") }}
        </NuxtLink>
        <div class="flex gap-4">
          <button
            v-for="loc in availableLocales"
            :key="loc.code"
            class="uppercase hover:text-white transition-colors"
            :class="locale === loc.code ? 'text-terracotta-400' : ''"
            @click="setLocale(loc.code)"
          >
            {{ loc.code }}
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t, locale, availableLocales, setLocale } = useI18n();
const localePath = useLocalePath();
</script>
