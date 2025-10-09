import { useTranslation } from 'react-i18next';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  text = null, 
  fullScreen = false,
  overlay = false 
}) => {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: 'loading-spinner--sm',
    md: 'loading-spinner--md',
    lg: 'loading-spinner--lg',
    xl: 'loading-spinner--xl',
  };

  const colorClasses = {
    primary: 'loading-spinner--primary',
    secondary: 'loading-spinner--secondary',
    white: 'loading-spinner--white',
  };

  const spinnerClasses = [
    'loading-spinner',
    sizeClasses[size],
    colorClasses[color],
    fullScreen && 'loading-spinner--full-screen',
    overlay && 'loading-spinner--overlay',
  ].filter(Boolean).join(' ');

  const content = (
    <div className={spinnerClasses}>
      <div className="loading-spinner__container">
        <div className="loading-spinner__spinner">
          <div className="loading-spinner__circle"></div>
        </div>
        {(text || text === null) && (
          <div className="loading-spinner__text">
            {text || t('common.loading')}
          </div>
        )}
      </div>
    </div>
  );

  return content;
};

export default LoadingSpinner;
