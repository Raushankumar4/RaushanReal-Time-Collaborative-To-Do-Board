import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import axiosInstance from '../components/services/axiosInstance';
import socket from '../components/sockets/socket';

const BoardColumn = ({ status, tasks }) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "TASK",
    drop: async (item) => {
      if (item.currentStatus !== status) {
        try {
          await axiosInstance.put(`task/update/${item.id}`, {
            status,
            lastEditedAt: new Date().toISOString(),
          });

          socket.emit("task:updated");
        } catch (err) {
          console.error("Update failed", err?.response?.data?.message);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [status]);

  return (
    <div
      ref={dropRef}
      className="column"
      style={{ backgroundColor: isOver ? "#e8f0ff" : "#f9f9f9" }}
    >
      <h3>{status}</h3>
      {tasks.map((task) => (
        <TaskCard key={task?._id} task={task} />
      ))}
    </div>
  );
};

export default BoardColumn;
