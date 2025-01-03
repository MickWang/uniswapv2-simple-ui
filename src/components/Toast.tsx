import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XIcon } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`
      fixed top-4 right-4 z-50 flex items-center gap-2 p-4 rounded-lg shadow-lg
      ${type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}
    `}>
      {type === 'success' ? (
        <CheckCircleIcon className="w-5 h-5 text-green-500" />
      ) : (
        <XCircleIcon className="w-5 h-5 text-red-500" />
      )}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
}