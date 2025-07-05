import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLogs } from '../components/services/taskServices';
import socket from '../components/sockets/socket';

const ActivityLog = () => {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["logs"],
    queryFn: fetchLogs,
  });

  useEffect(() => {
    const refresh = () => queryClient.invalidateQueries(["logs"]);
    socket.on("log:added", refresh);
    return () => socket.off("log:added", refresh);
  }, []);

  if (isLoading) return <p>Loading activity log...</p>;
  

  return (
    <div className="activity-log" style={{ background: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
      <h3>Activity Log</h3>
      {logs?.data?.map((log) => (
        <p key={log._id} style={{ fontSize: "0.9rem" }}>
          📝 <strong>{log.user?.fullName}</strong> <em>{log.actionType}</em> task <strong>{log.task?.title}</strong>
          <br />
          <small>{new Date(log.createdAt).toLocaleString()}</small>
        </p>
      ))}
    </div>
  );
};

export default ActivityLog;
