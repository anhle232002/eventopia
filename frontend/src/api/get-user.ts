import { axios } from "@/libs/axios";

export const getUser = async () => {
  const response = await axios.get("/auth");

  const { user } = response.data;

  return user;
};
