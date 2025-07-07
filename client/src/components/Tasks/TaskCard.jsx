import { useEffect, useState } from "react";
import GhostTaskCard from "../Tasks/GhostTaskCard";
import TaskCardDisplay from "../Tasks/TaskCardDisplay";
import UpdateTask from "../Tasks/UpdateTask";
import useTaskSocketListeners from "../../hooks/useTaskSocketListeners";
import useTaskMutations from "../../hooks/useTaskMutations";
import "./TaskCard.css";
import socket from "../sockets/socket";

const TaskCard = ({ task, onDragStart, shouldFlip }) => {
  const [editMode, setEditMode] = useState(false);
  const [wasUpdated, setWasUpdated] = useState(false);
  const [updTitle, setUpdTitle] = useState(task.title);
  const [updDesc, setUpdDesc] = useState(task.description);
  const [isFlipping, setIsFlipping] = useState(false);
  const [dragGhost, setDragGhost] = useState(null);

  const { assignMutation, deleteMutation, updateMutation } = useTaskMutations(task, setEditMode);

  useTaskSocketListeners(task, setDragGhost, setUpdTitle, setUpdDesc, setWasUpdated);

  useEffect(() => {
    if (shouldFlip) {
      setIsFlipping(true);
      const timeout = setTimeout(() => setIsFlipping(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [shouldFlip]);

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      id: task._id,
      updates: {
        title: updTitle.trim(),
        description: updDesc.trim(),
        lastEditedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <>
      {dragGhost?.taskId === task._id && (
        <GhostTaskCard task={task} x={dragGhost.x} y={dragGhost.y} />
      )}

      <div
        className={`task-card ${isFlipping ? "flip" : ""} ${wasUpdated ? "updated" : ""}`}
        draggable
        onDragStart={(e) => {
          onDragStart(e, task);
          socket.emit("task:dragging:start", { taskId: task._id });
        }}
        onDrag={(e) =>
          socket.emit("task:dragging:move", {
            taskId: task._id,
            x: e.clientX,
            y: e.clientY,
          })
        }
        onDragEnd={() => socket.emit("task:dragging:end", { taskId: task._id })}
      >
        {editMode ? (
          <UpdateTask
            setEditMode={setEditMode}
            updTitle={updTitle}
            updDesc={updDesc}
            isUpdating={updateMutation.isPending}
            setUpdDesc={setUpdDesc}
            handleUpdateSubmit={handleUpdateSubmit}
            setUpdTitle={setUpdTitle}
          />
        ) : (
          <TaskCardDisplay
            task={task}
            onEditClick={() => setEditMode(true)}
            onDelete={() => deleteMutation.mutate()}
            onAssign={() => assignMutation.mutate()}
            isDeleting={deleteMutation.isPending}
            isAssigning={assignMutation.isPending}
          />
        )}
      </div>
    </>
  );
};

export default TaskCard;