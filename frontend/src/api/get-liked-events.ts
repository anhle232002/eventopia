import { axios } from "@/libs/axios";

export const getLikedEvents = async () => {
  try {
    const response = await axios.get("/users/events/liked");

    // For O(1) retrieving operation
    const likedEventsSet = new Set(response.data);

    return likedEventsSet;
  } catch (error) {
    return null;
  }
};
