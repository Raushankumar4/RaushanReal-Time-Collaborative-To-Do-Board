import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../services/taskServices';
import socket from '../sockets/socket';
import toast from 'react-hot-toast';
import InputField from '../resuable/InputField';
import './Create.css';
import Button from '../resuable/Button';

const CreateTask = ({ onClose }) => {
  const [form, setForm] = useState({ title: "", description: "", priority: "Low" });
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast.success("Task created!");
      queryClient.invalidateQueries(["tasks"]);
      socket.emit("task:created");
      setForm({ title: "", description: "", priority: "Low" });
      onClose()
    },
    onError: () => {
      toast.error("Task creation failed");
      onClose()
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ ...form, status: "Todo" });
  };

  return (
    <form onSubmit={handleSubmit} className="create-task-form">
      <h3>Create New Task</h3>
      <InputField
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <InputField
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />
      <select
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <Button type="primary" disabled={isPending}>
        {isPending ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
};

export default CreateTask;
