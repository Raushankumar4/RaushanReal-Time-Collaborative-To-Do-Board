import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTasks } from '../services/taskServices';
import socket from '../sockets/socket';
import Logout from './Logout';
import CreateTask from '../Tasks/CreateTask';
import Loading from '../Loading/Loading';
import { FiPlus, FiX, FiList } from "react-icons/fi";
import Button from '../resuable/Button';
import ActivityLog from '../Tasks/Activity/ActivityLog';
import BoardColumn from '../Tasks/BoardColumn';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActivityMobile, setShowActivityMobile] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  useEffect(() => {
    socket.on('task:created', () => queryClient.invalidateQueries(['tasks']));
    socket.on('task:updated', () => queryClient.invalidateQueries(['tasks']));
    socket.on('task:deleted', () => queryClient.invalidateQueries(['tasks']));
    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
    };
  }, [queryClient]);

  // Detect screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1200);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) return <Loading />;

  const grouped = {
    Todo: [],
    'In Progress': [],
    Done: [],
  };

  tasks?.data?.forEach((task) => grouped[task.status]?.push(task));

  return (
    <div className="kanban-board">
      <div className="board-header">
        <Button type="primary" onClick={() => setShowCreateModal(true)}>
          <FiPlus className="icon" />
          Create Task
        </Button>

        {isMobileView && (
          <Button type="secondary" onClick={() => setShowActivityMobile(!showActivityMobile)}>
            <FiList className="icon" />
            {showActivityMobile ? "Hide Activity" : "Show Activity"}
          </Button>
        )}

        <Logout />
      </div>

      {tasks?.data?.length === 0 ? <h1>Task Not Found!</h1> : <div className="board-columns">
        {Object.keys(grouped).map((status) => (
          <BoardColumn key={status} status={status} tasks={grouped[status]} />
        ))}

        {/* Activity Log on large screens */}
        {!isMobileView && (
          <div className="column">
            <ActivityLog />
          </div>
        )}
      </div>}

      {/* Activity Log on small screens, toggled */}
      {isMobileView && showActivityMobile && (
        <div className="modal-overlay" onClick={() => setShowActivityMobile(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Button type="primary" onClick={() => setShowActivityMobile(false)}>
              <FiX />
            </Button>
            <ActivityLog />
          </div>
        </div>
      )}


      {/* Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Button type="primary" onClick={() => setShowCreateModal(false)}>
              <FiX />
            </Button>
            <CreateTask onClose={() => setShowCreateModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
