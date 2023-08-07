import { axios } from 'src/libs/axios'

export const createEvent = async (createEventDto) => {
  const formdata = new FormData()

  Object.getOwnPropertyNames(createEventDto).forEach((p) => {
    if (createEventDto[p] && p !== 'images') {
      console.log(p)

      formdata.append(p, String(createEventDto[p]))
    }
  })

  formdata.append('imageFiles', createEventDto.images[0])

  const response = await axios.post('/events', formdata)

  return response.data
}
