import { useState, useEffect } from 'react';
import { handleUnauthorized } from '../../utils/authHandler';
import toast from '../../utils/toast';
import './AuthImage.scss';

/**
 * AuthImage component - Loads images with Authorization header
 * Fetches image as blob and converts to object URL for display
 */
const AuthImage = ({ src, alt, className, onLoad, onError, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      setError(true);
      return;
    }

    const loadImage = async () => {
      setLoading(true);
      setError(false);

      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(src, {
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
          
          throw new Error(`Failed to load image (${response.status})`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        setImageSrc(objectUrl);
        setLoading(false);
        
        if (onLoad) {
          onLoad();
        }
      } catch (err) {
        console.error('Failed to load image:', err);
        setError(true);
        setLoading(false);
        
        // Show error toast
        toast.error(err.message || 'Failed to load image');
        
        if (onError) {
          onError(err);
        }
      }
    };

    loadImage();

    // Cleanup object URL on unmount
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src]);

  if (loading) {
    return (
      <div className={`auth-image-loading ${className || ''}`} {...props}>
        <div className="auth-image-spinner" />
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <div className={`auth-image-error ${className || ''}`} {...props}>
        <span>Failed to load image</span>
      </div>
    );
  }

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className}
      {...props}
    />
  );
};

export default AuthImage;

