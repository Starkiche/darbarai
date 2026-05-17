<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 pt-16 pb-12">
      <h1 class="section-title text-center mb-4">{{ t("boutique.page_title") }}</h1>
      <p class="text-center text-stone-500 max-w-2xl mx-auto">{{ t("boutique.page_subtitle") }}</p>
    </div>

    <div class="max-w-7xl mx-auto px-4 pb-20">
      <div v-if="products.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="product in products"
          :key="product.id"
          class="group card overflow-hidden"
        >
          <!-- Image -->
          <div class="relative aspect-square overflow-hidden bg-stone-100">
            <img
              v-if="product.images.length"
              :src="product.images[0]"
              :alt="productName(product)"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-stone-300"
            >
              <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>

            <!-- Galerie dots -->
            <div v-if="product.images.length > 1" class="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              <button
                v-for="(_, i) in product.images"
                :key="i"
                class="w-1.5 h-1.5 rounded-full transition-colors"
                :class="activeImage[product.id] === i ? 'bg-white' : 'bg-white/50'"
                @click.stop="activeImage[product.id] = i"
              />
            </div>
          </div>

          <!-- Contenu -->
          <div class="p-6">
            <h3 class="font-serif text-xl text-stone-800 mb-2">{{ productName(product) }}</h3>
            <p v-if="productDescription(product)" class="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-4">
              {{ productDescription(product) }}
            </p>

            <!-- Tailles -->
            <div v-if="product.sizes.length" class="flex flex-wrap gap-1.5 mb-4">
              <span
                v-for="size in product.sizes"
                :key="size"
                class="text-xs px-2.5 py-1 rounded-full border border-stone-200 text-stone-600 font-medium"
              >
                {{ size }}
              </span>
            </div>

            <!-- Prix -->
            <div class="border-t border-stone-100 pt-4 flex items-center justify-between">
              <span class="font-semibold text-terracotta-700 text-lg">
                {{ formatProductPrice(product.price_cents) ?? t("boutique.on_request") }}
              </span>
              <a
                href="https://wa.me/33676847685"
                target="_blank"
                rel="noopener"
                class="btn-primary text-xs px-4 py-2"
              >
                {{ t("boutique.cta") }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-24 text-stone-400">
        {{ t("boutique.empty") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types";

const { t, locale } = useI18n();
const { fetchProducts, formatProductPrice } = useProducts();

const { data: products } = await useAsyncData("boutique", async () => {
  const { data } = await fetchProducts(true);
  return data ?? [];
});

const activeImage = reactive<Record<string, number>>({});

const productName = (p: Product) =>
  locale.value === "fr" ? p.name : p.name_en || p.name;

const productDescription = (p: Product) =>
  locale.value === "fr" ? p.description : p.description_en || p.description;

useSeoMeta({ title: t("boutique.seo_title") });
</script>
