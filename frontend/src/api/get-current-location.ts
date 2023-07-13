import axios from "axios";

export const getCurrentLocation = async (lat: number, long: number) => {
  const response = await axios.get(
    "https://api.bigdatacloud.net/data/reverse-geocode-client" +
      `?latitude=${lat}&longitude=${long}&localityLanguage=en`
  );

  return response.data as Record<string, any>;
};
