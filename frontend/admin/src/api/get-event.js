import { axios } from 'src/libs/axios'

export const getEvent = async (id) => {
  const response = await axios.get(`/events/${id}`)

  const { result } = response.data

  return result
}
