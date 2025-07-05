import React, { useState } from 'react';
import TaskCard from './TaskCard';
import axiosInstance from '../components/services/axiosInstance';
import socket from '../components/sockets/socket';
import './BoardColumn.css';

const BoardColumn = ({ status, tasks, onTaskMoved }) => {
  const [flippedTaskId, setFlippedTaskId] = useState(null);

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (e) => {
    const taskData = JSON.parse(e.dataTransfer.getData("task"));

    if (taskData.currentStatus !== status) {
      try {
        await axiosInstance.put(`task/update/${taskData.id}`, {
          status,
          lastEditedAt: new Date().toISOString(),
        });

        socket.emit("task:updated");
        setFlippedTaskId(taskData.id);
        onTaskMoved?.();
      } catch (err) {
        console.error("Update failed", err?.response?.data?.message);
      }
    }
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("task", JSON.stringify({
      id: task._id,
      currentStatus: task.status,
    }));
  };

  return (
    <div className="column" onDragOver={handleDragOver} onDrop={handleDrop}>
      <h3>{status}</h3>
      {tasks
        .filter(task => task.status === status)
        .map(task => (
          <TaskCard
            key={task._id}
            task={task}
            onDragStart={handleDragStart}
            shouldFlip={task._id === flippedTaskId}
          />
        ))}
    </div>
  );
};

export default BoardColumn;
