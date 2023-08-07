import { useMutation } from '@tanstack/react-query'
import { createEvent } from 'src/api/create-event'

export const useCreateEvent = () => {
  return useMutation({
    mutationFn: createEvent,
  })
}
