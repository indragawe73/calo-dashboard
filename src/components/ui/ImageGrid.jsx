import { useState } from 'react';
import AuthImage from './AuthImage';
import './ImageGrid.scss';

const ImageGrid = ({ images, onImageClick }) => {
  const [selectedImages, setSelectedImages] = useState(new Set());

  // const handleImageSelect = (imageId, event) => {
  //   event.stopPropagation();
  //   const newSelected = new Set(selectedImages);
  //   if (newSelected.has(imageId)) {
  //     newSelected.delete(imageId);
  //   } else {
  //     newSelected.add(imageId);
  //   }
  //   setSelectedImages(newSelected);
  // };

  const handleImageClick = (image) => {
    onImageClick?.(image);
  };

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

  return (
    <div className="image-grid">
      <div className="image-grid__container">
        {images.map((image) => (
          <div 
            key={image.id} 
            className={`image-grid__item ${selectedImages.has(image.id) ? 'selected' : ''}`}
            onClick={() => handleImageClick(image)}
          >
            <div className="image-grid__image-container">
              <AuthImage 
                src={image.url} 
                alt={image.filename}
                className="image-grid__image"
              />
              {/* <div className="image-grid__checkbox">
                <input
                  type="checkbox"
                  checked={selectedImages.has(image.id)}
                  onChange={(e) => handleImageSelect(image.id, e)}
                />
              </div> */}
              {image.annotations && (
                <div className="image-grid__annotations">
                  {image.annotations.map((annotation, idx) => (
                    <div
                      key={idx}
                      className="image-grid__annotation"
                      style={{
                        left: `${annotation.x}%`,
                        top: `${annotation.y}%`,
                        width: `${annotation.width}%`,
                        height: `${annotation.height}%`,
                        borderColor: annotation.color || '#00ba31'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="image-grid__info">
              <div className="image-grid__filename">{image.filename}</div>
              <div className="image-grid__details">
                <span className="image-grid__uuid">{image.uuid_delivery_id || image.delivery_id}</span>
                <span className="image-grid__date">
                  {image.date || ''}
                </span>
                <div>
                  <span className={`image-grid__time ${(image.time_period || '').toLowerCase()}`}>
                    {formatToLocalDate(image.detection_date_time || image.detectionDateTime)} 
                  </span>
                  <span className={`image-grid__time ${(image.time_period || '').toLowerCase()}`}>
                    {formatToLocalTime(image.detection_date_time || image.detectionDateTime)} 
                  </span>
                  <span className={`image-grid__time ${(image.time_period || '').toLowerCase()}`}>
                    {image.time_period || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedImages.size > 0 && (
        <div className="image-grid__selection-bar">
          <span>{selectedImages.size} images selected</span>
          <button className="image-grid__clear-selection" onClick={() => setSelectedImages(new Set())}>
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
