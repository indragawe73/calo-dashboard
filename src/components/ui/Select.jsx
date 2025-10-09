import { forwardRef, useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './Select.scss';

const Select = forwardRef(({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find(option => option.value === value);

  const selectClasses = [
    'select-field',
    `select-field--${size}`,
    fullWidth && 'select-field--full-width',
    error && 'select-field--error',
    disabled && 'select-field--disabled',
    isFocused && 'select-field--focused',
    isOpen && 'select-field--open',
    className,
  ].filter(Boolean).join(' ');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setIsFocused(!isOpen);
    }
  };

  const handleOptionSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
    setIsFocused(false);
  };

  return (
    <div className={selectClasses} ref={selectRef}>
      {label && (
        <label className="select-field__label">
          {label}
          {required && <span className="select-field__required">*</span>}
        </label>
      )}
      
      <div className="select-field__wrapper">
        <button
          ref={ref}
          type="button"
          className="select-field__trigger"
          onClick={handleToggle}
          disabled={disabled}
          aria-expanded={isOpen}
          {...props}
        >
          <span className={`select-field__value ${!selectedOption ? 'select-field__value--placeholder' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            size={16} 
            className={`select-field__arrow ${isOpen ? 'select-field__arrow--open' : ''}`}
          />
        </button>
        
        {isOpen && (
          <div className="select-field__dropdown">
            <div className="select-field__options">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`select-field__option ${
                    option.value === value ? 'select-field__option--selected' : ''
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className={`select-field__helper ${error ? 'select-field__helper--error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
