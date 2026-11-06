import React from 'react';
import { Check, ShieldCheck, User, UserX } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DemoBar: React.FC = () => {
  const { authMode, setAuthMode, user } = useAuth();

  return (
    <aside
      aria-label="Selector de estado de demostración"
      className="bg-pitch-surface text-pitch-ink border-b border-pitch-line px-4 py-1.5 text-xs font-mono transition-colors"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-pitch-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-volt shrink-0" aria-hidden="true" />
          <span className="font-semibold text-pitch-ink">DEMO MVP:</span>
          <span className="hidden sm:inline">
            Alterná entre usuario registrado e invitado para evaluar ambos flujos.
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-0.5 rounded-md bg-pitch border border-pitch-line">
          <button
            type="button"
            onClick={() => setAuthMode('registered')}
            className={`min-h-[28px] px-2.5 py-1 rounded text-xs font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              authMode === 'registered'
                ? 'bg-volt text-volt-ink font-semibold shadow-xs'
                : 'text-pitch-muted hover:text-pitch-ink'
            }`}
          >
            <User className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span>Registrado {user ? `(${user.name.split(' ')[0]})` : ''}</span>
            {authMode === 'registered' && <Check className="w-3 h-3 shrink-0" aria-hidden="true" />}
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('guest')}
            className={`min-h-[28px] px-2.5 py-1 rounded text-xs font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              authMode === 'guest'
                ? 'bg-surface text-ink font-semibold shadow-xs'
                : 'text-pitch-muted hover:text-pitch-ink'
            }`}
          >
            <UserX className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span>Invitado</span>
            {authMode === 'guest' && <Check className="w-3 h-3 shrink-0" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
