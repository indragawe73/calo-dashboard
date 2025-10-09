import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Moon, 
  Sun, 
  Globe,
  ChevronDown 
} from 'lucide-react';
import { toggleTheme, selectTheme } from '../../store/slices/themeSlice';
import { setLanguage, selectCurrentLanguage, selectSupportedLanguages } from '../../store/slices/languageSlice';
import { toggleSidebar, setSidebarOpen, selectNotifications, selectUnreadNotifications } from '../../store/slices/uiSlice';
import { logout, selectCurrentUser } from '../../store/slices/authSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';
import './Header.scss';

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const currentLanguage = useSelector(selectCurrentLanguage);
  const supportedLanguages = useSelector(selectSupportedLanguages);
  const user = useSelector(selectCurrentUser);
  const notifications = useSelector(selectNotifications);
  const unreadNotifications = useSelector(selectUnreadNotifications);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
    // For mobile, also toggle sidebar open state
    if (window.innerWidth < 1024) {
      dispatch(setSidebarOpen(true));
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLanguageChange = (languageCode) => {
    dispatch(setLanguage(languageCode));
    i18n.changeLanguage(languageCode);
    setShowLanguageMenu(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowProfileMenu(false);
  };

  const currentLanguageInfo = supportedLanguages.find(lang => lang.code === currentLanguage);

  return (
    <header className="header">
      <div className="header__left">
        <Button
          variant="ghost"
          size="md"
          onClick={handleSidebarToggle}
          className="header__menu-toggle"
          icon={<Menu size={20} />}
        />
        
        {/* <div className="header__search">
          <form onSubmit={handleSearch}>
            <Input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={16} />}
              iconPosition="left"
              className="header__search-input"
            />
          </form>
        </div> */}
      </div>

      <div className="header__right">
        {/* Language Selector */}
        {/* <div className="header__dropdown">
          <Button
            variant="ghost"
            size="md"
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="header__language-toggle"
            icon={<Globe size={16} />}
          >
            <span className="header__language-flag">{currentLanguageInfo?.flag}</span>
            <ChevronDown size={14} />
          </Button>
          
          {showLanguageMenu && (
            <div className="header__dropdown-menu">
              {supportedLanguages.map((language) => (
                <button
                  key={language.code}
                  className={`header__dropdown-item ${
                    language.code === currentLanguage ? 'header__dropdown-item--active' : ''
                  }`}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <span className="header__language-flag">{language.flag}</span>
                  <span>{language.nativeName}</span>
                </button>
              ))}
            </div>
          )}
        </div> */}

        {/* Theme Toggle */}
        {/* <Button
          variant="ghost"
          size="md"
          onClick={handleThemeToggle}
          className="header__theme-toggle"
          icon={theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          title={t('theme.toggleTheme')}
        /> */}

        {/* Notifications */}
        {/* <div className="header__dropdown">
          <Button
            variant="ghost"
            size="md"
            onClick={() => setShowNotifications(!showNotifications)}
            className="header__notifications"
            icon={<Bell size={16} />}
          >
            {unreadNotifications.length > 0 && (
              <span className="header__notification-badge">
                {unreadNotifications.length}
              </span>
            )}
          </Button>
          
          {showNotifications && (
            <div className="header__dropdown-menu header__dropdown-menu--wide">
              <div className="header__notifications-header">
                <h4>{t('notifications.notifications')}</h4>
                {unreadNotifications.length > 0 && (
                  <button className="header__notifications-clear">
                    {t('notifications.markAllAsRead')}
                  </button>
                )}
              </div>
              
              <div className="header__notifications-list">
                {notifications.length === 0 ? (
                  <div className="header__notifications-empty">
                    {t('notifications.noNotifications')}
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`header__notification-item ${
                        !notification.read ? 'header__notification-item--unread' : ''
                      }`}
                    >
                      <div className="header__notification-content">
                        <div className="header__notification-title">
                          {notification.title}
                        </div>
                        <div className="header__notification-message">
                          {notification.message}
                        </div>
                        <div className="header__notification-time">
                          {new Date(notification.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {notifications.length > 5 && (
                <div className="header__notifications-footer">
                  <button className="header__notifications-view-all">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div> */}

        {/* Profile Menu */}
        <div className="header__dropdown">
          <Button
            variant="ghost"
            size="md"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="header__profile"
          >
            <div className="header__profile-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <User size={16} />
              )}
            </div>
            <span className="header__profile-name">{user?.name}</span>
            <ChevronDown size={14} />
          </Button>
          
          {showProfileMenu && (
            <div className="header__dropdown-menu">
              {/* <div className="header__profile-info">
                <div className="header__profile-name">{user?.name}</div>
                <div className="header__profile-email">{user?.email}</div>
              </div> */}
              
              {/* <div className="header__dropdown-divider"></div>
              
              <button className="header__dropdown-item">
                <User size={16} />
                <span>{t('common.profile')}</span>
              </button>
              
              <button className="header__dropdown-item">
                <Settings size={16} />
                <span>{t('common.settings')}</span>
              </button>
              
              <div className="header__dropdown-divider"></div> */}
              
              <button 
                className="header__dropdown-item header__dropdown-item--danger"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>{t('common.logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile dropdowns */}
      {(showProfileMenu || showLanguageMenu || showNotifications) && (
        <div 
          className="header__overlay" 
          onClick={() => {
            setShowProfileMenu(false);
            setShowLanguageMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
