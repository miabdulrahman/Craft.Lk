import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur-md flex items-center justify-between gap-3 text-xs font-semibold animate-slide-up transition-all ${
                isSuccess
                  ? 'bg-stone-900/95 text-white border-stone-700/80'
                  : isError
                  ? 'bg-rose-950/95 text-rose-100 border-rose-800'
                  : 'bg-amber-950/95 text-amber-100 border-amber-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isSuccess ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : isError ? (
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                ) : (
                  <Info className="h-4 w-4 text-amber-400 shrink-0" />
                )}
                <span className="leading-snug">{toast.message}</span>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
