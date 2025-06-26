<template>
  <UCard variant="subtle" class="rounded-none overflow-visible">
    <template #header>
      <CollapsibleCardHeader
        icon="i-lucide-grip"
        title="Matrix Settings"
        :isOpen="isOpen"
        @toggle="isOpen = !isOpen"
      />
    </template>
    <transition name="fade-slide">
      <div v-if="isOpen">
        <LabeledSlider
          v-model="dimensions"
          icon="i-lucide-grid"
          label="Dimensions"
          :tooltip="'Controls the number of rows and columns in the grid. Higher values create a denser grid.'"
          :min="10"
          :max="150"
        >
          <template #value> {{ dimensions }} x {{ dimensions }} </template>
        </LabeledSlider>
        <LabeledSlider
          v-model="size"
          icon="i-lucide-maximize-2"
          label="Size"
          :tooltip="'Adjusts the overall size of the grid relative to the canvas.'"
          :min="0.1"
          :max="1"
          :step="0.01"
        />
        <div class="mb-4">
          <UTooltip
            text="Choose between a gradient (vertical color blend) or a solid color for all dots."
          >
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-lucide-palette" class="text-neutral-400" />
              <label class="block text-sm font-medium mb-1">Color Mode</label>
            </div>
          </UTooltip>
          <USelect
            v-model="colorMode"
            :items="colorOptions"
            class="w-48 interactive"
          />
        </div>
        <div class="mb-3 flex items-center gap-2">
          <div v-if="colorMode === 'gradient'" class="h-5 w-24 rounded shadow">
            <canvas
              ref="gradientPreview"
              class="h-5 w-24 rounded shadow"
              style="display: block"
            ></canvas>
          </div>
          <div
            v-else
            class="h-5 w-24 rounded shadow"
            :style="{ background: solidColor }"
          ></div>
          <span class="text-xs text-neutral-400">Preview</span>
        </div>
        <!-- Color Section -->
        <transition name="fade-color-mode" mode="out-in">
          <div :key="colorMode">
            <div v-if="colorMode === 'solid'">
              <UTooltip text="Pick a single color for all dots.">
                <div class="flex items-center gap-2 mb-1">
                  <UIcon name="i-lucide-droplet" class="text-neutral-400" />
                  <label class="block text-sm font-medium mb-1"
                    >Dot Color</label
                  >
                </div>
              </UTooltip>
              <div class="flex items-center gap-2">
                <UInput
                  type="color"
                  v-model="solidColor"
                  class="w-8 h-8 p-0 border-none bg-transparent interactive"
                />
                <span class="text-xs font-mono text-neutral-400">{{
                  solidColor
                }}</span>
              </div>
            </div>
            <div v-else>
              <UTooltip
                text="Select the start color for the vertical gradient applied to the dots."
              >
                <div class="flex items-center gap-2 mb-1">
                  <UIcon name="i-lucide-arrow-up" class="text-neutral-400" />
                  <label class="block text-sm font-medium mb-1"
                    >Gradient Start</label
                  >
                </div>
              </UTooltip>
              <div class="flex items-center gap-2">
                <UInput
                  type="color"
                  v-model="gradientStart"
                  class="w-8 h-8 p-0 border-none bg-transparent interactive"
                />
                <span class="text-xs font-mono text-neutral-400">{{
                  gradientStart
                }}</span>
              </div>
              <UTooltip
                text="Select the end color for the vertical gradient applied to the dots."
              >
                <div class="flex items-center gap-2 mb-1 mt-2">
                  <UIcon name="i-lucide-arrow-down" class="text-neutral-400" />
                  <label class="block text-sm font-medium mb-1"
                    >Gradient End</label
                  >
                </div>
              </UTooltip>
              <div class="flex items-center gap-2">
                <UInput
                  type="color"
                  v-model="gradientEnd"
                  class="w-8 h-8 p-0 border-none bg-transparent interactive"
                />
                <span class="text-xs font-mono text-neutral-400">{{
                  gradientEnd
                }}</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </UCard>
</template>

<script setup>
import { onMounted, watch, ref, computed } from "vue";
import { hexToHSL, lerp } from "@/composables/useColor.js";
import { useSettingsStore } from "~/store/settings";

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

const items = ref(["Backlog", "Todo", "In Progress", "Done"]); // This seems unused, consider removing if not needed for other functionality.
const value = ref("Backlog"); // This seems unused, consider removing if not needed for other functionality.

const colorOptions = ref([
  { label: "Gradient", value: "gradient" },
  { label: "Solid", value: "solid" },
]);

const isOpen = ref(true);
const gradientPreview = ref(null);

function drawGradientPreview() {
  const canvas = gradientPreview.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = (canvas.width = 96);
  const height = (canvas.height = 20);
  const startHSL = hexToHSL(gradientStart.value);
  const endHSL = hexToHSL(gradientEnd.value);
  for (let y = 0; y < height; y++) {
    const t = y / (height - 1);
    const h = lerp(startHSL.h, endHSL.h, t);
    const s = lerp(startHSL.s, endHSL.s, t);
    const l = lerp(startHSL.l, endHSL.l, t);
    ctx.fillStyle = `hsl(${h},${s}%,${l}%)`;
    ctx.fillRect(0, y, width, 1);
  }
}

onMounted(drawGradientPreview);
watch([gradientStart, gradientEnd], drawGradientPreview);
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.98);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scaleY(1);
}

.interactive {
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s;
}
.interactive:hover,
.interactive:focus-within {
  transform: scale(1.03);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
}
</style>
