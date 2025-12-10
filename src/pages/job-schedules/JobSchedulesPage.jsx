import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setPageTitle, setBreadcrumbs } from '../../store/slices/uiSlice';
import { jobSchedulesService } from '../../services/api';
import { CheckCircle2, XCircle, RotateCcw, FileText, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import LogsModal from '../../components/ui/LogsModal';
import RetryResponseModal from '../../components/ui/RetryResponseModal';
import './JobSchedulesPage.scss';

const JobSchedulesPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const [flowRuns, setFlowRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(null);
  const [selectedFlowRunId, setSelectedFlowRunId] = useState(null);
  const [selectedFlowRunName, setSelectedFlowRunName] = useState(null);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [retryResponse, setRetryResponse] = useState(null);
  const [retryError, setRetryError] = useState(null);
  const [isRetryResponseModalOpen, setIsRetryResponseModalOpen] = useState(false);

  useEffect(() => {
    dispatch(setPageTitle(t('navigation.jobSchedules')));
    dispatch(setBreadcrumbs([
      { label: 'Dashboard', path: '/dashboard' },
      { label: t('navigation.jobSchedules'), path: '/dashboard/job-schedules' }
    ]));
  }, [dispatch, t]);

  useEffect(() => {
    loadFlowRuns();
  }, []);

  const loadFlowRuns = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await jobSchedulesService.getFlowRuns({ limit: 100, offset: 0 });
      
      if (result.success) {
        // Transform API response to match our UI structure
        const data = result.data;
        let runs = [];
        
        console.log('Raw API response data:', data);
        console.log('Data type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        
        // Handle different response structures
        if (Array.isArray(data)) {
          // If data is directly an array
          runs = data;
          console.log('Data is array, items count:', runs.length);
        } else if (data && typeof data === 'object') {
          // Check for common pagination/collection patterns
          if (Array.isArray(data.items)) {
            runs = data.items;
            console.log('Found items array, count:', runs.length);
          } else if (Array.isArray(data.results)) {
            runs = data.results;
            console.log('Found results array, count:', runs.length);
          } else if (Array.isArray(data.data)) {
            runs = data.data;
            console.log('Found data array, count:', runs.length);
          } else if (Array.isArray(data.value)) {
            // OData style response
            runs = data.value;
            console.log('Found value array, count:', runs.length);
          } else {
            // Check if it's a single object with nested array
            const keys = Object.keys(data);
            console.log('Object keys:', keys);
            
            // Try to find any array property
            for (const key of keys) {
              if (Array.isArray(data[key]) && data[key].length > 0) {
                runs = data[key];
                console.log(`Found array in key "${key}", count:`, runs.length);
                break;
              }
            }
            
            // If still no runs found and it's a single object, wrap it
            if (runs.length === 0 && !Array.isArray(data)) {
              console.log('Wrapping single object as array');
              runs = [data];
            }
          }
        }
        
        console.log('Final runs array before filtering:', runs);
        console.log('Runs count:', runs.length);
        
        // Remove null/undefined entries but keep all valid objects
        runs = runs.filter(run => run !== null && run !== undefined);
        console.log('Runs count after filtering null/undefined:', runs.length);
        
        // Sort by expected_start_time (newest first) if dates are available
        runs.sort((a, b) => {
          const dateA = new Date(
            a.expected_start_time || 
            a.expectedStartTime ||
            a.start_time || 
            a.created_at || 
            a.run_time || 
            a.created || 
            a.timestamp ||
            a.date ||
            0
          );
          const dateB = new Date(
            b.expected_start_time || 
            b.expectedStartTime ||
            b.start_time || 
            b.created_at || 
            b.run_time || 
            b.created || 
            b.timestamp ||
            b.date ||
            0
          );
          return dateB - dateA;
        });
        
        console.log('Final runs to display:', runs.length);
        console.log('Runs data:', runs);
        
        setFlowRuns(runs);
      } else {
        setError(result.error);
        setFlowRuns([]);
      }
    } catch (err) {
      console.error('Error loading flow runs:', err);
      setError(err.message || 'Failed to load job schedules');
      setFlowRuns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (run) => {
    const flowRunId = run.flow_run_id || run.id || run.run_id;
    
    if (!flowRunId) {
      console.error('Flow run ID not found:', run);
      return;
    }

    setRetrying(flowRunId);
    setRetryError(null);
    setRetryResponse(null);

    try {
      const result = await jobSchedulesService.retryFlowRun(flowRunId);

      if (result.success) {
        setRetryResponse(result.data);
        setIsRetryResponseModalOpen(true);
        // Reload flow runs after successful retry
        await loadFlowRuns();
      } else {
        setRetryError(result.error);
        setIsRetryResponseModalOpen(true);
      }
    } catch (err) {
      console.error('Error retrying flow run:', err);
      setRetryError(err.message || 'Failed to retry flow run');
      setIsRetryResponseModalOpen(true);
    } finally {
      setRetrying(null);
    }
  };

  const handleCloseRetryResponseModal = () => {
    setIsRetryResponseModalOpen(false);
    setRetryResponse(null);
    setRetryError(null);
  };

  const handleSeeLogs = (run) => {
    console.log('See logs for run:', run);
    
    // Get flow_run_id from the run object
    const flowRunId = run.flow_run_id || run.id || run.run_id;
    const flowRunName = getFlowRunName(run);
    
    if (flowRunId) {
      setSelectedFlowRunId(flowRunId);
      setSelectedFlowRunName(flowRunName);
      setIsLogsModalOpen(true);
    } else {
      console.error('Flow run ID not found:', run);
    }
  };

  const handleCloseLogsModal = () => {
    setIsLogsModalOpen(false);
    setSelectedFlowRunId(null);
    setSelectedFlowRunName(null);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getRunStatus = (run) => {
    // Get status from various possible fields
    const status = run.state?.type || 
                   run.state?.name || 
                   run.state_type || 
                   run.state || 
                   run.status?.type || 
                   run.status?.name || 
                   run.status || 
                   'UNKNOWN';
    
    const statusStr = String(status).toUpperCase();
    
    // Success states
    if (statusStr === 'COMPLETED' || 
        statusStr === 'SUCCESS' || 
        statusStr === 'SUCCEEDED' || 
        statusStr === 'FINISHED') {
      return { status: 'success', label: statusStr, icon: CheckCircle2, color: '#00ba31', canRetry: false };
    }
    
    // Failed states
    if (statusStr === 'FAILED' || 
        statusStr === 'FAILURE' || 
        statusStr === 'CRASHED' || 
        statusStr === 'CANCELLED' || 
        statusStr === 'ERROR' ||
        statusStr === 'EXCEPTION') {
      return { status: 'failed', label: statusStr, icon: XCircle, color: '#ef4444', canRetry: true };
    }
    
    // Scheduled state (cannot retry)
    if (statusStr === 'SCHEDULED') {
      return { status: 'scheduled', label: statusStr, icon: RefreshCw, color: '#f59e0b', canRetry: false };
    }
    
    // Running/Pending states
    if (statusStr === 'RUNNING' || 
        statusStr === 'PENDING' || 
        statusStr === 'QUEUED' ||
        statusStr === 'IN_PROGRESS') {
      return { status: 'running', label: statusStr, icon: RefreshCw, color: '#f59e0b', canRetry: false };
    }
    
    // Default to unknown
    return { status: 'unknown', label: statusStr, icon: RefreshCw, color: '#6b7280', canRetry: false };
  };

  const getFlowRunName = (run) => {
    return run.flow_run_name || 
           run.flowRunName || 
           run.name || 
           run.flow_name ||
           run.flowName ||
           run.id || 
           `Flow Run ${run.id || run.run_id || 'Unknown'}`;
  };

  const getExpectedStartTime = (run) => {
    return run.expected_start_time || 
           run.expectedStartTime ||
           run.start_time ||
           run.created_at ||
           run.run_time ||
           null;
  };

  return (
    <div className="job-schedules-page">
      <div className="job-schedules-page__header">
        <div className="job-schedules-page__title">
          <h2>Job Schedules</h2>
        </div>
      </div>

      {loading ? (
        <div className="job-schedules-page__loading">
          <LoadingSpinner />
          <p>Loading job schedules...</p>
        </div>
      ) : error ? (
        <div className="job-schedules-page__error">
          <p>Failed to load job schedules: {error}</p>
          <button 
            className="job-schedules-page__retry-btn"
            onClick={loadFlowRuns}
          >
            <RotateCcw size={16} />
            Retry
          </button>
        </div>
      ) : flowRuns.length === 0 ? (
        <div className="job-schedules-page__empty">
          <p>No job schedules found</p>
        </div>
      ) : (
        <div className="job-schedules-page__list">
          {flowRuns.map((run, index) => {
            // Generate unique key for each run
            const uniqueKey = run.id || run.run_id || run.name || `flow-run-${index}`;
            const runStatus = getRunStatus(run);
            const StatusIcon = runStatus.icon;
            const canRetry = runStatus.canRetry || false;
            const flowRunId = run.flow_run_id || run.id || run.run_id;
            const isRetrying = retrying === flowRunId;
            const flowRunName = getFlowRunName(run);
            const expectedStartTime = getExpectedStartTime(run);
            const displayDate = formatDateTime(expectedStartTime);

            console.log(`Rendering flow run ${index + 1}:`, {
              key: uniqueKey,
              name: flowRunName,
              status: runStatus.label,
              date: displayDate
            });

            return (
              <div key={uniqueKey} className="job-schedules-page__row">
                <div className="job-schedules-page__row-date">
                  <div className="job-schedules-page__date">{displayDate}</div>
                </div>
                
                <div className="job-schedules-page__row-name">
                  <div className="job-schedules-page__name">{flowRunName}</div>
                </div>
                
                <div className="job-schedules-page__row-status">
                  {canRetry && (
                    <button
                      className="job-schedules-page__action-btn job-schedules-page__action-btn--purple"
                      onClick={() => handleRetry(run)}
                      disabled={isRetrying}
                      title="Retry job"
                    >
                      {isRetrying ? (
                        <>
                          <RefreshCw size={14} className="spinning" />
                          <span>Retry</span>
                        </>
                      ) : (
                        <>
                          <RotateCcw size={14} />
                          <span>Retry</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                <div className="job-schedules-page__row-actions">
                  <div 
                    className="job-schedules-page__status-badge"
                    style={{ 
                      backgroundColor: `${runStatus.color}20`,
                      color: runStatus.color,
                      borderColor: runStatus.color
                    }}
                  >
                    <StatusIcon size={14} />
                    <span>{runStatus.label}</span>
                  </div>
                  
                  <button
                    className="job-schedules-page__icon-btn"
                    onClick={() => handleSeeLogs(run)}
                    title="View logs"
                  >
                    <FileText size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Logs Modal */}
      <LogsModal
        flowRunId={selectedFlowRunId}
        flowRunName={selectedFlowRunName}
        isOpen={isLogsModalOpen}
        onClose={handleCloseLogsModal}
      />

      {/* Retry Response Modal */}
      <RetryResponseModal
        isOpen={isRetryResponseModalOpen}
        onClose={handleCloseRetryResponseModal}
        response={retryResponse}
        error={retryError}
      />
    </div>
  );
};

export default JobSchedulesPage;

