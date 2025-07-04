import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      navigate('/board');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return alert("All fields required");
    mutate(form);
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error.response?.data?.message || "Login failed"}</p>}
    </div>
  );
};

export default Login;
