<template>
  <PageHeader />
  <router-view style="min-height: 100%"/>
  <PageFooter />
</template>

<script setup lang="ts">
import PageFooter from '@/components/PageFooter/index.vue';
import PageHeader from '@/components/PageHeader/index.vue';
</script>

<style scoped>

</style>