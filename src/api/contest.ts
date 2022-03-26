import http from '../utils/http';

type IGetContestListRes = Contest[];

export interface Contest {
  title: string;
  description: string;
  beginTime: number;
  endTime: number;
  id: number;
  createTime: number;
  updateTime: number;
}
export const getContestList = async () => {
  return (await http.get('/contest/listAll')) as Promise<IGetContestListRes>;
};

export const getContestById = async (id: number) => {
  return await http.get('/contest/listOne', { id });
};

export const getContestProblem = async ({ problemNumber, contestId }: { problemNumber: number; contestId: number }) => {
  return await http.get('/contest/getContestProblem', { problemNumber, contestId });
};

export const getContestRankById = async (id: number) => {
  return await http.get('/contest/rank', { id });
};

export const submitContestProblem = async (data: any) => {
  return await http.post('/submission/submit', data);
};

export const getContestSubmissionById = async (data: any) => {
  return await http.get('/contest/check', data);
};

export const getContestSubmissionList = async ({ problemId, contestId }: { problemId: number; contestId: number }) => {
  return await http.post('/contest/listUserSubmission', { problemId, contestId });
};
