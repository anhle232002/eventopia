import { useQuery } from '@tanstack/react-query'
import { getEvents } from 'src/api/get-events'

export const useEvents = (params, enabled = true) => {
  const paramsKeys = Object.getOwnPropertyNames(params).map((key) => `${key}=${params[key]}`)
  const queryKey = ['events', ...paramsKeys]

  return useQuery({ queryFn: () => getEvents(params), queryKey, enabled: enabled })
}
