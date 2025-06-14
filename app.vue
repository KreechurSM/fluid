<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>

<script setup>
if (process.client) {
  document.documentElement.classList.add('dark')
}
</script>
