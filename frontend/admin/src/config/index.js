export const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : process.env.REACT_APP_API_URL
