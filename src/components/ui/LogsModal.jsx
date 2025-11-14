import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { jobSchedulesService } from '../../services/api';
import LoadingSpinner from './LoadingSpinner';
import './LogsModal.scss';

const LogsModal = ({ flowRunId, flowRunName, isOpen, onClose }) => {
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Load logs when modal opens
      if (flowRunId) {
        loadLogs();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, flowRunId]);

  const loadLogs = async () => {
    if (!flowRunId) return;
    
    setLoading(true);
    setError(null);
    setLogs(null);

    try {
      const result = await jobSchedulesService.getFlowRunLogs(flowRunId);

      if (result.success) {
        // Handle different response structures
        let logsData = result.data;
        
        // If logs is an array, use it directly
        if (Array.isArray(logsData)) {
          setLogs(logsData);
        } 
        // If logs is an object, check for common properties
        else if (logsData && typeof logsData === 'object') {
          if (Array.isArray(logsData.logs)) {
            setLogs(logsData.logs);
          } else if (Array.isArray(logsData.items)) {
            setLogs(logsData.items);
          } else if (Array.isArray(logsData.data)) {
            setLogs(logsData.data);
          } else if (logsData.message || logsData.content || logsData.text) {
            // If it's a single string/text, wrap it in array
            setLogs([logsData.message || logsData.content || logsData.text]);
          } else {
            // Try to stringify the whole object
            setLogs([JSON.stringify(logsData, null, 2)]);
          }
        } 
        // If logs is a string, wrap it in array
        else if (typeof logsData === 'string') {
          setLogs([logsData]);
        }
        else {
          setLogs([]);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error loading logs:', err);
      setError(err.message || 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatLogLine = (log) => {
    let logText = '';
    
    if (typeof log === 'string') {
      logText = log;
    } else if (typeof log === 'object') {
      // Try to format object logs
      if (log.message) {
        logText = log.message;
      } else if (log.content) {
        logText = log.content;
      } else if (log.text) {
        logText = log.text;
      } else if (log.level && log.message) {
        logText = `[${log.level}] ${log.message}`;
      } else {
        logText = JSON.stringify(log, null, 2);
      }
    } else {
      logText = String(log);
    }
    
    return highlightImportantInfo(logText);
  };

  const highlightImportantInfo = (text) => {
    if (!text) return text;
    
    // Escape HTML first to prevent XSS
    let highlighted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Pattern untuk informasi penting yang perlu di-bold (dalam urutan prioritas)
    const patterns = [
      // URLs (harus lebih dulu agar tidak terpotong)
      { pattern: /https?:\/\/[^\s<>"']+/gi, priority: 1 },
      // UUIDs
      { pattern: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, priority: 2 },
      // Timestamps (various formats)
      { pattern: /\b\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}:\d{2}(\.\d+)?([Z+-]\d{2}:?\d{2})?\b/g, priority: 3 },
      { pattern: /\b\d{2}\/\d{2}\/\d{4}[\s,]\d{2}:\d{2}:\d{2}\b/g, priority: 3 },
      // Status codes dengan HTTP
      { pattern: /\bHTTP\/\d\.\d\s\d{3}\s[A-Z][a-zA-Z]+\b/gi, priority: 4 },
      // Text dalam brackets [INFO], [ERROR], etc. (harus sebelum pattern lainnya)
      { pattern: /\[([^\]]+)\]/g, priority: 5 },
      // Error/Warning/Success levels (case insensitive)
      { pattern: /\b(ERROR|FAILED|FAILURE|WARNING|WARN|SUCCESS|SUCCEEDED|COMPLETED|INFO|DEBUG|CRITICAL|FATAL)\b/gi, priority: 6 },
      // Important keywords
      { pattern: /\b(STARTED|FINISHED|COMPLETED|RUNNING|PENDING|CANCELLED|SKIPPED|RETRY|RETRYING)\b/gi, priority: 7 },
      // Exception/Error patterns
      { pattern: /\b(Exception|Error|Traceback|Stack\s+Trace|at\s+\w+\.\w+)/gi, priority: 8 },
      // Numbers with units (rows, records, etc)
      { pattern: /\b\d+\s+(rows?|records?|items?|count|total|inserted|expected|processed|completed)\b/gi, priority: 9 },
      // Flow/Job related
      { pattern: /\b(Flow|Job|Task|Schedule|Run|Execution)\s+\w+/gi, priority: 10 },
      // Quoted strings (often important messages)
      { pattern: /"([^"]+)"/g, priority: 11 },
      { pattern: /'([^']+)'/g, priority: 11 },
      // Standalone 3-digit codes (harus terakhir agar tidak terlalu banyak match)
      { pattern: /\b(1\d{2}|2\d{2}|3\d{2}|4\d{2}|5\d{2})\b/g, priority: 12 },
    ];

    // Sort by priority
    patterns.sort((a, b) => a.priority - b.priority);

    // Apply each pattern, avoiding overlaps
    patterns.forEach(({ pattern }) => {
      highlighted = highlighted.replace(pattern, (match) => {
        // Skip if already wrapped or contains HTML tags
        if (match.includes('<strong') || match.includes('&lt;strong')) {
          return match;
        }
        return `<strong class="logs-modal__highlight">${match}</strong>`;
      });
    });

    return highlighted;
  };

  if (!isOpen) return null;

  return (
    <div className="logs-modal" onClick={handleBackdropClick}>
      <div className="logs-modal__content">
        <div className="logs-modal__header">
          <div className="logs-modal__title">
            <h3>Logs</h3>
            {flowRunName && (
              <span className="logs-modal__subtitle">{flowRunName}</span>
            )}
            {flowRunId && (
              <span className="logs-modal__id">ID: {flowRunId}</span>
            )}
          </div>
          <button 
            className="logs-modal__close-btn"
            onClick={onClose}
            title="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="logs-modal__body">
          {loading ? (
            <div className="logs-modal__loading">
              <LoadingSpinner />
              <p>Loading logs...</p>
            </div>
          ) : error ? (
            <div className="logs-modal__error">
              <p>Failed to load logs: {error}</p>
              <button 
                className="logs-modal__retry-btn"
                onClick={loadLogs}
              >
                Retry
              </button>
            </div>
          ) : logs === null ? (
            <div className="logs-modal__empty">
              <p>No logs available</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="logs-modal__empty">
              <p>No logs found</p>
            </div>
          ) : (
            <div className="logs-modal__logs">
              {logs.map((log, index) => (
                <div 
                  key={index} 
                  className="logs-modal__log-line"
                  dangerouslySetInnerHTML={{ __html: formatLogLine(log) }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsModal;

