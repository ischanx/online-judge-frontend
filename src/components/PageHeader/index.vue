<script setup lang="ts">
import Logo from '@/components/Logo/index.vue';
import { ref, onMounted } from 'vue';
import { MENU_KEYS } from '@/const/app';
import { useRouter } from 'vue-router';

import { useGlobalStore } from '@/store';

const router = useRouter();
const selectedKeys = ref<number[]>([]);
onMounted(() => {
  const index = ['/problem', '/contest', '/status'].findIndex((item) => window.location.pathname.startsWith(item));
  if (index >= 0) {
    selectedKeys.value.length = 0;
    selectedKeys.value.push(index);
  }
});

const handleMenuClick = ({ key }: { key: number }) => {
  const map = ['ProblemList', 'ContestList', 'Status', 'AdminUser'];
  router.push({ name: map[key] });
};
const handleUserLogout = () => {
  globalStore.resetState();
  localStorage.removeItem('token');
  router.push({ name: 'Login' });

};
const globalStore = useGlobalStore();

const handleProfileClick = () => {
  router.push({
    name: 'PersonPage',
  });
};
</script>

<template>
  <a-layout-header class="global-layout__header">
    <div style="display: flex">
      <Logo style="color: white"/>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="horizontal" @click="handleMenuClick">
        <a-menu-item :key="MENU_KEYS.PROBLEM">题库</a-menu-item>
        <a-menu-item :key="MENU_KEYS.CONTEST">比赛</a-menu-item>
        <a-menu-item :key="MENU_KEYS.STATUS">状态</a-menu-item>
        <a-menu-item v-if="globalStore.user.role" :key="MENU_KEYS.ADMIN">管理</a-menu-item>
      </a-menu>
    </div>
    <div>
      <!--todo：用户组件-->
      <a-button
        v-if="!globalStore.token" size="large" style="color: white" type="text"
        @click="router.push({ name: 'Login' })"
      >登录
      </a-button>
      <a-dropdown v-else placement="bottomRight">
        <a-avatar size="large">
          {{ globalStore.user.username }}
        </a-avatar>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="handleProfileClick">
              个人主页
            </a-menu-item>
            <!--            <a-menu-item>-->
            <!--              账号设置-->
            <!--            </a-menu-item>-->
            <a-menu-item @click="handleUserLogout">
              退出账号
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>


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
