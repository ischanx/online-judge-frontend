import http from '@/utils/http';

export const uploadFile = async (file: File) => {
  const data = new FormData();
  data.append('file', file);
  return (await http.postByFormData('/file/upload', data, { timeout: 0 })) as any;
};

export const getUnzip = async (file: string) => {
  return (await http.post('/file/unzip', { file })) as any;
};
