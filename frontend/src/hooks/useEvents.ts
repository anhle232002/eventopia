import { getEvents, GetEventsQuery } from "@/api/get-events";
import { useQuery } from "@tanstack/react-query";

export const useEvents = (params: GetEventsQuery, enabled = true) => {
  const paramsKeys = Object.getOwnPropertyNames(params).map(
    (key) => `${key}=${params[key as keyof typeof params]}`
  );
  const queryKey = ["events", ...paramsKeys];

  return useQuery({ queryFn: () => getEvents(params), queryKey, enabled: enabled });
};
