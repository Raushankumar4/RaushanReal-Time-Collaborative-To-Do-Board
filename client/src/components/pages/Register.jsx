import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/resuable/InputField';
import useFormValidation from '../../hooks/useFormValidation';
import "./Register.css"

const Register = () => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { mutate, isPending, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate('/login');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = useFormValidation(form, ['fullName', 'email', 'password']);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;
    mutate(form);
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <InputField
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />
        <InputField
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <InputField
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Registering...' : 'Register'}
        </button>
      </form>

      {error && (
        <p style={{ color: 'red' }}>
          {error.response?.data?.message || 'Registration failed'}
        </p>
      )}
    </div>
  );
};

export default Register;
