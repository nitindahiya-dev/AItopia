import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const baseClasses =
  'pointer-events-auto w-full max-w-sm rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm';

const styleByType: Record<ToastType, string> = {
  success: 'bg-emerald-500/10 border-emerald-400/40 text-emerald-200',
  error: 'bg-red-500/10 border-red-400/40 text-red-200',
  info: 'bg-sky-500/10 border-sky-400/40 text-sky-200',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast],
  );

  const value = useMemo(
    () => ({
      success: (message: string) => addToast('success', message),
      error: (message: string) => addToast('error', message),
      info: (message: string) => addToast('info', message),
    }),
    [addToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[1000] flex w-[90vw] max-w-md flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className={`${baseClasses} ${styleByType[toast.type]}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-aeroport text-sm leading-5">{toast.message}</p>
              <button
                type="button"
                aria-label="Close toast"
                onClick={() => removeToast(toast.id)}
                className="text-white/70 transition hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
