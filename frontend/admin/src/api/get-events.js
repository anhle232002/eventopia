import { axios } from 'src/libs/axios'

export const getEvents = async (query) => {
  const response = await axios.get('/organizers/events', {
    params: query,
  })

  const { results, count, total } = response.data

  return { events: results, count, total }
}
