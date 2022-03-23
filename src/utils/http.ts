import axiosInstance from './axios';
import { AxiosRequestConfig } from 'axios';
import { IResponse } from '@/const/app';

/**
 * 转化对象为formdata格式
 * @param data 对象
 */
function dataToFormData(data?: object | FormData) {
  const formData = new FormData();
  if (data === null || data === undefined) {
    return formData;
  }
  if (data instanceof FormData) {
    return data;
  }
  if (typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }
  return formData;
}

/**
 * 请求方法类：封装axios实例
 */
class http {
  static get(url: string, data?: object): Promise<IResponse | object> {
    return axiosInstance.get(url, {
      params: data,
    });
  }

  static post(url: string, data?: object, config?: AxiosRequestConfig): Promise<IResponse | object> {
    return axiosInstance.post(url, data, config);
  }

  static put(url: string, data?: object, config?: AxiosRequestConfig): Promise<IResponse | object> {
    return axiosInstance.put(url, data, config);
  }

  static postByFormData(
    url: string,
    data?: object | FormData,
    config?: AxiosRequestConfig
  ): Promise<IResponse | object> {
    data = data instanceof FormData ? data : dataToFormData(data);
    return axiosInstance.post(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    });
  }

  static putByFormData(
    url: string,
    data?: object | FormData,
    config?: AxiosRequestConfig
  ): Promise<IResponse | object> {
    data = data instanceof FormData ? data : dataToFormData(data);
    return axiosInstance.put(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    });
  }

  static delete(url: string, config?: AxiosRequestConfig): Promise<IResponse | object> {
    return axiosInstance.delete(url, config);
  }

  static patch(url: string, data?: object, config?: AxiosRequestConfig): Promise<IResponse | object> {
    return axiosInstance.patch(url, data, config);
  }
}
export default http;
