import './LoadingSpinner.scss';

const LoadingDots = ({ className = '' }) => {
  return (
    <div className={`loading-dots ${className}`}>
      <div className="loading-dots__dot"></div>
      <div className="loading-dots__dot"></div>
      <div className="loading-dots__dot"></div>
    </div>
  );
};

export default LoadingDots;
