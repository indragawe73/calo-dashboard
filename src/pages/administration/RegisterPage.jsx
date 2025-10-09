import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setPageTitle, setBreadcrumbs } from '../../store/slices/uiSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './RegisterPage.scss';

const RegisterPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(setPageTitle(t('admin.registerAccount')));
    dispatch(setBreadcrumbs([
      { label: t('breadcrumbs.dashboard'), path: '/dashboard' },
      { label: t('navigation.administration'), path: '/dashboard/administration' },
      { label: t('admin.registerAccount'), path: '/dashboard/administration/register' },
    ]));
  }, [dispatch, t]);

  const roleOptions = [
    { value: 'admin', label: t('roles.admin') },
    { value: 'staff', label: t('roles.staff') },
  ];

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = t('validation.usernameRequired');
    } else if (formData.username.length < 3) {
      errors.username = t('validation.usernameMinLength');
    }

    if (!formData.name.trim()) {
      errors.name = t('validation.nameRequired');
    }

    if (!formData.email.trim()) {
      errors.email = t('validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('validation.emailInvalid');
    }

    if (!formData.password) {
      errors.password = t('validation.passwordRequired');
    } else if (formData.password.length < 6) {
      errors.password = t('validation.passwordMinLength');
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = t('validation.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('validation.passwordsDoNotMatch');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
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

    setLoading(true);
    setSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically make an API call to register the user
      console.log('Registering user:', {
        ...formData,
        password: '[HIDDEN]',
        confirmPassword: '[HIDDEN]',
        createdBy: currentUser.username
      });

      setSuccess(true);
      setFormData({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'staff',
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if current user is admin
  if (currentUser?.role !== 'admin') {
    return (
      <div className="register-page">
        <Card className="register-page__error" padding="lg">
          <div className="register-page__error-content">
            <h2>{t('errors.accessDenied')}</h2>
            <p>{t('errors.adminRequired')}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-page__container">
        <div className="register-page__header">
          <h1>{t('admin.registerAccount')}</h1>
          <p>{t('admin.registerDescription')}</p>
        </div>

        <Card className="register-page__form-card">
          {success && (
            <div className="register-page__success">
              <div className="register-page__success-content">
                <h3>{t('admin.accountCreated')}</h3>
                <p>{t('admin.accountCreatedDescription')}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-form__row">
              <div className="register-form__field">
                <Input
                  type="text"
                  label={t('auth.username')}
                  placeholder={t('auth.usernamePlaceholder')}
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  error={formErrors.username}
                  required
                  fullWidth
                />
              </div>

              <div className="register-form__field">
                <Input
                  type="text"
                  label={t('auth.fullName')}
                  placeholder={t('auth.fullNamePlaceholder')}
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  error={formErrors.name}
                  required
                  fullWidth
                />
              </div>
            </div>

            <div className="register-form__row">
              <div className="register-form__field">
                <Input
                  type="email"
                  label={t('auth.email')}
                  placeholder={t('auth.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={formErrors.email}
                  required
                  fullWidth
                />
              </div>

              <div className="register-form__field">
                <Select
                  label={t('auth.role')}
                  value={formData.role}
                  onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                  options={roleOptions}
                  fullWidth
                />
              </div>
            </div>

            <div className="register-form__row">
              <div className="register-form__field">
                <Input
                  type="password"
                  label={t('auth.password')}
                  placeholder={t('auth.passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={formErrors.password}
                  required
                  fullWidth
                />
              </div>

              <div className="register-form__field">
                <Input
                  type="password"
                  label={t('auth.confirmPassword')}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  error={formErrors.confirmPassword}
                  required
                  fullWidth
                />
              </div>
            </div>

            <div className="register-form__actions">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    {t('admin.creatingAccount')}
                  </>
                ) : (
                  t('admin.createAccount')
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
