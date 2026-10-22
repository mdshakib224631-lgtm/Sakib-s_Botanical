import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ModernToastProps {
  show: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const ModernToast: React.FC<ModernToastProps> = ({
  show,
  title,
  message,
  type = 'success',
  onClose,
  duration = 4500,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!show) {
      setProgress(100);
      return;
    }

    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [show, duration]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[#f87171]" />;
      case 'info':
        return <Info className="w-5 h-5 text-[#60a5fa]" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />;
    }
  };

  const getBadgeStyle = () => {
    switch (type) {
      case 'error':
        return 'bg-[#7f1d1d]/80 text-[#fca5a5] border-[#991b1b]';
      case 'info':
        return 'bg-[#1e3a8a]/80 text-[#93c5fd] border-[#1d4ed8]';
      case 'success':
      default:
        return 'bg-[#14532d]/80 text-[#86efac] border-[#166534]';
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'error':
        return 'bg-[#ef4444]';
      case 'info':
        return 'bg-[#3b82f6]';
      case 'success':
      default:
        return 'bg-[#22c55e]';
    }
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-md transition-all duration-300 ease-out animate-fadeIn">
      <div className="relative overflow-hidden bg-[#18221f]/95 text-white border border-[#2d3e38] rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur-md p-3.5 sm:p-4 flex items-start gap-3.5">
        
        {/* Glowing Indicator Icon */}
        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
          {getIcon()}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyle()}`}>
              {type === 'error' ? 'Notice' : type === 'info' ? 'Update' : 'Success'}
            </span>
            <h4 className="font-semibold text-xs sm:text-sm text-white truncate">
              {title}
            </h4>
          </div>
          <p className="text-[11px] sm:text-xs text-[#c8d4cf] mt-1 leading-relaxed font-light">
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-[#8c9c95] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          title="Dismiss"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>
    </div>
  );
};
