interface ItemOptions {
  expire?: number;
}
class Storage {
  private id: string;
  constructor(id?: string) {
    this.id = id || 'default';
  }

  setLocalItem(name: string, value: string, options?: ItemOptions): void {
    if (options?.expire) {
      localStorage.setItem(`${name}__expire`, String(Date.now() + options.expire));
    }
    localStorage.setItem(name, value);
  }

  getLocalItem(name: string): string | null {
    const expireTime = Number(localStorage.getItem(`${name}__expire`) || 0);
    if (Date.now() > expireTime && expireTime !== 0) {
      localStorage.removeItem(name);
      localStorage.removeItem(`${name}__expire`);
      return null;
    }
    return localStorage.getItem(name);
  }

  setSessionItem(name: string, value: string): void {
    return sessionStorage.setItem(name, value);
  }

  getSessionItem(name: string): string | null {
    return sessionStorage.getItem(name);
  }
}
export default new Storage();
