import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import useFormValidation from '../../hooks/useFormValidation';
import InputField from '../../components/resuable/InputField';
import './Login.css';
import toast from 'react-hot-toast';
import Button from '../resuable/Button';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success(data?.message || "Logged")
      navigate('/board');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message)
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = useFormValidation(form, ['email', 'password']);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    mutate(form);
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Email"
          type="email"
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          error={formErrors.email}
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
          error={formErrors.password}
        />
        <Button type="primary" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      {error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>
          {error.response?.data?.message || 'Login failed'}
        </p>
      )}

      <div className="footer-text">
        Don’t have an account?{' '}
        <Link to="/register">
          Create one
        </Link>
      </div>
    </div>
  );
};

export default Login;
