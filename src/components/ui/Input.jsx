import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.scss';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  size = 'md',
  icon,
  iconPosition = 'left',
  clearable = false,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  const inputClasses = [
    'input-field',
    `input-field--${size}`,
    fullWidth && 'input-field--full-width',
    error && 'input-field--error',
    disabled && 'input-field--disabled',
    isFocused && 'input-field--focused',
    icon && `input-field--with-${iconPosition}-icon`,
    (type === 'password' || clearable) && 'input-field--with-action',
    className,
  ].filter(Boolean).join(' ');

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleClear = () => {
    onChange?.({ target: { value: '' } });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={inputClasses}>
      {label && (
        <label className="input-field__label">
          {label}
          {required && <span className="input-field__required">*</span>}
        </label>
      )}
      
      <div className="input-field__wrapper">
        {icon && iconPosition === 'left' && (
          <div className="input-field__icon input-field__icon--left">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className="input-field__input"
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="input-field__icon input-field__icon--right">
            {icon}
          </div>
        )}
        
        {type === 'password' && (
          <button
            type="button"
            className="input-field__action"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        
        {clearable && value && (
          <button
            type="button"
            className="input-field__action"
            onClick={handleClear}
            tabIndex={-1}
          >
            ×
          </button>
        )}
      </div>
      
      {(error || helperText) && (
        <div className={`input-field__helper ${error ? 'input-field__helper--error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
