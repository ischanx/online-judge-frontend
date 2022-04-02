<template>
  <div class="logo-component" @click="handleHomeClick">
    <img src="/logo2.png"/>
    <span v-if="showTitile">Online Judge</span>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';

defineProps({
  showTitile: {
    type: Boolean,
    default: true,
  },
});
const handleHomeClick = () => {
  router.push({ path: '/' });
};
</script>

<style lang="less" scoped>
.logo-component {
  max-width: 180px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: #3a3a3a;
  padding: 0 8px;
  user-select: none;
  cursor: pointer;

  & > img {
    width: 25px;
    height: 25px;
    margin-right: 12px;
    background-color: #eee;
  }
}
</style>