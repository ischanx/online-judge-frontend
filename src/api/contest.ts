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
