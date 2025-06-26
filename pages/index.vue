<template>
  <Analytics/>
  <div :class="['min-h-screen', 'flex flex-col']">
    <!-- Header -->
    <header
      class="flex items-center justify-between px-4 py-3 border-b border-neutral-800"
    >
      <div class="flex items-center gap-2">
        <img src="/logo.svg" alt="Fluid Logo" class="h-6 w-6" />
        <span class="font-bold text-lg text-gradient">FLUID</span>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          :icon="isPaused ? 'i-heroicons-play' : 'i-heroicons-pause'"
          variant="ghost"
          size="sm"
          class="ml-2"
          @click="togglePause"
          :aria-label="isPaused ? 'Play' : 'Pause'"
        />
        <UButton
          icon="i-heroicons-arrow-down-tray"
          variant="ghost"
          size="sm"
          class="!px-4"
          @click="downloadPNG"
        >
          PNG
        </UButton>
        <UButton
          icon="i-heroicons-arrow-down-tray"
          variant="ghost"
          size="sm"
          class="!px-4"
          @click="downloadSVG"
        >
          SVG
        </UButton>
        <UButton
          icon="i-lucide-dices"
          variant="ghost"
          size="sm"
          class="ml-2"
          @click="randomizeNoise"
        >
          {{ shuffleText }}
        </UButton>
      </div>
    </header>

    <main class="flex-1 flex flex-col md:flex-row gap-4">
      <!-- Left Sidebar for Desktop -->
      <aside class="hidden md:flex w-full md:w-72 flex-shrink-0 flex-col">
        <MatrixSettings />
        <div class="flex flex-grow" />
      </aside>

      <!-- Center Canvas -->
      <section class="flex-1 flex items-center justify-center">
        <FlowCanvas ref="flowCanvasRef" @toggle-pause="togglePause" />
      </section>

      <!-- Right Sidebar for Desktop -->
      <aside class="hidden md:flex w-full md:w-72 flex-shrink-0 flex-col">
        <PropertiesPanel />
        <div class="flex flex-grow" />
      </aside>

      <div class="md:hidden">
        <USlideover
          title="Settings"
          description="From here you can adjust the settings for the Fluid visualizer."
        >
          <UButton
            icon="i-heroicons-cog-6-tooth"
            variant="outline"
            size="sm"
            class="md:hidden text-gradient"
            aria-label="Open Settings"
          >
            Show Settings
          </UButton>
          <template #body>
            <UCard
              class="flex flex-col flex-1 overflow-y-auto"
              :ui="{
                ring: '',
                divide: 'divide-y divide-gray-100 dark:divide-gray-800',
              }"
            >
              <div class="p-4">
                <MatrixSettings />
                <PropertiesPanel class="mt-4" />
              </div>
            </UCard>
          </template>
        </USlideover>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="w-full px-4 py-6 mt-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-neutral-400"
    >
      <span class="text-left w-full md:w-auto">
        Made with ❤ by
        <a
          href="https://www.linkedin.com/in/steve-martin2/"
          target="_blank"
          class="underline"
          >Steve Martin</a
        >
      </span>
      <span class="md:text-right w-full md:w-auto">
        Last updated June 2025 – v1.1.4
      </span>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useSeoMeta } from "#imports";
import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";
import MatrixSettings from "~/components/MatrixSettings.vue";
import FlowCanvas from "~/components/FlowCanvas.vue";
import PropertiesPanel from "~/components/NoiseSettings.vue";
import { useSettingsStore } from "~/store/settings";
import { Analytics } from '@vercel/analytics/nuxt'

const settingsStore = useSettingsStore();

// Computed properties to get and set values from the store
const dimensions = computed({
  get: () => settingsStore.dimensions,
  set: (val) => settingsStore.setDimensions(val),
});
const size = computed({
  get: () => settingsStore.size,
  set: (val) => settingsStore.setSize(val),
});
const colorMode = computed({
  get: () => settingsStore.colorMode,
  set: (val) => settingsStore.setColorMode(val),
});
const solidColor = computed({
  get: () => settingsStore.solidColor,
  set: (val) => settingsStore.setSolidColor(val),
});
const gradientStart = computed({
  get: () => settingsStore.gradientStart,
  set: (val) => settingsStore.setGradientStart(val),
});
const gradientEnd = computed({
  get: () => settingsStore.gradientEnd,
  set: (val) => settingsStore.setGradientEnd(val),
});
const dotMin = computed({
  get: () => settingsStore.dotMin,
  set: (val) => settingsStore.setDotMin(val),
});
const dotMax = computed({
  get: () => settingsStore.dotMax,
  set: (val) => settingsStore.setDotMax(val),
});
const amplitude = computed({
  get: () => settingsStore.amplitude,
  set: (val) => settingsStore.setAmplitude(val),
});
const waves = computed({
  get: () => settingsStore.waves,
  set: (val) => settingsStore.setWaves(val),
});
const frequency = computed({
  get: () => settingsStore.frequency,
  set: (val) => settingsStore.setFrequency(val),
});
const repelEnabled = computed({
  get: () => settingsStore.repelEnabled,
  set: (val) => settingsStore.setRepelEnabled(val),
});
const repelRadius = computed({
  get: () => settingsStore.repelRadius,
  set: (val) => settingsStore.setRepelRadius(val),
});
const repelStrength = computed({
  get: () => settingsStore.repelStrength,
  set: (val) => settingsStore.setRepelStrength(val),
});
const maxDisplacement = computed({
  get: () => settingsStore.maxDisplacement,
  set: (val) => settingsStore.setMaxDisplacement(val),
});
const noiseType = computed({
  get: () => settingsStore.noiseType,
  set: (val) => settingsStore.setNoiseType(val),
});
const isPaused = computed({
  get: () => settingsStore.isPaused,
  set: (val) => settingsStore.setIsPaused(val),
});

function togglePause() {
  settingsStore.togglePause();
}

const flowCanvasRef = ref(null);

function downloadPNG() {
  flowCanvasRef.value?.exportPNG();
}

function downloadSVG() {
  flowCanvasRef.value?.exportSVG();
}

function randomizeNoise() {
  flowCanvasRef.value?.randomizeNoise();
}

const breakpoints = useBreakpoints(breakpointsTailwind);
const shuffleText = computed(() =>
  breakpoints.greaterOrEqual("sm").value ? "Shuffle" : ""
);

useSeoMeta({
  title: "Fluid - Steve Martin", // Changed
  description:
    "Fluid is a Perlin noise Visualizer for a dot grid by Steve Martin.", // Updated description
  ogTitle: "Fluid - Steve Martin", // Updated OG Title
  ogDescription:
    "Fluid is a Perlin noise Visualizer for a dot grid by Steve Martin.", // Updated OG Description
  ogImage: "/logo.svg", // Use the new logo for OG image
  twitterCard: "summary_large_image",
});
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(
    90deg,
    var(--color-primary) 0%,
    var(--color-secondary) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: filter 0.3s cubic-bezier(0.4, 0, 0.2, 1), text-shadow 0.3s;
}
.text-gradient:hover {
  filter: brightness(1.15) saturate(1.2);
  text-shadow: 0 2px 16px #ff996633;
}

:deep(.u-card) {
  transition: box-shadow 0.18s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}
:deep(.u-card:hover) {
  box-shadow: 0 4px 24px 0 rgba(255, 153, 102, 0.08),
    0 1.5px 8px 0 rgba(0, 0, 0, 0.1);
  transform: scale(1.015);
}

:deep(.u-button) {
  transition: transform 0.13s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.13s;
}
:deep(.u-button:hover),
:deep(.u-button:focus-visible) {
  transform: scale(1.08);
  box-shadow: 0 2px 10px 0 rgba(255, 153, 102, 0.1);
}
</style>
