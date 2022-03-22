<script setup lang="ts">

import { ref, onBeforeMount } from 'vue';


const username = ref('');
const password = ref('');
onBeforeMount(() => {
  username.value = localStorage.getItem('username') || '';
});
const handleLoginBtnClick = () => {
  localStorage.setItem('username', username.value);
  console.log('login');
};

</script>

<template>
  <div class="login">
    <a-input v-model:value="username"  placeholder="请输入账号"/>
    <a-input-password v-model:value="password" placeholder="请输入密码" />
    <a-button @click="handleLoginBtnClick">登录</a-button>
  </div>
</template>

<style scoped>
@import "./login.less";
</style>