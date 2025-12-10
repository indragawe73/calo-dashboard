import { useEffect } from 'react';
import { X, Download, Eye, Calendar, Clock, FileText } from 'lucide-react';
import { handleUnauthorized } from '../../utils/authHandler';
import toast from '../../utils/toast';
import AuthImage from './AuthImage';
import './ImageModal.scss';

// Utility function to format date to user's local timezone
const formatToLocalDate = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  
  try {
    let safeDateTime = dateTimeString.trim();

    // Tambahkan 'Z' hanya jika string belum punya offset timezone (±HH:MM atau Z)
    if (!safeDateTime.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(safeDateTime)) {
      safeDateTime += 'Z';
    }

    const date = new Date(safeDateTime);
    if (isNaN(date.getTime())) return dateTimeString;

    const options = {
      year: 'numeric',
      month: 'numeric', // bisa diganti 'long' kalau mau nama bulan
      day: 'numeric',
    };

    // tampilkan tanggal lokal sesuai zona waktu browser
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateTimeString;
  }
};


// Utility function to format time to user's local timezone
const formatToLocalTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  
  try {
    // Pastikan string waktu dianggap UTC dengan menambahkan 'Z' jika belum ada
    let safeDateTime = dateTimeString.trim();
    if (!safeDateTime.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(safeDateTime)) {
      safeDateTime += 'Z';
    }

    const date = new Date(safeDateTime);
    if (isNaN(date.getTime())) return dateTimeString; // Jika invalid date

    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      // timeZoneName: 'short' // aktifkan kalau mau tampil "GMT+7" misalnya
    };

    return date.toLocaleTimeString(undefined, options);
  } catch (error) {
    console.error('Error formatting time:', error);
    return dateTimeString;
  }
};


const ImageModal = ({ image, isOpen, onClose }) => {
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

  if (!isOpen || !image) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch the image with Authorization header
      const response = await fetch(image.url, {
        method: 'GET',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        // Handle 401 Unauthorized - Clear token and redirect to login
        if (response.status === 401) {
          handleUnauthorized();
          return; // Don't show error toast, handleUnauthorized will redirect
        }
        
        throw new Error(`Failed to download image (${response.status})`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link to download the image
      const link = document.createElement('a');
      link.href = url;
      link.download = image.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);
      
      // Show success toast
      toast.success('Image downloaded successfully');
    } catch (error) {
      console.error('Failed to download image:', error);
      toast.error(error.message || 'Failed to download image. Please try again.');
    }
  };

  return (
    <div className="image-modal" onClick={handleBackdropClick}>
      <div className="image-modal__content">
        <div className="image-modal__header">
          <div className="image-modal__title">
            <FileText size={20} />
            <span>{image.filename}</span>
          </div>
          <div className="image-modal__actions">
            <button 
              className="image-modal__action-btn"
              onClick={handleDownload}
              title="Download Image"
            >
              <Download size={18} />
            </button>
            <button 
              className="image-modal__close-btn"
              onClick={onClose}
              title="Close Modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="image-modal__body">
          <div className="image-modal__image-container">
            <AuthImage 
              src={image.url} 
              alt={image.filename}
              className="image-modal__image"
            />
            {image.annotations && (
              <div className="image-modal__annotations">
                {image.annotations.map((annotation, idx) => (
                  <div
                    key={idx}
                    className="image-modal__annotation"
                    style={{
                      left: `${annotation.x}%`,
                      top: `${annotation.y}%`,
                      width: `${annotation.width}%`,
                      height: `${annotation.height}%`,
                      borderColor: annotation.color || '#10b981'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="image-modal__details">
            <div className="image-modal__detail-section">
              {/* <h3>Image Information</h3> */}
              <div className="image-modal__detail-grid">
                {/* <div className="image-modal__detail-item">
                  <FileText size={16} />
                  <div>
                    <label>Filename</label>
                    <span>{image.filename}</span>
                  </div>
                </div> */}
                
                {/* <div className="image-modal__detail-item">
                  <Calendar size={16} />
                  <div>
                    <label>Date</label>
                    <span className="image-modal__date">{formatToLocalDate(image.detectionDateTime)}</span>
                  </div>
                </div>
                
                <div className="image-modal__detail-item">
                  <Clock size={16} />
                  <div>
                    <label>Time</label>
                    <span className="image-modal__time">{formatToLocalTime(image.detectionDateTime)}</span>
                  </div>
                </div> */}
                
                <div className="image-modal__detail-item">
                <Calendar size={16} />
                  <div>
                    <label>Date & Time</label>
                    <div className="image-modal__time-badge-2-container">
                      <span className={`image-modal__time-badge ${(image.time_period || '').toLowerCase()}`}>
                        {formatToLocalDate(image.detection_date_time || image.detectionDateTime)} 
                      </span>
                      <span className={`image-modal__time-badge-2 ${(image.time_period || '').toLowerCase()}`}>
                        {formatToLocalTime(image.detection_date_time || image.detectionDateTime)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="image-modal__detail-item">
                  <Clock size={16} />
                  <div>
                    <label>Delivery Slot</label>
                    <span className={`image-modal__time-badge ${(image.time_period || '').toLowerCase()}`}>
                      {image.time_period || 'Unknown'}
                    </span>
                  </div>
                </div>
                
                <div className="image-modal__detail-item">
                  {/* <Eye size={16} /> */}
                  <div>
                    <label>UUID Delivery ID</label>
                    <span className="image-modal__uuid">{image.uuid_delivery_id || image.delivery_id || '-'}</span>
                  </div>
                </div>

                <div className="image-modal__detail-item">
                  <div>
                    <label>Invoice Number</label>
                    <span className="image-modal__uuid">{image.invoice_number || image.invoiceNumber || '-'}</span>
                  </div>
                </div>
                
                {image.total_objects !== undefined && (
                  <div className="image-modal__detail-item">
                    <div>
                      <label>Total Objects</label>
                      <span className="image-modal__uuid">{image.total_objects}</span>
                    </div>
                  </div>
                )}
                
                {image.high_confidence_count !== undefined && (
                  <div className="image-modal__detail-item">
                    <div>
                      <label>High Confidence Count</label>
                      <span className="image-modal__uuid">{image.high_confidence_count}</span>
                    </div>
                  </div>
                )}
                
                {/* Show SKU Items if available - Filter only OcrVsFoodLabel source */}
                {(() => {
                  const filteredSkuItems = image.skuItems && Array.isArray(image.skuItems) 
                    ? image.skuItems.filter(sku => sku.source === 'OcrVsFoodLabel')
                    : [];
                  
                  return filteredSkuItems.length > 0 && (
                    <div className="image-modal__detail-item image-modal__detail-item--full">
                      <div className="image-modal__sku-items">
                        <label>SKU Items ({filteredSkuItems.length})</label>
                        <div className="image-modal__sku-list">
                          {filteredSkuItems.map((sku, index) => (
                            <div key={index} className="image-modal__sku-item">
                              <div className="image-modal__sku-header">
                                <span className="image-modal__sku-name">{sku.itemName || sku.name || 'Unknown'}</span>
                                <span className={`image-modal__sku-status image-modal__sku-status--${(sku.status || '').toLowerCase()}`}>
                                  {sku.status || 'N/A'}
                                </span>
                              </div>
                              <div className="image-modal__sku-source">
                                Source: {sku.source || 'Unknown'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* {image.annotations && image.annotations.length > 0 && (
              <div className="image-modal__detail-section">
                <h3>Annotations</h3>
                <div className="image-modal__annotations-list">
                  {image.annotations.map((annotation, idx) => (
                    <div key={idx} className="image-modal__annotation-item">
                      <div 
                        className="image-modal__annotation-color"
                        style={{ backgroundColor: annotation.color || '#10b981' }}
                      />
                      <div className="image-modal__annotation-details">
                        <span>Position: {annotation.x.toFixed(1)}%, {annotation.y.toFixed(1)}%</span>
                        <span>Size: {annotation.width.toFixed(1)}% × {annotation.height.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
