import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, smartAssign, updateTask } from "../components/services/taskServices";
import socket from "../components/sockets/socket";
import toast from "react-hot-toast";
import UpdateTask from "./Tasks/UpdateTask";
import Button from "./resuable/Button";
import { FiEdit, FiTrash2, FiTag, FiFileText, FiUser, FiTrendingUp } from "react-icons/fi";
import "./TaskCard.css";

const TaskCard = ({ task, onDragStart, shouldFlip }) => {
  const [editMode, setEditMode] = useState(false);
  const [updTitle, setUpdTitle] = useState(task.title);
  const [updDesc, setUpdDesc] = useState(task.description);
  const [isFlipping, setIsFlipping] = useState(false);
  const [dragGhost, setDragGhost] = useState(null);
  const queryClient = useQueryClient();


  useEffect(() => {
    if (shouldFlip) {
      setIsFlipping(true);
      const timeout = setTimeout(() => setIsFlipping(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [shouldFlip]);

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

    return () => {
      socket.off("task:dragging:start");
      socket.off("task:dragging:move");
      socket.off("task:dragging:end");
    };
  }, [task._id]);

  const { mutate: assign, isPending: isAssigning } = useMutation({
    mutationFn: () => smartAssign(task._id),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      socket.emit("task:updated");
      toast.success("Task assigned");
    },
    onError: (error) => toast.error(error?.response?.data?.message || "Assignment failed"),
  });

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteTask(task._id),
    onSuccess: () => {
      toast.success("Task deleted!");
      queryClient.invalidateQueries(["tasks"]);
      socket.emit("task:deleted");
    },
    onError: () => toast.error("Failed to delete task"),
  });

  const { mutate: edit, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, updates }) => updateTask({ id, updates }),
    onSuccess: () => {
      toast.success("Task updated!");
      queryClient.invalidateQueries(["tasks"]);
      socket.emit("task:updated");
      setEditMode(false);
    },
    onError: (error) => toast.error(error?.response?.data?.message || "Update failed"),
  });

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    edit({
      id: task?._id,
      updates: {
        title: updTitle.trim(),
        description: updDesc.trim(),
        lastEditedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <>

      {dragGhost && dragGhost.taskId === task._id && (
        <div
          className="task-card ghost"
          style={{
            position: "fixed",
            left: dragGhost.x + 10,
            top: dragGhost.y + 10,
            opacity: 0.8,
            pointerEvents: "none",
            background: "#fff",
            border: "1px dashed #ccc",
            padding: "10px",
            borderRadius: "8px",
            zIndex: 1000,
            width: "220px",
          }}
        >
          <strong>{task.title}</strong>
          <p style={{ fontSize: "13px", marginTop: "4px" }}>{task.description}</p>
        </div>
      )}


      <div
        className={`task-card ${isFlipping ? "flip" : ""}`}
        style={{ opacity: 1, position: "relative" }}
        draggable
        onDragStart={(e) => {
          onDragStart(e, task);
          socket.emit("task:dragging:start", { taskId: task._id });
        }}
        onDrag={(e) => {
          socket.emit("task:dragging:move", {
            taskId: task._id,
            x: e.clientX,
            y: e.clientY,
          });
        }}
        onDragEnd={() => {
          socket.emit("task:dragging:end", { taskId: task._id });
        }}
      >
        {editMode ? (
          <UpdateTask
            setEditMode={setEditMode}
            updTitle={updTitle}
            updDesc={updDesc}
            isUpdating={isUpdating}
            setUpdDesc={setUpdDesc}
            handleUpdateSubmit={handleUpdateSubmit}
            setUpdTitle={setUpdTitle}
          />
        ) : (
          <>
            <div className="btn-icon-group">
              <Button onClick={() => setEditMode(true)} type="primary">
                <FiEdit />
              </Button>
              <Button
                aria-label="Delete task"
                type="danger"
                onClick={() => remove()}
                disabled={isDeleting}
              >
                <FiTrash2 />
              </Button>
            </div>

            <h4 className="task-title">
              <FiTag className="icon" /> {task.title}
            </h4>

            <p className="task-desc">
              <FiFileText className="icon" /> {task.description}
            </p>

            {task.assignedTo ? (
              <p className="assigned green">
                <FiUser className="icon" /> Assigned to: {task.assignedTo.fullName}
              </p>
            ) : (
              <p className="assigned red">
                <FiUser className="icon" /> Unassigned
              </p>
            )}

            <p className="priority">
              <FiTrendingUp className="icon" /> {task.priority}
            </p>

            <Button type="primary" onClick={() => assign()} disabled={isAssigning}>
              {isAssigning ? "Assigning..." : "Smart Assign"}
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default TaskCard;
