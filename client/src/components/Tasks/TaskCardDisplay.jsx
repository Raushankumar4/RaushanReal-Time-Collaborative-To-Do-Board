
import { FiEdit, FiTrash2, FiTag, FiFileText, FiUser, FiTrendingUp } from "react-icons/fi";
import Button from "../resuable/Button";

const TaskCardDisplay = ({ task, onEditClick, onDelete, onAssign, isDeleting, isAssigning }) => (
  <>
    <div className="btn-icon-group">
      <Button onClick={onEditClick} type="primary">
        <FiEdit />
      </Button>
      <Button type="danger" onClick={onDelete} disabled={isDeleting}>
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

    <Button type="primary" onClick={onAssign} disabled={isAssigning}>
      {isAssigning ? "Assigning..." : "Smart Assign"}
    </Button>
  </>
);

export default TaskCardDisplay;
