import { axios } from "@/libs/axios";

export const getEvent = async (id: number) => {
  const response = await axios.get(`/events/${id}`);

  const { result } = response.data;

  return result;
};
