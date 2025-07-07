import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLogs } from '../../services/taskServices';
import socket from '../../sockets/socket';
import Loading from '../../Loading/Loading';
import './ActivityLog.css';

const ActivityLog = () => {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['logs'],
    queryFn: fetchLogs,
  });

  useEffect(() => {
    const refresh = () => queryClient.invalidateQueries(['logs']);
    socket.on('log:added', refresh);
    return () => socket.off('log:added', refresh);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="activity-log">
      <h3 className="log-title">Activity Log</h3>
      <div className="log-list">
        {logs?.data?.map((log) => (
          <div className="log-entry" key={log._id}>
            <p>
              📝 <strong>{log.user?.fullName}</strong> <em>{log.actionType}</em> task{' '}
              <strong>{log.task?.title}</strong>
            </p>
            <small className="log-timestamp">{new Date(log.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
