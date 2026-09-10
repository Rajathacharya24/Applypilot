import { useEffect } from 'react';

export default function ToastNotification({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl backdrop-blur-md border ${
          isError
            ? 'bg-rose-900/90 border-rose-700 text-rose-100'
            : 'bg-slate-900/90 border-slate-700 text-slate-100'
        }`}
      >
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${isError ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
          {isError ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div className="text-sm font-medium pr-2">{toast.message}</div>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto rounded-lg p-1 text-slate-400 hover:text-white transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
