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
          name: 'My Awesome Site', // Should match siteName
          url: 'https://example.com', // Should match siteUrl
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://example.com/search?q={search_term_string}', // Placeholder
            'query-input': 'required name=search_term_string',
          },
        }),
      ),
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify(
        defineOrganization({
          name: 'My Awesome Company', // Placeholder
          url: 'https://example.com', // Placeholder
          logo: 'https://example.com/company-logo.png', // Placeholder
        }),
      ),
    },
  ],
});
</script>
