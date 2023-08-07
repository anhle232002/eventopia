import { useMutation } from '@tanstack/react-query'
import { updateEvent } from 'src/api/update-event'

export const useUpdateEvent = () => {
  return useMutation({
    mutationFn: updateEvent,
  })
}
