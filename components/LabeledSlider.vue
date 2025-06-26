<template>
  <div class="mb-4">
    <UTooltip :text="tooltip">
      <div class="flex items-center gap-2 mb-1">
        <UIcon :name="icon" class="text-neutral-400" />
        <label class="block text-sm font-medium mb-1">{{ label }}</label>
        <span class="ml-auto text-xs">
          <slot name="value">{{ modelValue }}</slot>
        </span>
      </div>
    </UTooltip>
    <USlider
      v-model="internalValue"
      :min="min"
      :max="max"
      :step="step"
      class="interactive"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: [Number, String], required: true },
  icon: { type: String, required: true },
  label: { type: String, required: true },
  tooltip: { type: String, default: "" },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
});

const emit = defineEmits(["update:modelValue"]);
const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
