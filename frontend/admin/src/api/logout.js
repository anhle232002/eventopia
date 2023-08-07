import { axios } from 'src/libs/axios'
import storage from 'src/utils/storage'

export const logout = async () => {
  await axios.get('/auth/logout')

  storage.clear('token')
}
