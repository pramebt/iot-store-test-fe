import { useToastStore } from '../store/toastStore';

/**
 * Show a toast notification
 * @param {Object} options - Toast options
 * @param {string} options.type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {string} options.message - Toast message
 * @param {number} options.duration - Duration in milliseconds (0 = no auto-close)
 */
export const showToast = ({ type, message, duration }) => {
  const addToast = useToastStore.getState().addToast;
  return addToast({ type, message, duration });
};

/**
 * Helper functions for different toast types
 */
export const toast = {
  success: (message, duration = 3000) => {
    return showToast({ type: 'success', message, duration });
  },
  error: (message, duration = 4000) => {
    return showToast({ type: 'error', message, duration });
  },
  warning: (message, duration = 3000) => {
    return showToast({ type: 'warning', message, duration });
  },
  info: (message, duration = 3000) => {
    return showToast({ type: 'info', message, duration });
  },
};

export default toast;
