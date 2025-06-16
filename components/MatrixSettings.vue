<template>
  <UCard class="mb-4 bg-neutral-800" style="overflow: visible">
    <div
      class="flex items-center justify-between cursor-pointer select-none mb-6"
      @click="isOpen = !isOpen"
    >
      <UIcon name="i-lucide-grip" />
      <div class="font-semibold">Matrix Settings</div>
      <span class="transition-transform duration-300"
        :class="isOpen ? 'rotate-180' : ''"
      >
        <UIcon name="i-lucide-chevron-up" />
      </span>
    </div>
    <transition name="fade-slide">
      <div v-if="isOpen">
        <div class="mb-4">
          <UTooltip text="Controls the number of rows and columns in the grid. Higher values create a denser grid.">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-lucide-grid" class="text-neutral-400" />
              <label class="block text-sm font-medium mb-1">Grid Proportion</label>
              <span class="ml-auto text-xs"
                >{{ proportion }} x {{ proportion }}</span
              >
            </div>
          </UTooltip>
          <USlider
            v-model="proportion"
            :min="10"
            :max="200"
            class="interactive"
          />
        </div>
        <div class="mb-4">
          <UTooltip text="Adjusts the overall size of the grid relative to the canvas.">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-lucide-maximize-2" class="text-neutral-400" />
              <label class="block text-sm font-medium mb-1">Size</label>
              <span class="ml-auto text-xs">{{ size }}</span>
            </div>
          </UTooltip>
          <USlider
            v-model="size"
            :min="0.1"
            :max="1"
            :step="0.01"
            class="interactive"
          />
        </div>
        <div class="mb-4">
          <UTooltip text="Choose between a gradient (vertical color blend) or a solid color for all dots.">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-lucide-palette" class="text-neutral-400" />
              <label class="block text-sm font-medium mb-1">Color Mode</label>
            </div>
          </UTooltip>
          <USelect v-model="colorMode" :items="colorOptions" class="w-48 interactive" />
        </div>
        <div v-if="colorMode === 'solid'">
          <UTooltip text="Pick a single color for all dots.">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-lucide-droplet" class="text-neutral-400" />
              <label class="block text-sm font-medium mb-1">Dot Color</label>
            </div>
          </UTooltip>
          <UInput
            type="color"
            v-model="solidColor"
            class="w-8 h-8 p-0 border-none bg-transparent interactive"
          />
        </div>
        <div v-else>
          <UTooltip text="Select the start color for the vertical gradient applied to the dots.">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-lucide-arrow-up" class="text-neutral-400" />
              <label class="block text-sm font-medium mb-1">Gradient Start</label>
            </div>
          </UTooltip>
          <UInput
            type="color"
            v-model="gradientStart"
            class="w-8 h-8 p-0 border-none bg-transparent interactive"
          />
          <UTooltip text="Select the end color for the vertical gradient applied to the dots.">
            <div class="flex items-center gap-2 mb-1 mt-2">
              <UIcon name="i-lucide-arrow-down" class="text-neutral-400" />
              <label class="block text-sm font-medium mb-1">Gradient End</label>
            </div>
          </UTooltip>
          <UInput
            type="color"
            v-model="gradientEnd"
            class="w-8 h-8 p-0 border-none bg-transparent interactive"
          />
        </div>
      </div>
    </transition>
  </UCard>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps([
  "proportion",
  "size",
  "colorMode",
  "solidColor",
  "gradientStart",
  "gradientEnd",
]);
const emit = defineEmits([
  "update:proportion",
  "update:size",
  "update:colorMode",
  "update:solidColor",
  "update:gradientStart",
  "update:gradientEnd",
]);

const proportion = defineModel("proportion");
const size = defineModel("size");
const colorMode = defineModel("colorMode");
const solidColor = defineModel("solidColor");
const gradientStart = defineModel("gradientStart");
const gradientEnd = defineModel("gradientEnd");

const items = ref(["Backlog", "Todo", "In Progress", "Done"]);
const value = ref("Backlog");

const colorOptions = ref([
  { label: "Gradient", value: "gradient" },
  { label: "Solid", value: "solid" },
]);

const isOpen = ref(true);
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
  transition: transform 0.15s cubic-bezier(0.4,0,0.2,1), box-shadow 0.15s;
}
.interactive:hover,
.interactive:focus-within {
  transform: scale(1.03);
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
}
</style>
