import { axios } from "@/libs/axios";

export type BuyTicketDto = {
  customerEmail: string;
  customerName: string;
  customerCID: string;
  quantity: string;
};

export const buyTicket = async (eventId: number, buyTicketDto: BuyTicketDto) => {
  console.log(buyTicketDto);

  const response = await axios.post(`/payment/events/${eventId}/tickets`, buyTicketDto);

  return response.data;
};
