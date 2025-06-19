<template>
  <div :class="['min-h-screen', 'flex flex-col']">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
      <div class="flex items-center gap-2"> <!-- text-gradient removed from here -->
        <img src="/logo.svg" alt="Fluid Logo" class="h-6 w-6">
        <span class="font-bold text-lg text-gradient">FLUID</span> <!-- text-gradient added back here -->
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
          @click="randomizePerlin"
        >
          Randomize
        </UButton>
      </div>
    </header>

    <main class="flex-1 flex flex-col md:flex-row gap-4 p-4">
      <!-- Left Sidebar -->
      <aside class="w-full md:w-72 flex-shrink-0 flex flex-col">
        <MatrixSettings
          v-model:dimensions="dimensions"
          v-model:size="size"
          v-model:colorMode="colorMode"
          v-model:solidColor="solidColor"
          v-model:gradientStart="gradientStart"
          v-model:gradientEnd="gradientEnd"
        />
        <div class="flex flex-grow"/>
        <div class="text-xs text-neutral-400 mt-8 text-left">
          <span>
            Made with ❤ by <a href="https://www.linkedin.com/in/steve-martin2/" target="_blank" class="underline">Steve Martin</a>
          </span>
        </div>
      </aside>

      <!-- Center Canvas -->
      <section class="flex-1 flex items-center justify-center">
        <FlowCanvas
          ref="flowCanvasRef"
          :dimensions="dimensions"
          :size="size"
          :color-mode="colorMode"
          :solid-color="solidColor"
          :gradient-start="gradientStart"
          :gradient-end="gradientEnd"
          :dotMin="dotMin"
          :dotMax="dotMax"
          :amplitude="amplitude"
          :waves="waves"
          :frequency="frequency"
          :repelEnabled="repelEnabled"
          :repelRadius="repelRadius"
          :repelStrength="repelStrength"
          :maxDisplacement="maxDisplacement"
          :isPaused="isPaused"
          :noiseType="noiseType"
          @toggle-pause="togglePause"
        />
      </section>

      <!-- Right Sidebar -->
      <aside class="w-full md:w-72 flex-shrink-0 flex flex-col">
        <PropertiesPanel
          v-model:dotMin="dotMin"
          v-model:dotMax="dotMax"
          v-model:amplitude="amplitude"
          v-model:waves="waves"
          v-model:frequency="frequency"
          v-model:repelEnabled="repelEnabled"
          v-model:repelRadius="repelRadius"
          v-model:repelStrength="repelStrength"
          v-model:maxDisplacement="maxDisplacement"
          v-model:noiseType="noiseType"
        />
        <div class="flex-grow" />
        <div class="text-xs text-neutral-400 mt-8 text-right">
          Last updated June 2025 – v1.1.2
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSeoMeta } from '#imports'
import MatrixSettings from '~/components/MatrixSettings.vue'
import FlowCanvas from '~/components/FlowCanvas.vue'
import PropertiesPanel from '~/components/PropertiesPanel.vue'

const dimensions = ref(88)
const size = ref(0.85)
const colorMode = ref('gradient')
const solidColor = ref('#ffffff')
const gradientStart = ref('#00d492')
const gradientEnd = ref('#51a2ff')
const dotMin = ref(0.3)
const dotMax = ref(4)
const amplitude = ref(20)
const waves = ref(0.1)
const frequency = ref(0.002)
const repelEnabled = ref(false)
const repelRadius = ref(75)
const repelStrength = ref(15)
const maxDisplacement = ref(40)
const noiseType = ref('perlin')

const isPaused = ref(false)
function togglePause() {
  isPaused.value = !isPaused.value
}

const flowCanvasRef = ref(null)

function downloadPNG() {
  flowCanvasRef.value?.exportPNG()
}

function downloadSVG() {
  flowCanvasRef.value?.exportSVG()
}

function randomizePerlin() {
  flowCanvasRef.value?.randomizeNoise()
}

useSeoMeta({
  title: 'Fluid - Steve Martin', // Changed
  description: 'Fluid is a Perlin noise Visualizer for a dot grid by Steve Martin.', // Updated description
  ogTitle: 'Fluid - Steve Martin', // Updated OG Title
  ogDescription: 'Fluid is a Perlin noise Visualizer for a dot grid by Steve Martin.', // Updated OG Description
  ogImage: '/logo.svg', // Use the new logo for OG image
  twitterCard: 'summary_large_image',
});
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: filter 0.3s cubic-bezier(0.4,0,0.2,1), text-shadow 0.3s;
}
.text-gradient:hover {
  filter: brightness(1.15) saturate(1.2);
  text-shadow: 0 2px 16px #ff996633;
}

:deep(.u-card) {
  transition: box-shadow 0.18s cubic-bezier(0.4,0,0.2,1), transform 0.18s cubic-bezier(0.4,0,0.2,1);
}
:deep(.u-card:hover) {
  box-shadow: 0 4px 24px 0 rgba(255,153,102,0.08), 0 1.5px 8px 0 rgba(0,0,0,0.10);
  transform: scale(1.015);
}

:deep(.u-button) {
  transition: transform 0.13s cubic-bezier(0.4,0,0.2,1), box-shadow 0.13s;
}
:deep(.u-button:hover),
:deep(.u-button:focus-visible) {
  transform: scale(1.08);
  box-shadow: 0 2px 10px 0 rgba(255,153,102,0.10);
}
</style>
