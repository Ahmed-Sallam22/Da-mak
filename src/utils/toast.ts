import toast from 'react-hot-toast';

// Custom toast styles matching the app theme
const toastConfig = {
  success: {
    style: {
      background: '#0052FF',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#0052FF',
    },
  },
  error: {
    style: {
      background: '#EF4444',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444',
    },
  },
  loading: {
    style: {
      background: '#0E121B',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
      fontWeight: '500',
    },
  },
};

export const showToast = {
  success: (message: string) => {
    toast.success(message, toastConfig.success);
  },
  error: (message: string) => {
    toast.error(message, toastConfig.error);
  },
  loading: (message: string) => {
    return toast.loading(message, toastConfig.loading);
  },
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        success: toastConfig.success,
        error: toastConfig.error,
        loading: toastConfig.loading,
      }
    );
  },
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
};

export default showToast;
