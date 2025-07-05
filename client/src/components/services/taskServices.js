import axiosInstance from "./axiosInstance";

export const createTask = async (payload) => {
  const { data } = await axiosInstance.post("task/create", payload);
  return data;
};

export const deleteTask = async (taskId) => {
  const { data } = await axiosInstance.delete(`task/delete/${taskId}`);
  return data;
};

export const fetchTasks = async () => {
  const { data } = await axiosInstance.get("task");
  console.log(data);
  return data;
};

export const smartAssign = async (taskId) => {
  const { data } = await axiosInstance.put(`task/${taskId}/assign-smart`);
  return data;
};

export const fetchLogs = async () => {
  const { data } = await axiosInstance.get("logs");
  return data;
};

export const updateTask = async ({ id, updates }) => {
  const { data } = await axiosInstance.put(`task/update/${id}`, updates);
  return data;
};
