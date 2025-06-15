<template>
  <UCard class="mb-4 bg-neutral-800">
    <div
      class="flex items-center justify-between cursor-pointer select-none mb-6"
      @click="isOpen = !isOpen"
    >
      <UIcon name="i-lucide-audio-waveform" />
      <div class="font-semibold">Noise Settings</div>
      <span
        class="transition-transform duration-300"
        :class="isOpen ? 'rotate-180' : ''"
      >
        <UIcon name="i-lucide-chevron-up" />
      </span>
    </div>
    <transition name="fade-slide">
      <div v-if="isOpen">
        <!-- Noise Type Selector -->
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-1">
            <UIcon name="i-lucide-shuffle" class="text-neutral-400" />
            <label class="block text-sm font-medium mb-1">Noise Type</label>
          </div>
          <USelect
            v-model="noiseType"
            :items="noiseTypeOptions"
            class="w-40 interactive"
          />
        </div>
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-1">
            <UIcon name="i-lucide-dot" class="text-neutral-400" />
            <label class="block text-sm font-medium mb-1">Dot Min</label>
            <span class="ml-auto text-xs">{{ dotMin }}</span>
          </div>
          <USlider v-model="dotMin" :min="0.1" :max="3" :step="0.1" class="interactive" />
        </div>
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-1">
            <UIcon name="i-lucide-circle-plus" class="text-neutral-400" />
            <label class="block text-sm font-medium mb-1">Dot Max</label>
            <span class="ml-auto text-xs">{{ dotMax }}</span>
          </div>
          <USlider v-model="dotMax" :min="1" :max="8" :step="0.1" class="interactive" />
        </div>
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-1">
            <UIcon name="i-lucide-activity" class="text-neutral-400" />
            <label class="block text-sm font-medium mb-1">Amplitude</label>
            <span class="ml-auto text-xs">{{ amplitude }}</span>
          </div>
          <USlider v-model="amplitude" :min="0" :max="100" :step="1" class="interactive" />
        </div>
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-1">
            <UIcon name="i-lucide-waves" class="text-neutral-400" />
            <label class="block text-sm font-medium mb-1">Waves</label>
            <span class="ml-auto text-xs">{{ waves }}</span>
          </div>
          <USlider v-model="waves" :min="0" :max="1" :step="0.05" class="interactive" />
        </div>
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-1">
            <UIcon name="i-lucide-radio" class="text-neutral-400" />
            <label class="block text-sm font-medium mb-1">Frequency</label>
            <span class="ml-auto text-xs">{{ frequency }}</span>
          </div>
          <USlider v-model="frequency" :min="0" :max="0.01" :step="0.0001" class="interactive" />
        </div>
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-1">
            <UIcon name="i-lucide-move-diagonal" class="text-neutral-400" />
            <label class="block text-sm font-medium mb-1">Max Displacement</label>
            <span class="ml-auto text-xs">{{ maxDisplacement }}</span>
          </div>
          <USlider v-model="maxDisplacement" :min="1" :max="100" :step="1" class="interactive" />
        </div>
        <div class="font-semibold mt-6 mb-4 flex items-center gap-2">
          <UIcon name="i-lucide-shield-off" class="text-neutral-400" />
          Repel Settings
        </div>
        <div class="mb-4 flex items-center gap-2">
          <UIcon name="i-lucide-toggle-left" class="text-neutral-400" />
          <UCheckbox v-model="repelEnabled" class="interactive" />
          <span class="text-sm">Enable Repel</span>
        </div>
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-1">
            <UIcon name="i-lucide-expand" class="text-neutral-400" />
            <label class="block text-sm font-medium mb-1">Repel Radius</label>
            <span class="ml-auto text-xs">{{ repelRadius }}</span>
          </div>
          <USlider
            v-model="repelRadius"
            :min="10"
            :max="200"
            :step="1"
            :disabled="!repelEnabled"
            class="interactive"
          />
        </div>
        <div>
          <div class="flex items-center gap-2 mb-1">
            <UIcon name="i-lucide-zap" class="text-neutral-400" />
            <label class="block text-sm font-medium mb-1">Repel Strength</label>
            <span class="ml-auto text-xs">{{ repelStrength }}</span>
          </div>
          <USlider
            v-model="repelStrength"
            :min="1"
            :max="100"
            :step="1"
            :disabled="!repelEnabled"
            class="interactive"
          />
        </div>
      </div>
    </transition>
  </UCard>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps([
  "dotMin",
  "dotMax",
  "amplitude",
  "waves",
  "frequency",
  "repelEnabled",
  "repelRadius",
  "repelStrength",
  "maxDisplacement",
  "noiseType",
]);
const emit = defineEmits([
  "update:dotMin",
  "update:dotMax",
  "update:amplitude",
  "update:waves",
  "update:frequency",
  "update:repelEnabled",
  "update:repelRadius",
  "update:repelStrength",
  "update:maxDisplacement",
  "update:noiseType",
]);

const dotMin = defineModel("dotMin");
const dotMax = defineModel("dotMax");
const amplitude = defineModel("amplitude");
const waves = defineModel("waves");
const frequency = defineModel("frequency");
const repelEnabled = defineModel("repelEnabled");
const repelRadius = defineModel("repelRadius");
const repelStrength = defineModel("repelStrength");
const maxDisplacement = defineModel("maxDisplacement");
const noiseType = defineModel("noiseType");

const noiseTypeOptions = ref([
  { label: "Perlin", value: "perlin" },
  { label: "Manhattan", value: "manhattan" },
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
