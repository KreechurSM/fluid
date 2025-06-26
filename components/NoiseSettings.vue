<template>
  <UCard variant="subtle" class="overflow-visible rounded-none">
    <template #header>
      <CollapsibleCardHeader
        icon="i-lucide-audio-waveform"
        title="Noise Settings"
        :isOpen="isOpen"
        @toggle="isOpen = !isOpen"
      />
    </template>
    <transition name="fade-slide">
      <div v-if="isOpen">
        <!-- Noise Type Selector -->
        <div class="mb-4">
          <UTooltip
            text="Choose the algorithm that animates the grid. Perlin, Manhattan, and Simplex create different flow patterns."
          >
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-lucide-shuffle" class="text-neutral-400" />
              <label class="block text-sm font-medium mb-1">Noise Type</label>
            </div>
          </UTooltip>
          <USelect
            v-model="noiseType"
            :items="noiseTypeOptions"
            class="w-40 interactive"
          />
        </div>
        <LabeledSlider
          v-model="amplitude"
          icon="i-lucide-activity"
          label="Amplitude"
          :tooltip="'Controls how far dots can move from their base position (the strength of the noise effect).'"
          :min="0"
          :max="100"
          :step="1"
        />

        <LabeledSlider
          v-model="dotMin"
          icon="i-lucide-dot"
          label="Dot Minimum"
          :tooltip="'Set the minimum size for each dot. The actual size animates based on how much each dot is displaced.'"
          :min="0.1"
          :max="3"
          :step="0.1"
        />

        <LabeledSlider
          v-model="dotMax"
          icon="i-lucide-circle-plus"
          label="Dot Max"
          :tooltip="'Set the maximum size for each dot. The actual size animates based on how much each dot is displaced.'"
          :min="1"
          :max="8"
          :step="0.1"
        />

        <LabeledSlider
          v-model="frequency"
          icon="i-lucide-radio"
          label="Frequency"
          :tooltip="'Controls the speed of the animation (how quickly the noise evolves over time).'"
          :min="0"
          :max="0.025"
          :step="0.00025"
        />

        <LabeledSlider
          v-model="maxDisplacement"
          icon="i-lucide-move-diagonal"
          label="Max Displacement"
          :tooltip="'Sets the maximum distance a dot can move from its original grid position.'"
          :min="1"
          :max="100"
          :step="1"
        />

        <LabeledSlider
          v-model="waves"
          icon="i-lucide-waves"
          label="Waves"
          :tooltip="'Adjusts the frequency of the noise, affecting the waviness of the flow.'"
          :min="0"
          :max="0.25"
          :step="0.001"
        />
        <!-- Consistent Repel Settings Header -->
        <div class="font-semibold mt-6 mb-4 flex items-center gap-2">
          <UIcon name="i-lucide-shield-off" class="text-neutral-400" />
          <span>Repel Settings</span>
        </div>
        <div class="mb-4 flex items-center gap-2">
          <UTooltip
            text="When enabled, moving your mouse over the canvas will push nearby dots away, creating interactive ripples."
          >
            <UIcon name="i-lucide-toggle-left" class="text-neutral-400" />
            <UCheckbox v-model="repelEnabled" class="interactive" />
            <span class="text-sm">Enable Repel</span>
          </UTooltip>
        </div>
        <LabeledSlider
          v-model="repelRadius"
          icon="i-lucide-expand"
          label="Repel Radius"
          :tooltip="'The area around the mouse that affects the dots.'"
          :min="10"
          :max="200"
          :step="1"
          :disabled="!repelEnabled"
        />

        <LabeledSlider
          v-model="repelStrength"
          icon="i-lucide-zap"
          label="Repel Strength"
          :tooltip="'How strongly dots are pushed away from the mouse.'"
          :min="1"
          :max="100"
          :step="1"
          :disabled="!repelEnabled"
        />
      </div>
    </transition>
  </UCard>
</template>

<script setup>
import { ref, computed } from "vue";
import noiseTypeOptions from "@/utils/noiseTypeOptions.js"; // <-- Import here
import { useSettingsStore } from "~/store/settings";

const settingsStore = useSettingsStore();

// Computed properties to get and set values from the store
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
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s;
}
.interactive:hover,
.interactive:focus-within {
  transform: scale(1.03);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
}
</style>
