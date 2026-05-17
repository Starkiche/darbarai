<template>
  <div
    class="flex items-center justify-center"
    @mouseenter="play"
    @mouseleave="stop"
  >
    <Vue3Lottie
      ref="lottieRef"
      :animation-data="animationData"
      :auto-play="false"
      :loop="false"
      class="w-full h-full"
    />
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from "vue3-lottie";

const props = defineProps<{
  animationData: object;
  playing?: boolean;
}>();

const lottieRef = ref();

watch(() => props.playing, (val) => {
  if (val) lottieRef.value?.play();
  else lottieRef.value?.stop();
});

function play() {
  lottieRef.value?.play();
}

function stop() {
  lottieRef.value?.stop();
}
</script>
