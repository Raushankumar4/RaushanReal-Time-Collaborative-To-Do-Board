import { useState, useRef, forwardRef } from 'react';
import './InputField.css';

const InputField = forwardRef(
  ({ label, type = 'text', name, value, placeholder, onChange, error }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = ref || useRef();

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className="input-group">
        {label && <label htmlFor={name}>{label}</label>}
        <div className="input-wrapper">
          <input
            type={inputType}
            id={name}
            name={name}
            ref={inputRef}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`input ${error ? 'input-error' : ''}`}
          />
          {type === 'password' && (
            <icon type="button"
              className="toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </icon>
          )}
        </div>
        <p style={{
          color: "red"
        }}>{error}</p>
      </div>
    );
  }
);

export default InputField;
