import { axios } from 'src/libs/axios'

export const processTicket = async (ticketId, allow) => {
  const response = await axios.put(`/tickets/process/${ticketId}`, { allow })

  return response.data
}
