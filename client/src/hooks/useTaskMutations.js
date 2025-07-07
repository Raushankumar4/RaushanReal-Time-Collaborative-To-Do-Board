import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteTask,
  smartAssign,
  updateTask,
} from "../components/services/taskServices";
import toast from "react-hot-toast";
import socket from "../components/sockets/socket";

const useTaskMutations = (task, setEditMode) => {
  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: () => smartAssign(task?._id),
    onSuccess: (updatedTask) => {
      toast.success("Task assigned");
      queryClient.invalidateQueries(["tasks"]);
      socket.emit("task:updated", updatedTask);
    },
    onError: (error) =>
      toast.error(error?.response?.data?.message || "Assignment failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task._id),
    onSuccess: () => {
      toast.success("Task deleted!");
      queryClient.invalidateQueries(["tasks"]);
      socket.emit("task:deleted", { taskId: task._id });
    },
    onError: () => toast.error("Failed to delete task"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => updateTask({ id, updates }),
    onSuccess: (_, { id, updates }) => {
      const updatedTask = { _id: id, ...updates };
      toast.success("Task updated!");
      queryClient.invalidateQueries(["tasks"]);
      socket.emit("task:updated", updatedTask);
      setEditMode(false);
    },
    onError: (error) =>
      toast.error(error?.response?.data?.message || "Update failed"),
  });

  return {
    assignMutation,
    deleteMutation,
    updateMutation,
  };
};

export default useTaskMutations;
