import { axios } from "@/libs/axios";

export const processTicket = async (ticketId: string, allow: boolean) => {
  const response = await axios.put(`/tickets/process/${ticketId}`, { allow });

  return response.data;
};
