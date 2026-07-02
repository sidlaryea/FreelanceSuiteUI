import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import Toast from "./Toast";

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback(({ message, tone = "success", duration = 3000 }) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const toast = { id, message, tone };
    setToasts((prev) => [...prev, toast]);

    const timer = setTimeout(() => removeToast(id), duration);
    timersRef.current.set(id, timer);

    return id;
  }, [removeToast]);

  const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </ToastContext.Provider>
  );
}

