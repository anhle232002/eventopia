import { axios } from 'src/libs/axios'

export const createPromotion = async (createPromoDto) => {
  const response = await axios.post('/promo', createPromoDto)

  return response.data
}
