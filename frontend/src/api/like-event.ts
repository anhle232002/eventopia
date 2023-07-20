import { axios } from "@/libs/axios";

export const likeEvent = async (eventId: number, like: boolean) => {
  try {
    const response = await axios.put(`/events/${like ? "look" : "unlook"}/${eventId}`);

    return response.data;
  } catch (error) {
    console.log("Like event unsuccesfully");
  }
};
