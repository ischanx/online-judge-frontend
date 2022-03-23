import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_URL } from '@/config/backend';
import { IResponse } from '@/const/app';
import message from 'ant-design-vue/es/message';
import 'ant-design-vue/es/message/style/index.css';
import router from '@/router';
// 创建axios实例
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});
// 设置请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 设置请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    const token = localStorage.getItem('token') || '';
    config.headers = {};
    token && (config.headers.Authorization = `Bearer ${token}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// 设置响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse): Promise<IResponse | object> => {
    // 请求成功
    const res: IResponse = response.data;
    const code = res.code;
    if (![200, 0].includes(code)) {
      if (res.message) message.error(`[${res.code}] ${res.message}`);
      return Promise.reject(res || {});
    }
    return Promise.resolve(res.data || {});
  },
  // 请求失败
  (error) => {
    const { response } = error;
    if (!response) {
      message.error(error.toString());
    } else if (response.status === 401) {
      if (response.data.message) message.error('用户信息过期，请重新登录');
      router.replace({
        name: 'Login',
      });
      throw response.data;
    }
  }
);

export default instance;
