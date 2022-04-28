/* eslint-disable no-unused-vars */
export enum MENU_KEYS {
  PROBLEM,
  CONTEST,
  STATUS,
  ADMIN,
}

export interface IResponse {
  code: number;
  message: string;
  data?: object;
}

export enum PROBLEM_TABS_KEYS {
  CONTENT,
  SUBMISSION,
}

export enum CODE_LANGUAGES {
  C = 'c',
  CPP = 'cpp',
}

export interface GlobalError {
  code: number;
  message: string;
}

export enum PROBLEM_DIFFICULTY {
  EASY,
  MEDUIM,
  HARD,
}
