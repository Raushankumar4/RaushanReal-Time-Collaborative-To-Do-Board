import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/resuable/InputField';
import useFormValidation from '../../hooks/useFormValidation';
import "./Register.css"
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";


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
    onSuccess: (data) => {
      toast.success(data?.message || "registered")
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response.data)
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = useFormValidation(form, ['fullName', 'email', 'password']);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;
    mutate(form);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 style={{ textAlign: "center" }} >Create Account</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-row">
            <InputField
              label="Full Name"
              name="fullName"
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            <InputField
              label="Email"
              name="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <button
            type="submit"
            disabled={isPending}
            className={`auth-button ${isPending ? "disabled" : ""}`}
          >
            {isPending ? 'Registering...' : 'Register'}
          </button>
        </form>


        {error && (
          <p className="auth-error">
            {error.response?.data?.message || 'Registration failed'}
          </p>
        )}

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
