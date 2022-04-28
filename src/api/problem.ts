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
  errorSubmit?: number;
  totalSubmit?: number;
}
interface ISubmitReq {
  problemId: number;
  code: string;
  lang: string;
}

interface ISubmitRes {
  submissionId: string;
}

interface IGetSubmissionByIdReq {
  id: string;
}
export const getProblemList = async () => {
  return (await http.get('/problem/list')) as IGetProblemListRes;
};

export const getProblemById = async (id: number) => {
  return (await http.get('/problem/getById', { id })) as IGetProblemListRes;
};

export const submit = async (data: ISubmitReq) => {
  return (await http.post('/submission/submit', data)) as ISubmitRes;
};

export const getSubmissionById = async (data: IGetSubmissionByIdReq) => {
  return await http.post('/submission/check', data);
};

export const getSubmissionList = async (problemId: number) => {
  return await http.post('/submission/listUserSubmission', { problemId });
};

export const getGlobalSubmissionList = async () => {
  return await http.post('/submission/list');
};

export const addProblem = async (data: any) => {
  return await http.post('/problem/add', data);
};

export const updateProblem = async (id: number, data: any) => {
  return await http.post('/problem/update', { id, data });
};

export const deleteProblem = async (id: number) => {
  return await http.post('/problem/delete', { id });
};
