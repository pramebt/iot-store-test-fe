import { useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

export default function Toast({ toast }) {
  const removeToast = useToastStore((state) => state.removeToast);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const styles = {
    success: {
      bg: 'bg-green-50/95 backdrop-blur-sm',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
      button: 'text-green-600 hover:text-green-800 hover:bg-green-100/50',
    },
    error: {
      bg: 'bg-red-50/95 backdrop-blur-sm',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      button: 'text-red-600 hover:text-red-800 hover:bg-red-100/50',
    },
    warning: {
      bg: 'bg-amber-50/95 backdrop-blur-sm',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: 'text-amber-600',
      button: 'text-amber-600 hover:text-amber-800 hover:bg-amber-100/50',
    },
    info: {
      bg: 'bg-blue-50/95 backdrop-blur-sm',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      button: 'text-blue-600 hover:text-blue-800 hover:bg-blue-100/50',
    },
  };

  const Icon = icons[toast.type] || Info;
  const style = styles[toast.type] || styles.info;

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-xl shadow-lg p-4 min-w-[300px] max-w-[400px] flex items-start gap-3 animate-in slide-in-from-right-full fade-in duration-300`}
    >
      <Icon className={`w-5 h-5 ${style.icon} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${style.text}`}>{toast.message}</p>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className={`${style.button} transition-colors duration-200 p-1 rounded-full shrink-0`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} />
        </div>
      ))}
    </div>
  );
}
