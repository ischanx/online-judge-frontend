<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/user';
import Storage from '@/utils/storage';
import message from 'ant-design-vue/es/message';
import 'ant-design-vue/es/message/style/index.css';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
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
    await router.push({ path: '/' });
  }
};
</script>

<template>
  <a-row type="flex" justify="center" align="middle" style="height: 100%">
    <a-col :xs="22" :sm="16" :md="16" :lg="8" :xl="8">
      <div class="login">
        <a-form :model="formState" name="basic" autocomplete="off" @finish="handleLoginBtnClick">
          <a-form-item name="username" :rules="[{ required: true, message: '账号不能为空' }]">
            <a-input v-model:value="formState.username"  placeholder="请输入邮箱">
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password" :rules="[{ required: true, message: '密码不能为空' }]">
            <a-input-password v-model:value="formState.password" placeholder="请输入密码">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" block>登录</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="link">注册</a-button>
            <a-button type="link">忘记密码</a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-col>
  </a-row>
</template>

<style scoped>
@import './login.less';
</style>
