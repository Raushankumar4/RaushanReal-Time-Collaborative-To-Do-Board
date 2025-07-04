import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import useFormValidation from '../../hooks/useFormValidation';
import InputField from '../../components/resuable/InputField';
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      navigate('/board');
    },
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
          type="email"
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          error={formErrors.email}
        />
        <InputField
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
          error={formErrors.password}
        />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Login'}
        </button>
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
