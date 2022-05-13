import http from '../utils/http';

export const getJudgeList = async () => {
  return (await http.get('/judge/list')) as any;
};

export const updateJudge = async (id: string, data: any) => {
  return (await http.post('/judge/update', { id, data })) as any;
};

export const addJudge = async (url: string) => {
  return (await http.post('/judge/add', { judgeURL: url })) as any;
};

export const removeJudge = async (id: string) => {
  return (await http.post('/judge/remove', { id })) as any;
};
