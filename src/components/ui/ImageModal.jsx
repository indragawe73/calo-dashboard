import { useEffect } from 'react';
import { X, Download, Eye, Calendar, Clock, FileText } from 'lucide-react';
import { handleUnauthorized } from '../../utils/authHandler';
import toast from '../../utils/toast';
import AuthImage from './AuthImage';
import './ImageModal.scss';

// Utility function to format datetime to user's local timezone
const formatToLocalDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  
  try {
    // Parse the datetime string to Date object
    const date = new Date(dateTimeString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return dateTimeString;
    
    // Format to user's local timezone with readable format
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Use 24-hour format
      timeZoneName: 'short' // Show timezone abbreviation
    };
    
    return date.toLocaleString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error);
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
                <div className="image-modal__detail-item">
                  <FileText size={16} />
                  <div>
                    <label>Filename</label>
                    {/* <span>{JSON.stringify(image)}</span> */}
                    <span>{image.filename}</span>
                  </div>
                </div>
                
                <div className="image-modal__detail-item">
                  <Calendar size={16} />
                  <div>
                    <label>Date & Time</label>
                    <span>{formatToLocalDateTime(image.detectionDateTime)}</span>
                    {/* <span>
                      {new Date(image.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span> */}
                  </div>
                </div>
                
                <div className="image-modal__detail-item">
                  <Clock size={16} />
                  <div>
                    <label>Delivery Slot</label>
                    {/* <label>Time Period</label> */}
                    <span className={`image-modal__time-badge ${image.time_period.toLowerCase()}`}>
                      {image.time_period}
                    </span>
                  </div>
                </div>
                
                <div className="image-modal__detail-item">
                  {/* <Eye size={16} /> */}
                  <div>
                    <label>UUID Delivery ID</label>
                    <span className="image-modal__uuid">{image.uuid_delivery_id}</span>
                  </div>
                </div>

                <div className="image-modal__detail-item">
                  <div>
                    <label>Invoice Number</label>
                    <span className="image-modal__uuid">{image.invoiceNumber}</span>
                  </div>
                </div>
                
                {/* Show SKU Items if available */}
                {image.skuItems && Array.isArray(image.skuItems) && image.skuItems.length > 0 && (
                  <div className="image-modal__detail-item image-modal__detail-item--full">
                    <div className="image-modal__sku-items">
                      <label>SKU Items ({image.skuItems.length})</label>
                      <div className="image-modal__sku-list">
                        {image.skuItems.map((sku, index) => (
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
                )}
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
