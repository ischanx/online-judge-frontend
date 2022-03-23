import http from '../utils/http';

interface ILoginReq {
  username: string;
  password: string;
}
interface ILoginRes {
  token: string;
  message: string;
}
export const login = async (data: ILoginReq) => {
  return (await http.post('/user/login', data)) as Promise<ILoginRes>;
};
