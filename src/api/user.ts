import http from '../utils/http';
export const login = async () => {
  return http.post('/user/login', {
    username: 'abc@qq.com',
    password: '123456',
  });
};
