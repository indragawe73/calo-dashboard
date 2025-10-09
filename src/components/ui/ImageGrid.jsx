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
                        borderColor: annotation.color || '#10b981'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="image-grid__info">
              <div className="image-grid__filename">{image.filename}</div>
              <div className="image-grid__details">
                <span className="image-grid__uuid">{image.uuid_delivery_id}</span>
                <span className="image-grid__date">
                  {new Date(image.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>
                <span className={`image-grid__time ${image.time_period.toLowerCase()}`}>
                  {image.time_period}
                </span>
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
