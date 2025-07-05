import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask, smartAssign, updateTask } from '../components/services/taskServices';
import socket from '../components/sockets/socket';
import toast from 'react-hot-toast';
import InputField from './resuable/InputField';
import UpdateTask from './Tasks/UpdateTask';

const TaskCard = ({ task }) => {
  const [editMode, setEditMode] = useState(false);
  const [updTitle, setUpdTitle] = useState(task.title);
  const [updDesc, setUpdDesc] = useState(task.description);
  const queryClient = useQueryClient();

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "TASK",
    item: { id: task._id, currentStatus: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [task]);


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
      ref={dragRef}
      className="task-card"
      style={{ opacity: isDragging ? 0.5 : 1, position: 'relative' }}
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
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          {task.assignedTo ? (
            <p style={{ color: "green", fontWeight: "bold" }}>
              👤 Assigned to: {task.assignedTo.fullName}
            </p>
          ) : (
            <p style={{ color: "red" }}>👤 Unassigned</p>
          )}
          <p>🔥 {task.priority}</p>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            {!task.assignedTo && (
              <button onClick={() => assign()} disabled={isAssigning}>
                {isAssigning ? "Assigning..." : "Smart Assign"}
              </button>
            )}

            {task?.createdBy && (
              <>
                <button onClick={() => setEditMode(true)}>
                  ✏️ Edit
                </button>
                <button
                  onClick={() => remove()}
                  disabled={isDeleting}
                  style={{ background: 'red', color: '#fff' }}
                >
                  {isDeleting ? "Deleting..." : "🗑 Delete"}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
