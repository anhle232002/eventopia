import { axios } from 'src/libs/axios'

export const getPromotions = async (query) => {
  const response = await axios.get(`/promo`, {
    params: query,
  })

  const { results, total } = response.data

  return { promos: results, total }
}
