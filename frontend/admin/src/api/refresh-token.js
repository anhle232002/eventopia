import { axios } from 'src/libs/axios'
import storage from 'src/utils/storage'

export const refreshToken = async () => {
  const response = await axios.get('/auth/refresh')

  const { accessToken } = response.data

  storage.set('token', accessToken)

  return response.data
}
