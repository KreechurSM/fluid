<template>
  <div
    class="flex items-center justify-between cursor-pointer select-none"
    @click="$emit('toggle')"
  >
    <div class="flex items-center gap-2">
      <UIcon :name="icon" class="text-neutral-400" />
      <span class="font-semibold">{{ title }}</span>
    </div>
    <span
      class="transition-transform duration-300"
      :class="isOpen ? 'rotate-180' : ''"
    >
      <UIcon name="i-lucide-chevron-up" />
    </span>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
});
defineEmits(['toggle']);
</script>