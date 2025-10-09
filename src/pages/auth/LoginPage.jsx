import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginStart, loginSuccess, loginFailure, selectAuth } from '../../store/slices/authSlice';
import { authService } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import LanguageSelector from '../../components/ui/LanguageSelector';
import './LoginPage.scss';

const LoginPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(selectAuth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard/image-list', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = t('validation.usernameRequired');
    }

    if (!formData.password) {
      errors.password = t('validation.passwordRequired');
    } else if (formData.password.length < 6) {
      errors.password = t('validation.passwordMinLength');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(loginStart());

    try {
      // Call real API
      const result = await authService.login(formData.username, formData.password);

      if (result.success) {
        // Store token
        localStorage.setItem('token', result.data.token);
        
        // Try to get user profile (optional, use fallback if fails)
        let userResult;
        try {
          userResult = await authService.getCurrentUser();
        } catch (error) {
          console.warn('Failed to get user profile, using fallback:', error);
          userResult = { success: false };
        }
        
        if (userResult && userResult.success) {
          dispatch(loginSuccess({
            user: userResult.data,
            token: result.data.token,
          }));
        } else {
          // Fallback: create user object from login data
          const mockUser = {
            id: 1,
            username: formData.username,
            name: formData.username === 'admin' ? 'Administrator' : 'Staff User',
            email: formData.username === 'admin' ? 'admin@calo.com' : 'staff@calo.com',
            role: formData.username === 'admin' ? 'admin' : 'staff',
            avatar: null,
          };

          dispatch(loginSuccess({
            user: mockUser,
            token: result.data.token,
          }));
        }
      } else {
        throw new Error(result.error || t('auth.loginError'));
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  if (loading) {
    return (
      <div className="auth-page__loading">
        <LoadingSpinner size="lg" color="white" text={t('auth.loggingIn')} />
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* Language Selector */}
      <div className="auth-page__language-selector">
        <LanguageSelector variant="auth" />
      </div>

      {/* Left Panel - Welcome Back */}
      <div className="auth-page__left-panel">
        <div className="auth-page__left-content">
          <div className="auth-page__logo">
            <div className="auth-page__logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="white" fillOpacity="0.2"/>
                <rect x="8" y="8" width="24" height="24" rx="4" fill="white"/>
                <rect x="12" y="12" width="16" height="16" rx="2" fill="#4ECDC4"/>
              </svg>
            </div>
            <span className="auth-page__logo-text">C A L O</span>
          </div>
          
          <div className="auth-page__welcome">
            <h1>{t('auth.welcomeBack')}</h1>
            <p>{t('auth.welcomeLoginMessage')}</p>
          </div>
          
          {/* <Button
            variant="secondary"
            size="lg"
            className="auth-page__switch-btn"
          >
            {t('auth.needHelp')}
          </Button> */}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="auth-page__right-panel">
        <div className="auth-page__right-content">
          <div className="auth-page__form-header">
            <h2>{t('auth.signInToAccount')}</h2>
            <p>{t('auth.enterCredentials')}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-form__error">
                {error}
              </div>
            )}

            <div className="auth-form__fields">
              <Input
                type="text"
                placeholder={t('auth.username')}
                value={formData.username}
                onChange={handleInputChange('username')}
                error={formErrors.username}
                required
                fullWidth
                className="auth-form__input"
                autoComplete="username"
              />

              <Input
                type="password"
                placeholder={t('auth.password')}
                value={formData.password}
                onChange={handleInputChange('password')}
                error={formErrors.password}
                required
                fullWidth
                className="auth-form__input"
                autoComplete="current-password"
              />
            </div>

            <div className="auth-form__options">
              <label className="auth-form__checkbox">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange('rememberMe')}
                />
                <span className="auth-form__checkbox-mark"></span>
                <span className="auth-form__checkbox-text">
                  {t('auth.rememberMe')}
                </span>
              </label>

              <a href="#" className="auth-form__forgot-password">
                {t('auth.forgotPassword')}
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="auth-form__submit"
            >
              {t('auth.signIn')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
