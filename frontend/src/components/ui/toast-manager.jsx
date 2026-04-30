import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const toastNotifications = [];
const listeners = new Set();

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (toast) => {
      const id = Date.now();
      const newToast = { ...toast, id };
      toastNotifications.push(newToast);
      setToasts([...toastNotifications]);

      if (toast.duration !== false) {
        setTimeout(() => {
          removeToast(id);
        }, toast.duration || 3000);
      }
    };

    listeners.add(handleToast);
    return () => listeners.delete(handleToast);
  }, []);

  return toasts;
};

export const toast = (options) => {
  const message = typeof options === 'string' ? options : options.message;
  const variant = typeof options === 'string' ? 'default' : options.variant || 'default';
  const duration = typeof options === 'string' ? 3000 : options.duration || 3000;

  listeners.forEach((listener) =>
    listener({ message, variant, duration })
  );
};

export const removeToast = (id) => {
  const index = toastNotifications.findIndex((t) => t.id === id);
  if (index !== -1) {
    toastNotifications.splice(index, 1);
    listeners.forEach((listener) => listener());
  }
};

export function Toaster() {
  const toasts = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-md">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`p-4 rounded-lg shadow-lg flex items-start justify-between animate-slide-up ${
            t.variant === 'success'
              ? 'bg-green-50 border border-green-200 text-green-900'
              : t.variant === 'error'
              ? 'bg-red-50 border border-red-200 text-red-900'
              : 'bg-blue-50 border border-blue-200 text-blue-900'
          }`}
        >
          <p className="flex-1">{t.message}</p>
          <button
            onClick={() => removeToast(t.id)}
            className="ml-4 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
