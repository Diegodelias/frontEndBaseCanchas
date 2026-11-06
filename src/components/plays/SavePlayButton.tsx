import React from 'react';
import { AlertCircle, Bookmark, Check, Loader2, Sparkles } from 'lucide-react';
import { PlayProcessingStatus } from '../../types/play';

export type SaveButtonVisualState = 'idle' | 'marked' | 'processing' | 'saved' | 'error';

interface SavePlayButtonProps {
  status?: SaveButtonVisualState;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const SavePlayButton: React.FC<SavePlayButtonProps> = ({
  status = 'idle',
  onClick,
  className = '',
  disabled = false,
}) => {
  const getButtonConfig = () => {
    switch (status) {
      case 'marked':
        return {
          icon: <Sparkles className="w-5 h-5 text-volt animate-bounce shrink-0" aria-hidden="true" />,
          label: '¡Momento marcado!',
          bg: 'bg-pitch-surface border-volt text-volt shadow-[0_0_20px_rgba(196,242,54,0.35)]',
        };
      case 'processing':
        return {
          icon: <Loader2 className="w-5 h-5 text-volt animate-spin shrink-0" aria-hidden="true" />,
          label: 'Procesando jugada...',
          bg: 'bg-pitch-surface border-volt/60 text-pitch-ink',
        };
      case 'saved':
        return {
          icon: <Check className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />,
          label: '¡Jugada guardada!',
          bg: 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.35)]',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />,
          label: 'No se pudo guardar',
          bg: 'bg-red-950/90 border-red-500 text-red-300',
        };
      case 'idle':
      default:
        return {
          icon: (
            <div className="relative flex items-center justify-center shrink-0">
              {/* Outer record ring */}
              <span className="w-5 h-5 rounded-full border-2 border-volt-ink flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-volt-ink" />
              </span>
            </div>
          ),
          label: 'Guardar jugada',
          bg: 'bg-volt text-volt-ink border-transparent hover:bg-volt-hover hover:scale-[1.02] shadow-[0_4px_24px_rgba(196,242,54,0.4)]',
        };
    }
  };

  const config = getButtonConfig();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || status === 'processing'}
      aria-label={config.label}
      aria-live="polite"
      className={`group relative inline-flex items-center justify-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border text-sm sm:text-base font-bold tracking-tight transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed select-none ${config.bg} ${className}`}
    >
      {config.icon}
      <span className="font-display uppercase tracking-wider text-sm sm:text-base whitespace-nowrap">
        {config.label}
      </span>
    </button>
  );
};
