import { forwardRef } from 'react';
import LoadingSpinner from './LoadingSpinner';
import './Button.scss';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const buttonClasses = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full-width',
    loading && 'btn--loading',
    disabled && 'btn--disabled',
    className,
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (loading || disabled) return;
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" color={variant === 'primary' ? 'white' : 'primary'} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="btn__icon btn__icon--left">{icon}</span>
          )}
          <span className="btn__text">{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="btn__icon btn__icon--right">{icon}</span>
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
