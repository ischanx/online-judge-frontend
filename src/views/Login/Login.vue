<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/user';
import Storage from '@/utils/storage';
import message from 'ant-design-vue/es/message';
import 'ant-design-vue/es/message/style/index.css';


interface ILoginForm {
  username: string;
  password: string;
}
const router = useRouter();
const formState = reactive<ILoginForm>({
  username: '',
  password: ''
});
onBeforeMount(() => {
  formState.username = Storage.getLocalItem('username') || '';
  // 已经有token说明登录成功，跳转到首页
  if(Storage.getLocalItem('token')){
    router.replace({ path: '/' });
  }
});
const handleLoginBtnClick = async() => {
  const res = await login(formState);
  if(res.token){
    message.success(res.message);
    Storage.setLocalItem('username', formState.username);
    Storage.setLocalItem('token', res.token, {
      expire: 30 * 60 * 1000,
    });
    await router.push({ path: '/' });
  }
};

</script>

<template>
  <div class="login">
    <a-form
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="handleLoginBtnClick"
    >
      <a-form-item
        label="账号"
        name="username"
        :rules="[{ required: true, message: '账号不能为空' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>
      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '密码不能为空' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit" >登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
@import "./login.less";
</style>