<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import 'ant-design-vue/es/message/style/index.css';
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons-vue';
import Logo from '@/components/Logo/index.vue';
import { register, sendCodeByEmail } from '@/api/user';
import message from 'ant-design-vue/es/message';
import { isValidEmail } from '@/utils/validator';
import { RuleObject } from 'ant-design-vue/es/form';

interface IRegisterForm {
  username: string;
  password: string;
  email: string;
  code: string;
}

const router = useRouter();
const formState = reactive<IRegisterForm>({
  username: '',
  password: '',
  email: '',
  code: '',
});
const formInit = () => {
  Object.assign(formState, {
    username: '',
    password: '',
    email: '',
    code: '',
  });
  // 重置验证码倒计时
  countDownLoading(5);
};

const handleRouterChange = (name: string) => {
  router.push({ name });
};

// 发送验证码
const codeLoading = ref(0);
let codeTimer: number;
const countDownLoading = (time?: number) => {
  if (codeTimer) clearTimeout(codeTimer);
  time && (codeLoading.value = time);
  codeLoading.value && codeLoading.value--;
  codeTimer = window.setTimeout(() => {
    countDownLoading();
  }, 1000);
};
onBeforeUnmount(() => {
  clearTimeout(codeTimer); // 退出前清除定时器
});
const handleCodeButtonClick = async () => {
  countDownLoading(60);
  try {
    await sendCodeByEmail({ email: formState.email });
    message.success(`成功发送验证码到邮箱[ ${ formState.email } ]`);
  } catch (error: any) {
    if (error.message.includes('邮箱已注册')) formInit();
  }
};

// 校验各项信息是否填完
const canRegister = computed(() => {
  return Boolean(formState.email && formState.password && formState.code);
});
// 校验合法的邮箱
const validateEmail = async (_rule: RuleObject, value: string) => {
  if (isValidEmail(value)) {
    return Promise.resolve();
  } else {
    return Promise.reject(new Error('请输入合法的邮箱地址'));
  }
};
// 校验合法的密码
const validatePassword = async (_rule: RuleObject, value: string) => {
  if (value === '') {
    return Promise.reject(new Error('密码不能为空'));
  } else {
    if (value.length < 6) return Promise.reject(new Error('密码长度为6~20位'));
  }
  return Promise.resolve();
};

// 点击注册按钮
const handleRegisterBtnClick = async () => {
  formState.username = formState.email;
  try {
    const res = await register(formState);
    if (res) {
      message.success('注册成功，自动跳转到登录页面', 5);
      handleRouterChange('Login');
    }
  } catch (error: any) {
    if (error.message === '验证码错误') {
      formState.code = '';
    } else {
      formInit();
    }
  }

};
</script>

<template>
  <a-row align="middle" justify="center" style="height: 100%; background-color: #f6f6f6" type="flex">
    <a-col :lg="16" :md="18" :sm="20" :xl="14" :xs="22">
      <div class="register">
        <div class="register-left side">
          <Logo class="logo"/>
          <img src="/register1.png"/>
        </div>
        <div class="register-right side">
          <div class="text">填写信息完成注册^_^</div>
          <a-form :model="formState" autocomplete="off" name="basic" @finish="handleRegisterBtnClick">
            <!--            <a-form-item name="username" :rules="[{ required: true, message: '账号不能为空' }]">-->
            <!--              <a-input v-model:value="formState.username" placeholder="请输入账号名" size="large">-->
            <!--                <template #prefix>-->
            <!--                  <UserOutlined />-->
            <!--                </template>-->
            <!--              </a-input>-->
            <!--            </a-form-item>-->
            <a-form-item :rules="[{ required: true, validator: validateEmail, trigger: 'change' }]" name="email">
              <a-input v-model:value="formState.email" maxlength="40" placeholder="请输入邮箱" size="large">
                <template #prefix>
                  <MailOutlined/>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item :rules="[{ required: true, validator: validatePassword, trigger: 'change' }]" name="password">
              <a-input-password v-model:value="formState.password" maxlength="20" placeholder="请输入密码" size="large">
                <template #prefix>
                  <LockOutlined/>
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item :rules="[{ required: true, message: '验证码不能为空' }]" name="code">
              <a-input v-model:value="formState.code" maxlength="6" placeholder="请输入验证码" size="large">
                <template #prefix>
                  <SafetyOutlined/>
                </template>
                <template #suffix>
                  <a-button
                    :disabled="!isValidEmail(formState.email)"
                    :loading="codeLoading"
                    @click="handleCodeButtonClick"
                  >
                    {{ codeLoading ? `${ codeLoading } s` : '发送验证码' }}
                  </a-button>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button :disabled="!canRegister" block html-type="submit" shape="round" size="large" type="primary">
                创建新账号
              </a-button>
            </a-form-item>
            <a-form-item>
              已有账号？请
              <a-button type="link" @click="handleRouterChange('Login')">登录</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<style lang="less" scoped>
@import './register.less';
</style>
