// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DEVELOPMENT_URL, PRODUCTION_URL } from './config.js';

const BACKEND_URL = import.meta.env.MODE === 'development' ? DEVELOPMENT_URL : PRODUCTION_URL;
if (!BACKEND_URL) {
  throw Error('[CONFIG] 后端地址错误');
}
export const BASE_URL = BACKEND_URL;
