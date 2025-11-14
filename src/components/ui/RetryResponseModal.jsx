import { useEffect } from 'react';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import './RetryResponseModal.scss';

const RetryResponseModal = ({ isOpen, onClose, response, error }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isSuccess = response?.success === true || (response && !error);

  return (
    <div className="retry-response-modal" onClick={handleBackdropClick}>
      <div className="retry-response-modal__content">
        <div className="retry-response-modal__header">
          <div className="retry-response-modal__title">
            {isSuccess ? (
              <>
                <CheckCircle2 size={24} className="retry-response-modal__icon retry-response-modal__icon--success" />
                <h3>Retry Successful</h3>
              </>
            ) : (
              <>
                <XCircle size={24} className="retry-response-modal__icon retry-response-modal__icon--error" />
                <h3>Retry Failed</h3>
              </>
            )}
          </div>
          <button 
            className="retry-response-modal__close-btn"
            onClick={onClose}
            title="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="retry-response-modal__body">
          {error ? (
            <div className="retry-response-modal__error">
              <p>{error}</p>
            </div>
          ) : response ? (
            <div className="retry-response-modal__response">
              <div className="retry-response-modal__response-item">
                <label>Success:</label>
                <span className={response.success ? 'retry-response-modal__success' : 'retry-response-modal__failed'}>
                  {response.success ? 'true' : 'false'}
                </span>
              </div>
              
              {response.message && (
                <div className="retry-response-modal__response-item">
                  <label>Message:</label>
                  <span>{response.message}</span>
                </div>
              )}
              
              {response.new_flow_run_id && (
                <div className="retry-response-modal__response-item">
                  <label>New Flow Run ID:</label>
                  <span className="retry-response-modal__id">{response.new_flow_run_id}</span>
                </div>
              )}
              
              {response.status && (
                <div className="retry-response-modal__response-item">
                  <label>Status:</label>
                  <span className="retry-response-modal__status">{response.status}</span>
                </div>
              )}
              
              <div className="retry-response-modal__json">
                <label>Full Response:</label>
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            </div>
          ) : null}
        </div>

        <div className="retry-response-modal__footer">
          <button 
            className="retry-response-modal__close-action-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetryResponseModal;

