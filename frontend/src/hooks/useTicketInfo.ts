import { getTicketInfo } from "@/api/get-ticket-info";
import { useQuery } from "@tanstack/react-query";

export const useTicketInfo = (url: string) => {
  return useQuery({ queryFn: () => getTicketInfo(url), queryKey: ["ticket", url] });
};
