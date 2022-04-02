import { defineStore } from 'pinia';
// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useGlobalStore = defineStore('globalState', {
  state: () => ({
    token: '',
    user: {},
  }),
  getters: {},
  actions: {
    setUser(user: any) {
      this.user = user;
      this.token = user.token;
    },
    resetState() {
      useGlobalStore().$reset();
    },
  },
  persist: true,
});
