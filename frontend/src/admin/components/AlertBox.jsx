import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function AlertBox({ type = 'info', message, onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getTheme = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          icon: CheckCircle,
          iconColor: 'text-emerald-400',
          textColor: 'text-emerald-300',
          closeBg: 'hover:bg-emerald-500/20'
        };
      case 'error':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          icon: XCircle,
          iconColor: 'text-red-400',
          textColor: 'text-red-300',
          closeBg: 'hover:bg-red-500/20'
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          icon: AlertCircle,
          iconColor: 'text-amber-400',
          textColor: 'text-amber-300',
          closeBg: 'hover:bg-amber-500/20'
        };
      default: // info
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          icon: Info,
          iconColor: 'text-blue-400',
          textColor: 'text-blue-300',
          closeBg: 'hover:bg-blue-500/20'
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <div className={`
      ${theme.bg} ${theme.border} border rounded-lg p-4 
      shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-2
      flex items-start gap-3
    `}>
      <Icon className={`h-5 w-5 ${theme.iconColor} flex-shrink-0 mt-0.5`} />
      <p className={`flex-1 ${theme.textColor} text-sm font-medium`}>
        {message}
      </p>
      {onClose && (
        <button
          onClick={onClose}
          className={`
            ${theme.closeBg} rounded-lg p-1.5 transition-colors
            ${theme.textColor}
          `}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
