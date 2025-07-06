import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask, smartAssign, updateTask } from '../components/services/taskServices';
import socket from '../components/sockets/socket';
import toast from 'react-hot-toast';
import UpdateTask from './Tasks/UpdateTask';
import Button from './resuable/Button';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { FiTag, FiFileText, FiUser, FiTrendingUp } from 'react-icons/fi';
import "./TaskCard.css"

const TaskCard = ({ task, onDragStart, shouldFlip }) => {
  const [editMode, setEditMode] = useState(false);
  const [updTitle, setUpdTitle] = useState(task.title);
  const [updDesc, setUpdDesc] = useState(task.description);
  const [isFlipping, setIsFlipping] = useState(false);
  const queryClient = useQueryClient();


  useEffect(() => {
    if (shouldFlip) {
      setIsFlipping(true);
      const timeout = setTimeout(() => setIsFlipping(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [shouldFlip]);

  const { mutate: assign, isPending: isAssigning } = useMutation({
    mutationFn: () => smartAssign(task._id),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      socket.emit("task:updated");
      toast.success("Task assigned");
    },
    onError: () => toast.error("Assignment failed"),
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
    onError: () => toast.error("Update failed"),
  });

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    edit({
      id: task?._id,
      updates: {
        title: updTitle.trim(),
        description: updDesc.trim(),
        lastEditedAt: new Date().toISOString(),
      }
    });
  };

  return (
    <div
      className={`task-card ${isFlipping ? 'flip' : ''}`}
      style={{ opacity: 1, position: 'relative' }}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
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
            <Button
              onClick={() => setEditMode(true)}
              type="primary"
            >
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



          <Button
            type="primary"
            onClick={() => assign()}
            disabled={isAssigning}

          >
            {isAssigning ? 'Assigning...' : 'Smart Assign'}
          </Button>

        </>
      )}
    </div>

  );
};

export default TaskCard;
