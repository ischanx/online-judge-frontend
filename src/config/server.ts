const PRODUCTION_URL = '//oj.chanx.tech/api';
const DEVELOPMENT_URL = '//127.0.0.1:8001/api';
export const BASE_URL: string = import.meta.env.MODE === 'development' ? DEVELOPMENT_URL : PRODUCTION_URL;
