import { useQuery } from '@tanstack/react-query'
import { getPromotions } from 'src/api/get-promotions'

export const usePromotions = (params = {}, enabled = true) => {
  const paramsKeys = Object.getOwnPropertyNames(params).map((key) => `${key}=${params[key]}`)
  const queryKey = ['promotions', ...paramsKeys]

  return useQuery({ queryFn: () => getPromotions(params), queryKey, enabled: enabled })
}
