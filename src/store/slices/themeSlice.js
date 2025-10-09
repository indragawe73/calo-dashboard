import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

const initialState = {
  theme: getInitialTheme(),
  systemTheme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', newTheme);
    },
    setSystemTheme: (state, action) => {
      state.systemTheme = action.payload;
    },
  },
});

export const { setTheme, toggleTheme, setSystemTheme } = themeSlice.actions;

export default themeSlice.reducer;

// Selectors
export const selectTheme = (state) => state.theme.theme;
export const selectSystemTheme = (state) => state.theme.systemTheme;
export const selectIsDarkMode = (state) => state.theme.theme === 'dark';
