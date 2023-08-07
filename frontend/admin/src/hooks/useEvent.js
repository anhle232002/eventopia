import { useQuery } from '@tanstack/react-query'
import { getEvent } from 'src/api/get-event'

export const useEvent = (id) => {
  return useQuery({ queryFn: () => getEvent(id), queryKey: ['event', id], staleTime: 0 })
}
