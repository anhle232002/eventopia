import { axios } from "@/libs/axios";

export type CreateEventDto = {
  title: string;
  shortDescription: string;
  description: string;
  startDate: string;
  duration: string;
  totalTickets: number;
  ticketPrice: number;
  city: string;
  country: string;
  isOnlineEvent: string;
  location?: string;
  onlineUrl?: string;
  images: FileList;
  language: string;
};

export const createEvent = async (createEventDto: CreateEventDto) => {
  const formdata = new FormData();

  Object.getOwnPropertyNames(createEventDto).forEach((p: string) => {
    if (createEventDto[p as keyof CreateEventDto] && p !== "images") {
      console.log(p);

      formdata.append(p, String(createEventDto[p as keyof CreateEventDto]));
    }
  });

  formdata.append("images", createEventDto.images[0]);

  const response = await axios.post("/events", formdata);

  return response.data;
};
