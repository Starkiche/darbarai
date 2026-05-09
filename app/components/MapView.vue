<template>
  <div ref="mapContainer" class="w-full h-full rounded-2xl" />
</template>

<script setup lang="ts">
interface MapPin {
  lat: number;
  lng: number;
  label: string;
  color?: string;
}

const props = defineProps<{
  pins: MapPin[];
  zoom?: number;
}>();

const mapContainer = ref<HTMLElement | null>(null);

onMounted(async () => {
  if (!mapContainer.value) {
    return;
  }

  const L = (await import("leaflet")).default;
  await import("leaflet/dist/leaflet.css");

  // Centre automatiquement entre les pins
  const centerLat =
    props.pins.reduce((s, p) => s + p.lat, 0) / props.pins.length;
  const centerLng =
    props.pins.reduce((s, p) => s + p.lng, 0) / props.pins.length;

  const map = L.map(mapContainer.value).setView(
    [centerLat, centerLng],
    props.zoom ?? 16,
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  for (const pin of props.pins) {
    const icon = L.divIcon({
      className: "",
      html: `<div style="
        background:${pin.color ?? "#c0704a"};
        width:14px;height:14px;
        border-radius:50%;
        border:3px solid white;
        box-shadow:0 2px 6px rgba(0,0,0,0.4);
      "></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    L.marker([pin.lat, pin.lng], { icon })
      .addTo(map)
      .bindPopup(`<strong>${pin.label}</strong>`, { closeButton: false })
      .openPopup();
  }
});
</script>
