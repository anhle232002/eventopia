import { axios } from "@/libs/axios";

export const getTicketInfo = async (ticketUrl: string) => {
  if (ticketUrl === "") return null;

  const response = await axios.get(ticketUrl, { baseURL: "" });

  return response.data;
};
