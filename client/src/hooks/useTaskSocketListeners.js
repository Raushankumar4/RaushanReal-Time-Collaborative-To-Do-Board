import { useEffect } from "react";
import socket from "../components/sockets/socket";

const useTaskSocketListeners = (
  task,
  setDragGhost,
  setUpdTitle,
  setUpdDesc,
  setWasUpdated
) => {
  useEffect(() => {
    socket.on("task:dragging:start", ({ taskId }) => {
      if (taskId === task._id) setDragGhost({ taskId, x: 0, y: 0 });
    });

    socket.on("task:dragging:move", ({ taskId, x, y }) => {
      if (taskId === task._id) setDragGhost({ taskId, x, y });
    });

    socket.on("task:dragging:end", ({ taskId }) => {
      if (taskId === task._id) setDragGhost(null);
    });

    const handleTaskUpdated = (updatedTask) => {
      if (updatedTask._id === task._id) {
        setUpdTitle(updatedTask.title);
        setUpdDesc(updatedTask.description);
        task.title = updatedTask.title;
        task.description = updatedTask.description;
        task.assignedTo = updatedTask.assignedTo;
        task.priority = updatedTask.priority;
        setWasUpdated(true);
        setTimeout(() => setWasUpdated(false), 1000);
      }
    };

    socket.on("task:updated", handleTaskUpdated);

    return () => {
      socket.off("task:dragging:start");
      socket.off("task:dragging:move");
      socket.off("task:dragging:end");
      socket.off("task:updated", handleTaskUpdated);
    };
  }, [task, setDragGhost, setUpdTitle, setUpdDesc, setWasUpdated]);
};

export default useTaskSocketListeners;
