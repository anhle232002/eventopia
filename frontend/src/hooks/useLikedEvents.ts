import { getLikedEvents } from "@/api/get-liked-events";
import { useQuery } from "@tanstack/react-query";

export const useLikedEvents = () => {
  return useQuery({
    queryKey: ["events", "liked"],
    queryFn: getLikedEvents,
  });
};
