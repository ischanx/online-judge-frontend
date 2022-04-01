<template>
  <div class="page-footer">
    <span>当前时间：{{ new Date(nowTime).toLocaleString() }}</span>
    <span> Online Judge ©2022 Created by chanx.tech </span>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const nowTime = ref(0);
let timer: number;
const updateTime = () => {
  nowTime.value = Date.now();
  timer = window.setTimeout(updateTime, 1000);
};
onMounted(() => {
  updateTime();
});
onBeforeUnmount(() => {
  clearTimeout(timer);
});
</script>

<style scoped>
.page-footer {
  height: 80px;
  margin-top: 32px;
  padding: 8px;

  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;

  background-color: #1a1a1a;
  color: #eee;

}
</style>
