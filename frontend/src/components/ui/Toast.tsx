import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import type { Toast as ToastType } from '@/types';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  return (
    <div
      className={cn(
        'toast-enter flex items-center gap-3 rounded-lg border bg-white p-4 shadow-lg',
        toast.type === 'success' && 'border-green-200',
        toast.type === 'error' && 'border-red-200',
        toast.type === 'info' && 'border-blue-200'
      )}
    >
      {icons[toast.type]}
      <p className="text-sm font-medium text-stone-900">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="ml-auto">
        <X className="h-4 w-4 text-stone-400 hover:text-stone-600" />
      </button>
    </div>
  );
}

export { Toast };
