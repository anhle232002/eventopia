import { axios } from "@/libs/axios";

interface SignupDto {
  email: string;
  givenName: string;
  familyName: string;
  password: string;
  isOrganizer: boolean;
  organizer?: {
    email: string;
    name: string;
    phoneNumber: string;
    description: string;
  };
}

export const signUp = async (data: SignupDto) => {
  const response = await axios.post("/auth", data);

  return response.data;
};
