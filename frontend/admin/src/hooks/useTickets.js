import { useQuery } from '@tanstack/react-query'
import { getTickets } from 'src/api/get-tickets'

export const useTickets = (params, enabled = true) => {
  const paramsKeys = Object.getOwnPropertyNames(params).map((key) => `${key}=${params[key]}`)
  const queryKey = ['tickets', ...paramsKeys]

  return useQuery({ queryFn: () => getTickets(params), queryKey, enabled: enabled })
}
