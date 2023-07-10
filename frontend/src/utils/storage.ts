const storage = {
  get: (key: string) => {
    return JSON.parse(window.localStorage.getItem(key) as string);
  },
  set: (key: string, value: string) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  clear: (key: string) => {
    window.localStorage.removeItem(key);
  },
};

export default storage;
