const storage = {
  get: (key) => {
    return JSON.parse(window.localStorage.getItem(key))
  },
  set: (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  },
  clear: (key) => {
    window.localStorage.removeItem(key)
  },
}

export default storage
