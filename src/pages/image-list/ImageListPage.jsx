import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
// import { useTranslation } from 'react-i18next';
import { setPageTitle, setBreadcrumbs } from '../../store/slices/uiSlice';
import { reportsService } from '../../services/api';
import { Search } from 'lucide-react';
import Input from '../../components/ui/Input';
import DatePicker from '../../components/ui/DatePicker';
import ImageGrid from '../../components/ui/ImageGrid';
import ImageModal from '../../components/ui/ImageModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './ImageListPage.scss';

const ImageListPage = () => {
  // const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDeliveryId, setSearchDeliveryId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterTimePeriod, setFilterTimePeriod] = useState('');
  const [imagesPerPage, setImagesPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [allImages, setAllImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0); // Total from API response
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_loading, _setLoading] = useState(true);
  const [_error, _setError] = useState(null);

  // Load images from API
  useEffect(() => {
    const loadImages = async () => {
      _setLoading(true);
      _setError(null);
      
      try {
        // Build API parameters
        const apiParams = {
          page: currentPage,
          pageSize: imagesPerPage,
          total: imagesPerPage,
          includeDetails: true,
        };

        // Add API-supported filters
        if (filterDate) {
          apiParams.date = filterDate;
        }
        
        if (filterTimePeriod) {
          apiParams.timeOfDay = filterTimePeriod;
        }

        // Add invoice number search filter
        if (searchQuery) {
          apiParams.invoiceNumber = searchQuery;
        }

        // Add delivery ID search filter
        if (searchDeliveryId) {
          apiParams.deliveryId = searchDeliveryId;
        }

        console.log('API Parameters:', apiParams);
        
        const result = await reportsService.getImages(apiParams);

        if (result.success) {
          // Transform API response to include image URLs
          const transformedData = (result.data.data || result.data.items || []).map(item => ({
            ...item,
            // Generate image URL using the id from API response
            url: reportsService.getRawImageUrl(item.id),
            // Keep other fields or provide defaults
            filename: item.filename || item.name || `image_${item.id}`,
            uuid_delivery_id: item.uuid_delivery_id || item.deliveryId || item.delivery_id || '-',
            date: item.date || item.timestamp || new Date().toISOString().split('T')[0],
            time_period: item.time_period || item.timeOfDay || item.timePeriod || 'Unknown',
            annotations: item.annotations || null,
            skuItems: item.skuItems || item.sku_items || item.skus || null, // Support various field names
          }));
          
          // Get total records from API response
          const total = result.data.total || transformedData.length;
          
          console.log('API Response - Transformed images:', transformedData);
          console.log('API Response - Total records:', total);
          
          setAllImages(transformedData);
          setFilteredImages(transformedData);
          setTotalRecords(total);
        } else {
          // API failed - show empty state
          console.error('API failed:', result.error);
          setAllImages([]);
          setFilteredImages([]);
          setTotalRecords(0);
          _setError(result.error);
        }
      } catch (err) {
        // Error occurred - show empty state
        console.error('API error:', err);
        setAllImages([]);
        setFilteredImages([]);
        setTotalRecords(0);
        _setError(err.message || 'Failed to load images');
      } finally {
        _setLoading(false);
      }
    };

    loadImages();
  }, [currentPage, imagesPerPage, filterDate, filterTimePeriod, searchQuery, searchDeliveryId]);

  useEffect(() => {
    dispatch(setPageTitle('Image List'));
    dispatch(setBreadcrumbs([
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Image List', path: '/dashboard/image-list' }
    ]));
  }, [dispatch]);

  // Client-side filtering (only for filters NOT handled by API)
  useEffect(() => {
    let filtered = allImages;

    // Filter by filename (separate from search)
    // This is for the dedicated "Filter by filename" input field
    if (filterName) {
      filtered = filtered.filter(img => 
        img.filename.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    // Note: searchQuery, filterDate, and filterTimePeriod are now handled by API
    // No need to filter them here again (avoid duplication)

    console.log('Client-side filtering applied:', {
      filterName,
      originalCount: allImages.length,
      filteredCount: filtered.length
    });

    setFilteredImages(filtered);
    
    // Reset to page 1 when filter changes
    if (filterName) {
      setCurrentPage(1);
    }
  }, [filterName, allImages]);

  const handleImageClick = (image) => {
    console.log('Image clicked:', image);
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Generate page numbers with ellipsis
  const generatePageNumbers = (currentPage, totalPages) => {
    const pages = [];
    const maxVisible = 5; // Maximum visible page numbers
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Show first few pages
        for (let i = 2; i <= Math.min(4, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push('...');
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages
        if (totalPages > 4) {
          pages.push('...');
        }
        for (let i = Math.max(totalPages - 3, 2); i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current page
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };


  const timePeriods = ['Morning', 'Evening'];

  // Pagination is handled by API, so we display all filtered images directly
  // Only apply client-side pagination if filterName is active (client-side filter)
  const shouldUseClientPagination = filterName !== '';
  
  let currentImages, totalPages, startIndex, endIndex;
  
  if (shouldUseClientPagination) {
    // Client-side pagination for client-side filtered results
    startIndex = (currentPage - 1) * imagesPerPage;
    endIndex = startIndex + imagesPerPage;
    currentImages = filteredImages.slice(startIndex, endIndex);
    totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  } else {
    // API pagination - display all results from API
    currentImages = filteredImages;
    totalPages = Math.ceil(totalRecords / imagesPerPage);
    startIndex = (currentPage - 1) * imagesPerPage;
    endIndex = startIndex + filteredImages.length;
  }

  return (
    <div className="image-list-page">
      <div className="image-list-page__header">
        <div className="image-list-page__title">
          {/* <h1>Image Management</h1> */}
          {/* <p>Browse and manage your image collection</p> */}
        </div>
      </div>

      {/* Search Bar */}
      <div className="image-list-page__search">
        <Input
          placeholder="Search Invoice Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="lg"
          icon={<Search size={16} />}
          iconPosition="left"
          className="image-list-page__search-input"
        />
      {/* </div>
      <div className="image-list-page__search"> */}
        <Input
          placeholder="Search Delivery ID"
          value={searchDeliveryId}
          onChange={(e) => setSearchDeliveryId(e.target.value)}
          size="lg"
          icon={<Search size={16} />}
          iconPosition="left"
          className="image-list-page__search-input"
        />
      </div>

      {/* Filters */}
      <div className="image-list-page__filters">
        <div className="image-list-page__filter-group">
          <Input
            placeholder="Filter by filename"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            size="sm"
            icon={<Search size={16} />}
            iconPosition="left"
            className="image-list-page__filter-input"
          />
        </div>
        
        <div className="image-list-page__filter-group">
          <DatePicker
            value={filterDate}
            onChange={setFilterDate}
            placeholder="Select date"
            className="image-list-page__date-picker"
          />
        </div>
        
        <div className="image-list-page__filter-group">
          <select 
            className="image-list-page__filter-select"
            value={filterTimePeriod}
            onChange={(e) => setFilterTimePeriod(e.target.value)}
          >
            <option value="">All Times</option>
            {timePeriods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Image Grid */}
      <div className="image-list-page__content">
        {_loading ? (
          <div className="image-list-page__loading">
            <LoadingSpinner />
            <p>Loading images...</p>
          </div>
        ) : _error ? (
          <div className="image-list-page__error">
            <p>Failed to load images: {_error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : currentImages.length === 0 ? (
          <div className="image-list-page__empty">
            <p>No images found</p>
            {(searchQuery || searchDeliveryId || filterName || filterDate || filterTimePeriod) && (
              <p>Try adjusting your filters</p>
            )}
          </div>
        ) : (
          <ImageGrid 
            images={currentImages} 
            onImageClick={handleImageClick}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="image-list-page__pagination">
        <div className="image-list-page__pagination-info">
          <select 
            className="image-list-page__per-page-select"
            value={imagesPerPage}
            onChange={(e) => setImagesPerPage(Number(e.target.value))}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>Images per page</span>
        </div>
        
        <div className="image-list-page__pagination-controls">
          <button 
            className="image-list-page__pagination-btn image-list-page__pagination-btn--nav"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt;
          </button>
          
          <div className="image-list-page__page-numbers">
            {generatePageNumbers(currentPage, totalPages).map((page, index) => (
              <button
                key={index}
                className={`image-list-page__page-btn ${
                  page === currentPage ? 'image-list-page__page-btn--active' : ''
                } ${page === '...' ? 'image-list-page__page-btn--ellipsis' : ''}`}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            className="image-list-page__pagination-btn image-list-page__pagination-btn--nav"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &gt;
          </button>
        </div>

        <div className="image-list-page__go-to-page">
          <span>Go to page:</span>
          <select
            className="image-list-page__go-to-select"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal 
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ImageListPage;
