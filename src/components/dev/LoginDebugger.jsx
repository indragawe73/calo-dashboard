import { useState } from 'react';
import { authService } from '../../services/api';
import { mockAuthService } from '../../services/mockApi';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LoginDebugger = () => {
  const [credentials, setCredentials] = useState({
    username: 'admin',
    password: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useMockApi, setUseMockApi] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('=== LOGIN DEBUG START ===');
      console.log('Credentials:', credentials);
      console.log('Using Mock API:', useMockApi);
      
      const response = useMockApi 
        ? await mockAuthService.login(credentials.username, credentials.password)
        : await authService.login(credentials.username, credentials.password);
      
      console.log('Login response:', response);
      setResult({
        success: response.success,
        data: response,
        timestamp: new Date().toISOString(),
        apiType: useMockApi ? 'Mock API' : 'Real API',
      });
      
      console.log('=== LOGIN DEBUG END ===');
    } catch (error) {
      console.error('Login debug error:', error);
      setResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        apiType: useMockApi ? 'Mock API' : 'Real API',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Login Debugger</h2>
      <p>Use this tool to debug login issues. Check the browser console for detailed logs.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={useMockApi}
              onChange={(e) => setUseMockApi(e.target.checked)}
            />
            <span>Use Mock API (for testing when real API is not accessible)</span>
          </label>
        </div>
        
        <Input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
          fullWidth
        />
        <Input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
          fullWidth
        />
        <Button
          onClick={handleLogin}
          loading={loading}
          variant="primary"
          fullWidth
        >
          Test Login
        </Button>
      </div>

      {result && (
        <div style={{ 
          padding: '15px', 
          border: '1px solid #ccc', 
          borderRadius: '4px',
          backgroundColor: result.success ? '#d4edda' : '#f8d7da'
        }}>
          <h3>Result:</h3>
          <p><strong>Success:</strong> {result.success ? 'Yes' : 'No'}</p>
          <p><strong>API Type:</strong> {result.apiType}</p>
          <p><strong>Timestamp:</strong> {result.timestamp}</p>
          {result.data && (
            <div>
              <p><strong>Data:</strong></p>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
          {result.error && (
            <div>
              <p><strong>Error:</strong> {result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginDebugger;
