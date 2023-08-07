import { axios } from 'src/libs/axios'

export const getTickets = async (query) => {
  const response = await axios.get('/organizers/tickets', {
    params: query,
  })

  const { results, count, total } = response.data

  return { tickets: results, count, total }
}
