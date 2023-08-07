import { useQuery } from '@tanstack/react-query'
import { getTicketInfo } from 'src/api/get-ticket-info'

export const useTicketInfo = (url) => {
  return useQuery({
    queryFn: () => getTicketInfo(url),
    queryKey: ['ticket', url],
    staleTime: 0,
    cacheTime: 0,
  })
}
