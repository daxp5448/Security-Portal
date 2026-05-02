import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning' // 'warning', 'danger', 'info'
}) {
  if (!isOpen) return null;

  const getTheme = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          iconColor: 'text-red-400',
          buttonBg: 'bg-red-500 hover:bg-red-600',
          textColor: 'text-red-300'
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          iconColor: 'text-blue-400',
          buttonBg: 'bg-blue-500 hover:bg-blue-600',
          textColor: 'text-blue-300'
        };
      default: // warning
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          iconColor: 'text-amber-400',
          buttonBg: 'bg-amber-500 hover:bg-amber-600',
          textColor: 'text-amber-300'
        };
    }
  };

  const theme = getTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className={`flex items-start gap-4 p-6 ${theme.bg} ${theme.border} border-b`}>
          <AlertTriangle className={`h-6 w-6 ${theme.iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400 mt-1">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg ${theme.buttonBg} text-white transition-colors text-sm font-medium shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
