import { useMutation } from '@tanstack/react-query'
import { createPromotion } from 'src/api/create-promotion'

export const useCreatePromo = () => {
  return useMutation({
    mutationFn: createPromotion,
  })
}
