<template>
  <PageHeader />
  <div class="admin-page">

    <a-menu
      v-model:selectedKeys="selectedKeys"
      style="width: 200px"
      mode="inline"
      @click="handleMenuClick"
    >
      <a-menu-item key="AdminUser">用户管理</a-menu-item>
      <a-menu-item key="AdminProblem">题目管理</a-menu-item>
      <a-menu-item key="AdminContest">比赛管理</a-menu-item>
      <a-menu-item key="AdminStatistics">数据统计</a-menu-item>
      <a-menu-item key="AdminJudge">评测机设置</a-menu-item>
      <!--      <a-menu-item key="4">文件管理</a-menu-item>-->
    </a-menu>
    <router-view style="flex-grow:1;margin: 16px"/>
  </div>

  <PageFooter />
</template>

<script setup lang="ts">
import PageFooter from '@/components/PageFooter/index.vue';
import PageHeader from '@/components/PageHeader/index.vue';
import { ref } from 'vue';
import router from '@/router';
const selectedKeys = ref([]);
const handleMenuClick = (e: { key: string; })=>{
  router.push({ name: e.key });
};
</script>

<style scoped>
.admin-page{
  display: flex;
  min-height: 100vh;
}
</style>