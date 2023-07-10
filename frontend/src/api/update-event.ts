import { axios } from "@/libs/axios";
import { CreateEventDto } from "./create-event";

export type UpdateEventDto = Partial<CreateEventDto> & { eventId: string; removedImages: [] };

export const updateEvent = async (updateEventDto: UpdateEventDto) => {
  const formdata = new FormData();

  Object.getOwnPropertyNames(updateEventDto).forEach((p: string) => {
    if (
      updateEventDto[p as keyof UpdateEventDto] &&
      p !== "images" &&
      p !== "eventId" &&
      p !== "removedImages"
    ) {
      formdata.append(p, String(updateEventDto[p as keyof UpdateEventDto]));
    }
  });

  if (updateEventDto.images) formdata.append("images", updateEventDto.images[0]);
  if (updateEventDto.removedImages)
    formdata.append("removedImages", JSON.stringify(updateEventDto.removedImages));

  const response = await axios.put(`/events/${updateEventDto.eventId}`, formdata);

  return response.data;
};
