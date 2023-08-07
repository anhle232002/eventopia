import Axios from 'axios'
import storage from 'src/utils/storage'
import { refreshToken } from 'src/api/refresh-token'
import { API_URL } from 'src/config'

function authRequestInterceptor(config) {
  const token = storage.get('token')

  if (token) {
    config.headers.authorization = `Bearer ${token}`
  }

  return config
}

export const axios = Axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

let refreshTokenPromise

axios.interceptors.request.use(authRequestInterceptor)
axios.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // const message = error.response?.data?.message || error.message;
    // useNotificationStore.getState().addNotification({
    //   type: "error",
    //   title: "Error",
    //   message,
    // });

    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest.retrying) {
      originalRequest.retrying = true

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshToken()
      }

      await refreshTokenPromise

      refreshTokenPromise = null

      return axios(originalRequest)
    }

    return Promise.reject(error)
  },
)
