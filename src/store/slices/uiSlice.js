import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
  sidebarOpen: false, // For mobile
  loading: false,
  notifications: [],
  breadcrumbs: [],
  pageTitle: '',
  searchQuery: '',
  filters: {},
  modals: {
    confirmDialog: {
      open: false,
      title: '',
      message: '',
      onConfirm: null,
      onCancel: null,
    },
    profileModal: {
      open: false,
    },
    settingsModal: {
      open: false,
    },
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed.toString());
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
      localStorage.setItem('sidebarCollapsed', action.payload.toString());
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload;
      document.title = `${action.payload} - Calo Dashboard Portal`;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    openModal: (state, action) => {
      const { modalName, ...modalData } = action.payload;
      if (state.modals[modalName]) {
        state.modals[modalName] = { ...state.modals[modalName], open: true, ...modalData };
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals[modalName]) {
        state.modals[modalName].open = false;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modalName => {
        state.modals[modalName].open = false;
      });
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setSidebarOpen,
  setLoading,
  addNotification,
  removeNotification,
  markNotificationAsRead,
  clearNotifications,
  setBreadcrumbs,
  setPageTitle,
  setSearchQuery,
  setFilters,
  clearFilters,
  openModal,
  closeModal,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectLoading = (state) => state.ui.loading;
export const selectNotifications = (state) => state.ui.notifications;
export const selectUnreadNotifications = (state) => 
  state.ui.notifications.filter(n => !n.read);
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs;
export const selectPageTitle = (state) => state.ui.pageTitle;
export const selectSearchQuery = (state) => state.ui.searchQuery;
export const selectFilters = (state) => state.ui.filters;
export const selectModals = (state) => state.ui.modals;
