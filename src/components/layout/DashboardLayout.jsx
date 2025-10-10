import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme } from '../../store/slices/themeSlice';
import { selectCurrentLanguage } from '../../store/slices/languageSlice';
import { selectSidebarCollapsed, selectSidebarOpen } from '../../store/slices/uiSlice';
import Header from './Header';
import Sidebar from './Sidebar';
import './DashboardLayout.scss';

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const currentLanguage = useSelector(selectCurrentLanguage);
  const sidebarCollapsed = useSelector(selectSidebarCollapsed);
  const sidebarOpen = useSelector(selectSidebarOpen);

  useEffect(() => {
    // Apply theme class to body for global theme changes
    document.body.className = `theme-${theme} lang-${currentLanguage}`;
  }, [theme, currentLanguage]);

  const layoutClasses = [
    'dashboard-layout',
    sidebarCollapsed && 'dashboard-layout--sidebar-collapsed',
    sidebarOpen && 'dashboard-layout--sidebar-open',
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses}>
      <div className='line-head'></div>
      <Header />
      <Sidebar />
      <main className="dashboard-layout__main">
        <div className="dashboard-layout__content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
