import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTasks } from '../services/taskServices';
import BoardColumn from '../../components/BoardColumn';
import socket from '../sockets/socket';
import ActivityLog from '../ActivityLog';
import Logout from './Logout';
import CreateTask from '../Tasks/CreateTask';

const KanbanBoard = () => {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    onSuccess: (data) => console.log('Fetched tasks:', data),
    onError: (error) => console.error('Error fetching tasks:', error),
  });

  useEffect(() => {
    socket.on("task:created", () => queryClient.invalidateQueries(["tasks"]));
    socket.on("task:updated", () => queryClient.invalidateQueries(["tasks"]));
    socket.on("task:deleted", () => queryClient.invalidateQueries(["tasks"]));
    return () => {
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
    };
  }, [queryClient]);

  if (isLoading) return <p>Loading board...</p>;

  const grouped = {
    "Todo": [],
    "In Progress": [],
    "Done": []
  };

  tasks?.data?.forEach(task => grouped[task.status].push(task));

  return (
    <div className="kanban-board ">
      <CreateTask />
      <div>
        <Logout />
      </div>
      {Object.keys(grouped).map((status) => (
        <BoardColumn key={status} status={status} tasks={grouped[status]} />
      ))}
      <div className="activity-log-container" style={{ flex: 1 }}>
        <ActivityLog />
      </div>
    </div>
  );
};

export default KanbanBoard;
