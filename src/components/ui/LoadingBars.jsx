import './LoadingSpinner.scss';

const LoadingBars = ({ className = '' }) => {
  return (
    <div className={`loading-bars ${className}`}>
      <div className="loading-bars__bar"></div>
      <div className="loading-bars__bar"></div>
      <div className="loading-bars__bar"></div>
      <div className="loading-bars__bar"></div>
      <div className="loading-bars__bar"></div>
    </div>
  );
};

export default LoadingBars;
