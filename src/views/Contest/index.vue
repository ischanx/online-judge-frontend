<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>

  {{ router.currentRoute.value.params }}
</template>


<style scoped lang="less">

</style>