import { axios } from "@/libs/axios";
import storage from "@/utils/storage";

export const loginWithGoogle = async () => {
  const url = import.meta.env.DEV
    ? "http://localhost:3000/api/auth/google"
    : `${import.meta.env.VITE_API_URL}/auth/google`;
  window.open(url, "_self");
};

export const loginLocal = async ({ email, password }: { email: string; password: string }) => {
  const response = await axios.post("/auth/login", { username: email, password });

  const accessToken = response.data.accessToken;
  storage.set("token", accessToken);

  return response.data;
};

export const AUTH_STRATEGIES: Record<string, (data?: any) => Promise<any>> = {
  google: loginWithGoogle,
  local: (data: { email: string; password: string }) => loginLocal(data),
};
