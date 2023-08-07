import { axios } from 'src/libs/axios'

export const getTicketInfo = async (ticketUrl) => {
  if (ticketUrl === '') return null

  const response = await axios.get(ticketUrl, { baseURL: '' })

  return response.data
}
