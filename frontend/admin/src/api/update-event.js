import { axios } from 'src/libs/axios'

export const updateEvent = async (updateEventDto) => {
  const formdata = new FormData()

  Object.getOwnPropertyNames(updateEventDto).forEach((p) => {
    if (updateEventDto[p] && p !== 'images' && p !== 'eventId' && p !== 'removedImages') {
      formdata.append(p, String(updateEventDto[p]))
    }
  })

  if (updateEventDto.images) formdata.append('images', updateEventDto.images[0])
  if (updateEventDto.removedImages)
    formdata.append('removedImages', JSON.stringify(updateEventDto.removedImages))

  const response = await axios.put(`/events/${updateEventDto.eventId}`, formdata)

  return response.data
}
