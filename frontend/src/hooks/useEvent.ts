import { getEvent } from "@/api/get-event";
import { useQuery } from "@tanstack/react-query";

export const useEvent = (id: number) => {
  return useQuery({ queryFn: () => getEvent(id), queryKey: ["event", id] });
};
