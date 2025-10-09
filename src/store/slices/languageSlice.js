import { createSlice } from '@reduxjs/toolkit';

const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) {
    return savedLanguage;
  }
  
  // Check browser language
  const browserLanguage = navigator.language || navigator.userLanguage;
  
  if (browserLanguage.startsWith('id')) {
    return 'id';
  } else if (browserLanguage.startsWith('ar')) {
    return 'ar';
  }
  
  return 'en';
};

const initialState = {
  currentLanguage: getInitialLanguage(),
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  ],
  isRTL: false,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      state.isRTL = action.payload === 'ar';
      localStorage.setItem('language', action.payload);
      
      // Apply RTL direction to document
      document.documentElement.dir = state.isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = action.payload;
    },
    toggleLanguage: (state) => {
      const currentIndex = state.supportedLanguages.findIndex(
        lang => lang.code === state.currentLanguage
      );
      const nextIndex = (currentIndex + 1) % state.supportedLanguages.length;
      const nextLanguage = state.supportedLanguages[nextIndex].code;
      
      state.currentLanguage = nextLanguage;
      state.isRTL = nextLanguage === 'ar';
      localStorage.setItem('language', nextLanguage);
      
      // Apply RTL direction to document
      document.documentElement.dir = state.isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = nextLanguage;
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;

export default languageSlice.reducer;

// Selectors
export const selectCurrentLanguage = (state) => state.language.currentLanguage;
export const selectSupportedLanguages = (state) => state.language.supportedLanguages;
export const selectIsRTL = (state) => state.language.isRTL;
export const selectCurrentLanguageInfo = (state) => 
  state.language.supportedLanguages.find(lang => lang.code === state.language.currentLanguage);
