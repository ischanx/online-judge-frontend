import http from '@/utils/http';

interface IGetProblemListRes {
  count: number;
  list: Problem[];
}
export interface Problem {
  title: string;
  content: string;
  compileTime: number;
  compileMemory: number;
  executeTime: number;
  executeMemory: number;
  fileSize: number;
  id: number;
  createTime: number;
  updateTime: number;
}
export const getProblemList = async () => {
  return (await http.get('/problem/list')) as IGetProblemListRes;
};

export const getProblemById = async (id: number) => {
  return (await http.get('/problem/getById', { id })) as IGetProblemListRes;
};
