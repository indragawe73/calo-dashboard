import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import { ToastProvider } from './contexts/ToastContext'
import './utils/i18n'
import './styles/main.scss'
import App from './App.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Initialize theme on app start
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Initialize language direction
const savedLanguage = localStorage.getItem('language') || 'en';
document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLanguage;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
