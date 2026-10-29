import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions: ToastOptions = {
  autoClose: 3000,
  position: 'bottom-right',
};

export const showSuccessNotification = (message: string) => {
  toast.success(message, defaultOptions);
};

export const showInfoNotification = (message: string) => {
  toast.info(message, defaultOptions);
};

export const showErrorNotification = (message: string) => {
  toast.error(message, { ...defaultOptions, autoClose: 5000 });
};
