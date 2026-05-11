<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled ? 'bg-white/95 backdrop-blur shadow-sm' : 'bg-transparent'"
  >
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logos -->
      <div class="flex items-center gap-3">
        <NuxtLink
          :to="localePath('/')"
          class="text-sm font-medium transition-colors px-2"
          :class="
            scrolled
              ? 'text-stone-700 hover:text-terracotta-600'
              : 'text-white/90 hover:text-white'
          "
        >
          {{ t("nav.home") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/riads/dar-barai')"
          class="flex items-center"
        >
          <img
            src="/images/logo_dar_barai.jpg"
            alt="Dar Baraï"
            class="h-12 w-auto transition-all duration-300 rounded-lg"
            :class="scrolled ? '' : 'ring-1 ring-white/20 shadow-md'"
          />
        </NuxtLink>
        <NuxtLink
          :to="localePath('/riads/dar-tanawi')"
          class="flex items-center"
        >
          <img
            src="/images/logo_dar_tanawi.jpg"
            alt="Dar Tanawi"
            class="h-12 w-auto transition-all duration-300 rounded-lg"
            :class="scrolled ? '' : 'ring-1 ring-white/20 shadow-md'"
          />
        </NuxtLink>
      </div>

      <!-- Nav desktop -->
      <nav class="hidden md:flex items-center gap-6">
        <NuxtLink
          :to="localePath('/riads')"
          class="text-sm font-medium transition-colors"
          :class="
            scrolled
              ? 'text-stone-700 hover:text-terracotta-600'
              : 'text-white/90 hover:text-white'
          "
        >
          {{ t("nav.riads") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/services')"
          class="text-sm font-medium transition-colors"
          :class="
            scrolled
              ? 'text-stone-700 hover:text-terracotta-600'
              : 'text-white/90 hover:text-white'
          "
        >
          {{ t("nav.services") }}
        </NuxtLink>
      </nav>

      <!-- Debug isAdmin -->
      <span
        class="text-xs font-mono px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 border border-yellow-300"
      >
        isAdmin: {{ isAdmin }}
      </span>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <!-- Sélecteur de langue -->
        <button
          v-for="loc in availableLocales"
          :key="loc"
          class="text-xs font-medium uppercase px-2 py-1 rounded transition-colors"
          :class="[
            locale === loc ? 'bg-terracotta-600 text-white' : '',
            scrolled
              ? 'text-stone-600 hover:text-terracotta-600'
              : 'text-white/80 hover:text-white',
          ]"
          @click="setLocale(loc)"
        >
          {{ loc }}
        </button>

        <!-- Auth -->
        <template v-if="user">
          <NuxtLink
            :to="localePath('/account')"
            class="text-sm font-medium transition-colors"
            :class="
              scrolled
                ? 'text-stone-700 hover:text-terracotta-600'
                : 'text-white/90 hover:text-white'
            "
          >
            {{ t("nav.account") }}
          </NuxtLink>
          <NuxtLink
            v-if="isAdmin"
            :to="localePath('/admin')"
            class="text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
            :class="
              scrolled
                ? 'border-terracotta-600 text-terracotta-600 hover:bg-terracotta-600 hover:text-white'
                : 'border-white/70 text-white hover:bg-white/20'
            "
          >
            ⚙ {{ t("nav.admin") }}
          </NuxtLink>
          <button class="btn-primary text-sm px-4 py-2" @click="signOut">
            {{ t("nav.logout") }}
          </button>
        </template>
        <template v-else>
          <NuxtLink
            :to="localePath('/auth/login')"
            class="text-sm font-medium transition-colors"
            :class="
              scrolled
                ? 'text-stone-700 hover:text-terracotta-600'
                : 'text-white/90 hover:text-white'
            "
          >
            {{ t("nav.login") }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/riads')"
            class="btn-primary text-sm px-4 py-2"
          >
            {{ t("nav.book") }}
          </NuxtLink>
        </template>

        <!-- Menu burger mobile -->
        <button class="md:hidden p-2" @click="mobileOpen = !mobileOpen">
          <span class="sr-only">Menu</span>
          <svg
            class="w-5 h-5"
            :class="scrolled ? 'text-stone-700' : 'text-white'"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              v-if="!mobileOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Menu mobile -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileOpen"
        class="md:hidden bg-white border-t border-stone-100 shadow-lg"
      >
        <nav class="flex flex-col px-4 py-4 gap-4">
          <NuxtLink
            :to="localePath('/riads')"
            class="text-stone-700 font-medium"
            @click="mobileOpen = false"
          >
            {{ t("nav.riads") }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/services')"
            class="text-stone-700 font-medium"
            @click="mobileOpen = false"
          >
            {{ t("nav.services") }}
          </NuxtLink>
          <template v-if="user">
            <NuxtLink
              :to="localePath('/account')"
              class="text-stone-700 font-medium"
              @click="mobileOpen = false"
            >
              {{ t("nav.account") }}
            </NuxtLink>
            <button
              class="text-left text-stone-700 font-medium"
              @click="signOut"
            >
              {{ t("nav.logout") }}
            </button>
          </template>
          <template v-else>
            <NuxtLink
              :to="localePath('/auth/login')"
              class="text-stone-700 font-medium"
              @click="mobileOpen = false"
            >
              {{ t("nav.login") }}
            </NuxtLink>
          </template>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
const { t, locale, availableLocales, setLocale } = useI18n();
const localePath = useLocalePath();
const { user, isAdmin, signOut } = useAuth();

const scrolled = ref(false);
const mobileOpen = ref(false);

onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 40;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onUnmounted(() => window.removeEventListener("scroll", onScroll));
});
</script>
