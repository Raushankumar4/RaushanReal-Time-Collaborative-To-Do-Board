import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../services/taskServices';
import socket from '../sockets/socket';
import toast from 'react-hot-toast';
import InputField from '../resuable/InputField';
import './Create.css';

const CreateTask = () => {
  const [form, setForm] = useState({ title: "", description: "", priority: "Low" });
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast.success("Task created!");
      queryClient.invalidateQueries(["tasks"]);
      socket.emit("task:created");
      setForm({ title: "", description: "", priority: "Low" });
    },
    onError: () => {
      toast.error("Task creation failed");
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
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
};

export default CreateTask;
