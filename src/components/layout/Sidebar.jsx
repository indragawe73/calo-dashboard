import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home,
  Users,
  Shield,
  Star,
  FileText,
  Settings,
  BookOpen,
  Clipboard,
  MessageSquare,
  Calendar,
  Code,
  BarChart3,
  MapPin,
  Package,
  Boxes,
  Tag,
  Palette,
  Layers,
  Shapes,
  Globe,
  Building,
  Target,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  UserPlus,
  Clock
} from 'lucide-react';
import { selectSidebarCollapsed, selectSidebarOpen, setSidebarOpen } from '../../store/slices/uiSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import './Sidebar.scss';

const Sidebar = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const sidebarCollapsed = useSelector(selectSidebarCollapsed);
  const sidebarOpen = useSelector(selectSidebarOpen);
  const currentUser = useSelector(selectCurrentUser);
  
  const [expandedMenus, setExpandedMenus] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Get user's timezone and offset
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Get GMT offset
  const getTimezoneOffset = () => {
    const offset = -currentTime.getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';
    return `GMT${sign}${hours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''}`;
  };
  
  // Format timezone display
  const formatTimezone = () => {
    const city = userTimezone.split('/').pop().replace(/_/g, ' ');
    return `${city} (${getTimezoneOffset()})`;
  };

  // Menu structure with icons and nested items
  const getMenuItems = () => {
    const baseItems = [
      // {
      //   id: 'dashboard',
      //   label: t('navigation.dashboard'),
      //   icon: <Home size={20} />,
      //   path: '/dashboard',
      // },
      // {
      //   id: 'form-report',
      //   label: t('navigation.formReport'),
      //   icon: <FileText size={20} />,
      //   path: '/dashboard/form-report/forms',
      // },
      {
        id: 'image-1',
        label: 'Station 1',
        icon: <FileText size={20} />,
        path: '/dashboard/image-list?station=1',
      },
      {
        id: 'image-2',
        label: 'Station 2',
        icon: <FileText size={20} />,
        path: '/dashboard/image-list?station=2',
      },
      {
        id: 'image-3',
        label: 'Station 3',
        icon: <FileText size={20} />,
        path: '/dashboard/image-list?station=3',
      },
      {
        id: 'job-schedules',
        label: t('navigation.jobSchedules'),
        icon: <Clock size={20} />,
        path: '/dashboard/job-schedules',
      },
      // {
      //   id: 'administration',
      //   label: t('navigation.administration'),
      //   icon: <Settings size={20} />,
      //   path: '/dashboard/administration/site-details',
      // },
      // {
      //   id: 'procedure',
      //   label: t('navigation.procedure'),
      //   icon: <Clipboard size={20} />,
      //   path: '/dashboard/procedure/sops'
      // },
      // {
      //   id: 'standard-code',
      //   label: t('navigation.standardCode'),
      //   icon: <Code size={20} />,
      //   path: '/dashboard/standard-code/chart-of-accounts',
      // },
      // {
      //   id: 'form-report',
      //   label: t('navigation.formReport'),
      //   icon: <FileText size={20} />,
      //   path: '/dashboard/form-report/forms',
      // },
    ];

    // Add admin-only menu items
    if (currentUser?.role === 'admin') {
      baseItems.push({
        id: 'register',
        label: t('navigation.registerAccount'),
        icon: <UserPlus size={20} />,
        path: '/dashboard/administration/register',
      });
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  // Close sidebar on mobile when clicking outside
  const handleOverlayClick = () => {
    dispatch(setSidebarOpen(false));
  };

  // Toggle menu expansion
  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // Check if current path matches menu item
  const isActiveMenuItem = useCallback((item) => {
    if (item.path) {
      // Split path and query string
      const [itemPath, itemQuery] = item.path.split('?');
      const currentPath = location.pathname;
      const currentQuery = location.search;
      
      // Check if pathname matches
      if (currentPath !== itemPath) {
        return false;
      }
      
      // If item has query parameter, check if it matches
      if (itemQuery) {
        const itemParams = new URLSearchParams(itemQuery);
        const currentParams = new URLSearchParams(currentQuery);
        
        // Check if all item query parameters match current query parameters
        for (const [key, value] of itemParams.entries()) {
          if (currentParams.get(key) !== value) {
            return false;
          }
        }
        return true;
      }
      
      // If item has no query parameter, check if current also has no query (or only matching base path)
      return !currentQuery || currentQuery === '';
    }
    if (item.children) {
      return item.children.some(child => isActiveMenuItem(child));
    }
    return false;
  }, [location.pathname, location.search]);

  // Auto-expand menu if it contains active item
  useEffect(() => {
    const findActiveMenu = (items) => {
      items.forEach(item => {
        if (item.children) {
          const hasActiveChild = item.children.some(child => isActiveMenuItem(child));
          if (hasActiveChild) {
            setExpandedMenus(prev => ({ ...prev, [item.id]: true }));
          }
          findActiveMenu(item.children);
        }
      });
    };

    findActiveMenu(menuItems);
  }, [location.pathname, menuItems, isActiveMenuItem]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCalendar && !event.target.closest('.sidebar__widget')) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);

  // Navigate to previous month
  const previousMonth = () => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  // Navigate to next month
  const nextMonth = () => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Reset to current month
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // Get month and year for calendar header
  const getCalendarHeader = () => {
    return selectedDate.toLocaleDateString(i18n.language, {
      month: 'long',
      year: 'numeric',
      timeZone: userTimezone
    });
  };

  // Check if a day is today
  const isToday = (day) => {
    if (!day) return false;
    const today = currentTime;
    return (
      day === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  // Get day names
  const getDayNames = () => {
    const baseDate = new Date(2024, 0, 7); // A Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      return date.toLocaleDateString(i18n.language, { weekday: 'short' });
    });
  };

  // Render menu item
  const renderMenuItem = (item, level = 0) => {
    const isActive = isActiveMenuItem(item);
    const isExpanded = expandedMenus[item.id];
    const hasChildren = item.children && item.children.length > 0;

    const itemClasses = [
      'sidebar__menu-item',
      `sidebar__menu-item--level-${level}`,
      isActive && 'sidebar__menu-item--active',
      hasChildren && 'sidebar__menu-item--has-children',
      isExpanded && 'sidebar__menu-item--expanded',
    ].filter(Boolean).join(' ');

    const content = (
      <>
        <div className="sidebar__menu-item-content">
          {item.icon && (
            <span className="sidebar__menu-item-icon">
              {item.icon}
            </span>
          )}
          <span className="sidebar__menu-item-text">
            {item.label}
          </span>
        </div>
        {hasChildren && (
          <span className="sidebar__menu-item-arrow">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
      </>
    );

    return (
      <div key={item.id} className="sidebar__menu-group">
        {item.path ? (
          <Link
            to={item.path}
            className={itemClasses}
            data-tooltip={item.label}
            onClick={() => window.innerWidth < 1024 && dispatch(setSidebarOpen(false))}
          >
            {content}
          </Link>
        ) : (
          <button
            className={itemClasses}
            data-tooltip={item.label}
            onClick={() => hasChildren && toggleMenu(item.id)}
            type="button"
          >
            {content}
          </button>
        )}
        
        {hasChildren && isExpanded && (
          <div className="sidebar__submenu">
            {item.children.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const sidebarClasses = [
    'sidebar',
    sidebarCollapsed && 'sidebar--collapsed',
    sidebarOpen && 'sidebar--open',
  ].filter(Boolean).join(' ');

  return (
    <>
      <aside className={sidebarClasses}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            {/* <div className="sidebar__logo-icon">📚</div> */}
            <div className="sidebar__logo-text">
              <div className="sidebar__logo-title">C A L O</div>
              <div className="sidebar__logo-subtitle">Dashboard</div>
            </div>
          </div>
          
          {/* Mobile close button */}
          <button
            className="sidebar__close"
            onClick={() => dispatch(setSidebarOpen(false))}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__menu">
            {menuItems.map(item => renderMenuItem(item))}
          </div>
        </nav>
        
        <div className="sidebar__widget">
          <div 
            className="sidebar__widget-content"
            onClick={() => setShowCalendar(!showCalendar)}
            style={{ cursor: 'pointer' }}
          >
            <div className="sidebar__widget-icon">
              <Clock size={20} />
            </div>
            <div className="sidebar__widget-info">
              <div className="sidebar__widget-time">
                {currentTime.toLocaleTimeString(i18n.language, {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                  timeZone: userTimezone
                })}
              </div>
              <div className="sidebar__widget-date">
                {currentTime.toLocaleDateString(i18n.language, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  timeZone: userTimezone
                })}
              </div>
              <div className="sidebar__widget-timezone">
                {formatTimezone()}
              </div>
            </div>
          </div>

          {/* Calendar Popup */}
          {showCalendar && (
            <div className="sidebar__calendar">
              <div className="sidebar__calendar-header">
                <button 
                  className="sidebar__calendar-nav"
                  onClick={previousMonth}
                  type="button"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <button
                  className="sidebar__calendar-month"
                  onClick={goToToday}
                  type="button"
                  title="Go to today"
                >
                  {getCalendarHeader()}
                </button>
                
                <button 
                  className="sidebar__calendar-nav"
                  onClick={nextMonth}
                  type="button"
                  aria-label="Next month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="sidebar__calendar-weekdays">
                {getDayNames().map((day, index) => (
                  <div key={index} className="sidebar__calendar-weekday">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="sidebar__calendar-days">
                {generateCalendarDays().map((day, index) => (
                  <div
                    key={index}
                    className={`sidebar__calendar-day ${
                      isToday(day) ? 'sidebar__calendar-day--today' : ''
                    } ${!day ? 'sidebar__calendar-day--empty' : ''}`}
                  >
                    {day || ''}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar__overlay" onClick={handleOverlayClick} />
      )}
    </>
  );
};

export default Sidebar;
