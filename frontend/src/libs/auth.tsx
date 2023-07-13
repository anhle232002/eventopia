import { getUser } from "@/api/get-user";
import { AUTH_STRATEGIES } from "@/api/login";
import { logout } from "@/api/logout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./query-client";

async function loadUser() {
  try {
    const data = await getUser();

    return data;
  } catch (error) {
    console.log(error);
  }

  return null;
}

export const useUser = () => {
  return useQuery({
    queryFn: loadUser,
    queryKey: ["auth", "user"],
    useErrorBoundary: true,
  });
};

export const useLogin = (strategy: string) => {
  const strategyFn = AUTH_STRATEGIES[strategy];

  if (!strategyFn) {
    throw new Error("Auth Strategy currently is not supported");
  }

  return useMutation({
    mutationFn: strategyFn,
    // onSuccess(data) {
    //   queryClient.setQueryData(["auth", "user"], data);
    // },
    onError(error) {
      console.log(error);
    },
  });
};

// export const useRegister = () => {
//   return useMutation({
//     mutationFn: ,
//     onSuccess(data) {
//       queryClient.setQueryData(["auth", "user"], data);
//     },
//     onError(error) {
//       console.log(error);
//     },
//   });
// };

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    onSuccess() {
      queryClient.setQueryData(["auth", "user"], null);
    },
  });
};
