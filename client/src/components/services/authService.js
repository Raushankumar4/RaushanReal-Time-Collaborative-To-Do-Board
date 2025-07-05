import axiosInstance from "./axiosInstance";

export const loginUser = async (payload) => {
  const { data } = await axiosInstance.post("auth/login", payload);
  return data;
};

export const registerUser = async (payload) => {
  const { data } = await axiosInstance.post("auth/regitser", payload);
  return data;
};

export const logout = async () => {
  const { data } = await axiosInstance.get("auth/logout");
  return data;
};
