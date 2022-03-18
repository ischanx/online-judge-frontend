import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_URL } from '../config/server';

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
  (response: AxiosResponse) => {
    // 请求成功
    const res = response.data;
    const code = response.status;
    const realData = res.data || 'request success,but no response data';
    if (res.code === 1) {
      return Promise.reject(res.message);
    }
    return res.code === 200 || code === 200 ? Promise.resolve(realData) : Promise.reject(res.message);
  },
  // 请求失败
  (error) => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      // errorHandle(response.status, response.data.message)
      return Promise.reject(response);
    }
    // 处理断网的情况
    if (!window.navigator.onLine) {
      // MessageBox('网络已断开')
    } else {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default instance;
