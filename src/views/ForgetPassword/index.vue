<script setup lang="ts">

import { ref } from 'vue';
import { resetPassword } from '@/api/user';
import message from 'ant-design-vue/es/message';
import 'ant-design-vue/es/message/style/index.css';
import router from '@/router';
const email = ref('');

const handleResetPassword = async()=>{
  try{
    await resetPassword(email.value);
    message.success('重置密码成功，请到邮箱查看');
    router.replace({ name:'Login' });
  }catch (e){
    message.error('重置密码失败，请重试');
  }
};
</script>


<template>
  <div class="forget-password">
    <div class="form">
      <a-input v-model:value="email" maxlength="40" placeholder="请输入邮箱" size="large">
        <template #prefix>
          <MailOutlined/>
        </template>
      </a-input>
      <a-button type="primary" @click="handleResetPassword">重置密码</a-button>
    </div>
  </div>
</template>


<style scoped lang="less">
.forget-password{
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 100%;
  .form{
    width: 300px;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>