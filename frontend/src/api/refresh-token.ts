import { axios } from "@/libs/axios";
import storage from "@/utils/storage";

export const refreshToken = async () => {
  const response = await axios.get("/auth/refresh");

  const { accessToken } = response.data;

  storage.set("token", accessToken);
  console.log(accessToken);

  return response.data;
};
