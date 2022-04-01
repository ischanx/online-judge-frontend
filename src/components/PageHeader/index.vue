<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MENU_KEYS } from '@/const/app';
import { useRouter } from 'vue-router';
const router = useRouter();
const selectedKeys = ref<number[]>([]);
onMounted(() => {
  const index = ['/problem', '/contest', '/status'].findIndex((item) => window.location.pathname.startsWith(item));
  if (index >= 0) {
    selectedKeys.value.length = 0;
    selectedKeys.value.push(index);
  }
});
const handleHomeClick = () => {
  router.push({ path: '/' });
};
const handleMenuClick: any = ({ key }: { key: number }) => {
  const map = ['ProblemList', 'ContestList', 'Status'];
  router.push({ name: map[key] });
};
const handleUserLogout = () => {
  localStorage.removeItem('token');
  router.push({ name: 'Login' });
};
</script>

<template>
  <a-layout-header class="global-layout__header">
    <div>
      <span class="logo" @click="handleHomeClick"><img src="/logo2.png" /> Online Judge</span>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="horizontal" @click="handleMenuClick">
        <a-menu-item :key="MENU_KEYS.PROBLEM">题库</a-menu-item>
        <a-menu-item :key="MENU_KEYS.CONTEST">竞赛</a-menu-item>
        <a-menu-item :key="MENU_KEYS.STATUS">状态</a-menu-item>
      </a-menu>
    </div>
    <div>
      <!--todo：用户组件-->
      <a-button @click="router.push({ name: 'Login' })">Login</a-button>
      <a-button @click="handleUserLogout">Logout</a-button>
    </div>
  </a-layout-header>
</template>

<style scoped lang="less">
.global-layout__header {
  display: flex;
  justify-content: space-between;
  user-select: none;
  .logo {
    float: left;
    color: white;
    font-size: 18px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    margin-right: 24px;
    img {
      background-color: #eee;
      width: 40px;
      height: 40px;
      margin-right: 16px;
    }
  }
}
</style>
