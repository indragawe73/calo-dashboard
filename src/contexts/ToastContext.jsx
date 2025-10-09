import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Toast from '../components/ui/Toast';
import { toast as globalToast } from '../utils/toast';
import '../components/ui/Toast.scss';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Listen to global toast events
  useEffect(() => {
    const unsubscribe = globalToast.subscribe(({ message, type, duration }) => {
      const id = Date.now() + Math.random();
      const newToast = { id, message, type, duration };
      setToasts(prev => [...prev, newToast]);
    });

    return unsubscribe;
  }, []);

  const addToast = useCallback((message, type = 'error', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showError = useCallback((message) => {
    return addToast(message, 'error', 5000);
  }, [addToast]);

  const showSuccess = useCallback((message) => {
    return addToast(message, 'success', 3000);
  }, [addToast]);

  const showWarning = useCallback((message) => {
    return addToast(message, 'warning', 4000);
  }, [addToast]);

  const showInfo = useCallback((message) => {
    return addToast(message, 'info', 3000);
  }, [addToast]);

  const value = {
    addToast,
    removeToast,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

