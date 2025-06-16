<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
import { useHead } from '#imports'
import { defineWebSite, defineOrganization } from '@unhead/schema-org'

if (process.client) {
  document.documentElement.classList.add('dark')
}

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(
        defineWebSite({
          name: 'Fluid', // Should match siteName
          url: 'https://fluid.stevemartin.dev', // Should match siteUrl
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://fluid.stevemartin.dev/search?q={search_term_string}', // Placeholder
            'query-input': 'required name=search_term_string',
          },
        }),
      ),
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify(
        defineOrganization({
          name: 'Fluid Visualizer', // Placeholder
          url: 'https://fluid.stevemartin.dev', // Placeholder
          logo: '/logo.svg',
        }),
      ),
    },
  ],
});
</script>
