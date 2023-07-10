import axios from "axios";

export const getLocations = async (search: string) => {
  if (!search || search === "") return [];

  const response = await axios.get(
    `https://api.locationiq.com/v1/autocomplete?key=${
      import.meta.env.VITE_LOCATION_ACCESS_TOKEN
    }&q=${search}`
  );

  return response.data as any[];
};
