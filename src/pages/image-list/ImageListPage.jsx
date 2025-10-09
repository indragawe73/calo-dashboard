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
  }, [currentPage, imagesPerPage, filterDate, filterTimePeriod, searchQuery]);

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

  const timePeriods = ['Morning', 'Evening'];

  // Pagination is handled by API, so we display all filtered images directly
  // Only apply client-side pagination if filterName is active (client-side filter)
  const shouldUseClientPagination = filterName !== '';
  
  let currentImages, totalPages, startIndex, endIndex, displayTotal;
  
  if (shouldUseClientPagination) {
    // Client-side pagination for client-side filtered results
    startIndex = (currentPage - 1) * imagesPerPage;
    endIndex = startIndex + imagesPerPage;
    currentImages = filteredImages.slice(startIndex, endIndex);
    totalPages = Math.ceil(filteredImages.length / imagesPerPage);
    displayTotal = filteredImages.length;
  } else {
    // API pagination - display all results from API
    currentImages = filteredImages;
    totalPages = Math.ceil(totalRecords / imagesPerPage);
    startIndex = (currentPage - 1) * imagesPerPage;
    endIndex = startIndex + filteredImages.length;
    displayTotal = totalRecords; // Use total from API response
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
          placeholder="Search Invoice Number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
            {(searchQuery || filterName || filterDate || filterTimePeriod) && (
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
            className="image-list-page__pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt;
          </button>
          <span className="image-list-page__pagination-info">
            {startIndex + 1} - {Math.min(endIndex, displayTotal)} of {displayTotal}
          </span>
          <button 
            className="image-list-page__pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &gt;
          </button>
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
