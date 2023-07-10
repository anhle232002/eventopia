import { axios } from "@/libs/axios";

export type FindTicketsDto = {
  email: string;
  cid: string;
  eventId: string;
};

export const findTickets = async (findTicketsDto: FindTicketsDto) => {
  const response = await axios.post(`/tickets`, findTicketsDto);

  return response.data;
};
