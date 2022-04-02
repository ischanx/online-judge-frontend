<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/user';
import Storage from '@/utils/storage';
import message from 'ant-design-vue/es/message';
import 'ant-design-vue/es/message/style/index.css';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import Logo from '@/components/Logo/index.vue';
import { useGlobalStore } from '@/store';

const globalStore = useGlobalStore();

interface ILoginForm {
  username: string;
  password: string;
}

const router = useRouter();
const formState = reactive<ILoginForm>({
  username: '',
  password: '',
});
onBeforeMount(() => {
  formState.username = Storage.getLocalItem('username') || '';
  // 已经有token说明登录成功，跳转到首页
  if (Storage.getLocalItem('token')) {
    message.success('已登录，跳转到网站首页');
    router.replace({ path: '/' });
  }
});
const handleLoginBtnClick = async () => {
  const res = await login(formState);
  if (res.token) {
    message.success(res.message);
    Storage.setLocalItem('username', formState.username);
    Storage.setLocalItem('token', res.token, {
      expire: 30 * 60 * 1000,
    });
    globalStore.setUser(res);
    await router.push({ path: '/' });
  }
};
const handleRouterChange = (name: string) => {
  router.push({ name });
};
</script>

<template>
  <a-row align="middle" justify="center" style="height: 100%;background-color:#f6f6f6;" type="flex">
    <a-col :lg="16" :md="18" :sm="20" :xl="14" :xs="22">
      <div class="login">
        <div class="login-left side">
          <Logo class="logo"/>
          <img src="/login1.png"/>
        </div>
        <div class="login-right side">
          <div class="text">
            Welcome Back :)
          </div>
          <a-form :model="formState" autocomplete="off" name="basic" @finish="handleLoginBtnClick">
            <a-form-item :rules="[{ required: true, message: '账号不能为空' }]" name="username">
              <a-input v-model:value="formState.username" placeholder="请输入邮箱" size="large">
                <template #prefix>
                  <UserOutlined/>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item :rules="[{ required: true, message: '密码不能为空' }]" name="password">
              <a-input-password v-model:value="formState.password" placeholder="请输入密码" size="large">
                <template #prefix>
                  <LockOutlined/>
                </template>
              </a-input-password>
              <a-button style="float: right" type="link" @click="handleRouterChange('ForgetPassword')">忘记密码</a-button>
            </a-form-item>
            <a-form-item>
              <a-button block html-type="submit" shape="round" size="large" type="primary">登录</a-button>
            </a-form-item>
            <a-form-item>
              没有账号？请
              <a-button type="link" @click="handleRouterChange('Register')">注册</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<style lang="less" scoped>
@import './login.less';
</style>
