import { useState, useEffect } from 'react';
import { authService } from '../../services/api';

const ApiStatus = () => {
  const [status, setStatus] = useState('checking');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Always use direct connection
        const currentUrl = 'http://100.107.61.112:5270/api';
        setApiUrl(currentUrl);

        // Try to make a simple request (this will fail but we can check the error type)
        const result = await authService.getCurrentUser();
        
        if (result.success) {
          setStatus('connected');
        } else if (result.error.includes('401') || result.error.includes('Unauthorized')) {
          setStatus('connected'); // API is responding, just not authenticated
        } else {
          setStatus('error');
        }
      } catch (error) {
        if (error.message.includes('CORS') || error.message.includes('Network')) {
          setStatus('cors-error');
        } else {
          setStatus('error');
        }
      }
    };

    checkApiStatus();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'checking': return '#f59e0b';
      case 'cors-error': return '#ef4444';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'API Connected';
      case 'checking': return 'Checking API...';
      case 'cors-error': return 'CORS Error - Check proxy settings';
      case 'error': return 'API Error';
      default: return 'Unknown';
    }
  };

  if (import.meta.env.PROD) return null; // Don't show in production

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      padding: '8px 12px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontSize: '12px',
      zIndex: 9999,
      border: `1px solid ${getStatusColor()}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor()
        }} />
        <div>
          <div style={{ fontWeight: 'bold' }}>{getStatusText()}</div>
          <div style={{ color: '#6b7280', fontSize: '10px' }}>{apiUrl}</div>
        </div>
      </div>
    </div>
  );
};

export default ApiStatus;
