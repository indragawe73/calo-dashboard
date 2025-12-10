import { useState } from 'react';
import { reportsService } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ImagesDebugger = () => {
  // Get today's date in YYYY-MM-DD format for the date input
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    includeDetails: true,
    date: getTodayDate(), // Set to today's date by default
    timeOfDay: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestImages = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('=== IMAGES DEBUG START ===');
      console.log('Filters:', filters);
      
      const response = await reportsService.getImages(filters);
      
      console.log('Images response:', response);
      setResult({
        success: response.success,
        data: response,
        timestamp: new Date().toISOString(),
      });
      
      console.log('=== IMAGES DEBUG END ===');
    } catch (error) {
      console.error('Images debug error:', error);
      setResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Images API Debugger</h2>
      <p>Use this tool to debug the /api/reports/images endpoint. Check the browser console for detailed logs.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <Input
            type="number"
            placeholder="Page"
            value={filters.page}
            onChange={(e) => setFilters(prev => ({ ...prev, page: parseInt(e.target.value) || 1 }))}
            fullWidth
          />
          <Input
            type="number"
            placeholder="Page Size"
            value={filters.pageSize}
            onChange={(e) => setFilters(prev => ({ ...prev, pageSize: parseInt(e.target.value) || 10 }))}
            fullWidth
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <Input
            type="date"
            placeholder="Date"
            value={filters.date}
            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            fullWidth
          />
          <select
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            value={filters.timeOfDay}
            onChange={(e) => setFilters(prev => ({ ...prev, timeOfDay: e.target.value }))}
          >
            <option value="">All Times</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
        </div>
        
        <Button
          onClick={handleTestImages}
          loading={loading}
          variant="primary"
          fullWidth
        >
          Test Images API
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
          <p><strong>Timestamp:</strong> {result.timestamp}</p>
          {result.data && (
            <div>
              <p><strong>Data:</strong></p>
              <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '300px' }}>
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

export default ImagesDebugger;
