export const loginWithGoogle = async () => {
  window.open("http://localhost:3000/api/auth/google", "_self");
};

export const loginLocal = async () => {
  return "";
};

export const AUTH_STRATEGIES: Record<string, () => Promise<any>> = {
  google: loginWithGoogle,
  local: loginLocal,
};
