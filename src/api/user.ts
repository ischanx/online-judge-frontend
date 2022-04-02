import http from '../utils/http';

interface ILoginReq {
  username: string;
  password: string;
}

interface ILoginRes {
  token: string;
  message: string;
}

interface IRegisterReq {
  username: string;
  password: string;
  code: string;
  email: string;
}

interface IRegisterRes {
  id: string;
  message: string;
}

export const login = async (data: ILoginReq) => {
  return (await http.post('/user/login', data)) as Promise<ILoginRes>;
};

export const register = async (data: IRegisterReq) => {
  return (await http.post('/user/register', data)) as Promise<IRegisterRes>;
};

export const sendCodeByEmail = async (data: { email: string }) => {
  return (await http.post('/user/sendCode', data)) as Promise<{ message: string }>;
};
