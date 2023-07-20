import { axios } from "@/libs/axios";

export type GetEventsQuery = {
  page?: number;
  online?: number;
  date?: string;
  status?: string;
  search?: string;
  organizer?: string;
  category?: number;
};

export type GetEventResponse = {
  events: any[];
  count: number;
  total: number;
};

export const getEvents = async (query: GetEventsQuery) => {
  const response = await axios.get("/events", {
    params: query,
  });

  const { results, count, total } = response.data;

  return { events: results, count, total } as GetEventResponse;
};
