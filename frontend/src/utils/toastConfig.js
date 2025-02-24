import { toast } from 'react-toastify';

// Alap konfiguráció
export const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
  theme: "dark",
  style: {
    background: '#1F2937',
    color: '#F3F4F6',
    borderRadius: '10px',
    border: '2px solid #EF4444',
    fontSize: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  }
};

// Toast kezelő
export const showToast = (message, type = 'info') => {
  // Töröljük az összes aktív toast-ot
  toast.dismiss();

  // Toast megjelenítése
  const config = {
    ...toastConfig,
    toastId: `${type}-${message}`
  };

  switch (type) {
    case 'success':
      toast.success(message, { ...config, icon: '✅' });
      break;
    case 'error':
      toast.error(message, { ...config, icon: '❌' });
      break;
    case 'warning':
      toast.warning(message, { ...config, icon: '⚠️' });
      break;
    case 'info':
      toast.info(message, { ...config, icon: 'ℹ️' });
      break;
    case 'match':
      toast.success(message, { ...config, icon: '❤️' });
      break;
    default:
      toast(message, config);
  }
}; 