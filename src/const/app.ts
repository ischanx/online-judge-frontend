/* eslint-disable no-unused-vars */
export enum MENU_KEYS {
  PROBLEM,
  CONTEST,
  STATUS,
}

export interface IResponse {
  code: number;
  message: string;
  data?: object;
}
