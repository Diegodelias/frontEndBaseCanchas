import React, { useState } from 'react';
import {
  Bookmark,
  Check,
  CheckCircle2,
  Film,
  Mail,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlays } from '../../context/PlaysContext';
import { useToast } from '../../context/ToastContext';
import { SavedPlay } from '../../types/play';
import { Button } from '../ui/Button';
import { DeletePlayDialog } from './DeletePlayDialog';
import { PlayCard } from './PlayCard';

interface PlaysPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaySelected: (play: SavedPlay) => void;
  onShareSelected: (play: SavedPlay) => void;
  onTriggerSavePlay: () => void;
  matchId?: string;
}

export const PlaysPanel: React.FC<PlaysPanelProps> = ({
  isOpen,
  onClose,
  onPlaySelected,
  onShareSelected,
  onTriggerSavePlay,
  matchId,
}) => {
  const { authMode, user, sendMagicLink, setAuthMode } = useAuth();
  const { savedPlays, deletePlay, updatePlay, assignAllPlaysToUser } = usePlays();
  const { showToast } = useToast();

  const [playToDelete, setPlayToDelete] = useState<SavedPlay | null>(null);
  const [editingPlay, setEditingPlay] = useState<SavedPlay | null>(null);
  const [editingTitleText, setEditingTitleText] = useState<string>('');

  // Guest email magic link inside panel
  const [guestEmail, setGuestEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter plays if matchId is supplied (show all or match plays)
  const plays = matchId
    ? savedPlays.filter((p) => p.matchId === matchId || p.isLiveMoment)
    : savedPlays;

  const handleDeleteConfirm = async () => {
    if (!playToDelete) return;
    const title = playToDelete.title;
    await deletePlay(playToDelete.id);
    setPlayToDelete(null);
    showToast({
      type: 'info',
      title: 'Jugada eliminada',
      message: `"${title}" se eliminó de tus jugadas guardadas.`,
      durationMs: 3000,
    });
  };

  const handleStartEditTitle = (play: SavedPlay) => {
    setEditingPlay(play);
    setEditingTitleText(play.title);
  };

  const handleSaveEditTitle = async () => {
    if (!editingPlay) return;
    const trimmed = editingTitleText.trim();
    if (trimmed && trimmed !== editingPlay.title) {
      await updatePlay(editingPlay.id, { title: trimmed });
      showToast({
        type: 'success',
        title: 'Nombre actualizado',
        message: `La jugada ahora se llama "${trimmed}".`,
        durationMs: 2500,
      });
    }
    setEditingPlay(null);
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail.includes('@')) return;

    setIsSendingEmail(true);
    try {
      await sendMagicLink(guestEmail);
      setAuthMode('registered');
      await assignAllPlaysToUser();
      setEmailSentSuccess(true);
      showToast({
        type: 'success',
        title: '¡Enlace mágico enviado!',
        message: `Enviamos el acceso a ${guestEmail}. Tus jugadas ya están sincronizadas.`,
        durationMs: 4500,
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="plays-panel-title"
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full sm:max-w-md h-full bg-pitch-surface border-l border-pitch-line text-pitch-ink flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-pitch-line flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-volt/20 text-volt border border-volt/30 flex items-center justify-center">
              <Bookmark className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h3 id="plays-panel-title" className="font-display text-lg font-bold tracking-tight text-pitch-ink">
                Mis jugadas
              </h3>
              <p className="text-xs text-pitch-muted">
                {plays.length === 0
                  ? 'Sin jugadas en este partido'
                  : `${plays.length} ${plays.length === 1 ? 'jugada guardada' : 'jugadas guardadas'}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de jugadas"
            className="p-1.5 rounded-lg text-pitch-muted hover:text-pitch-ink hover:bg-pitch-elevated transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Edit Title Dialog Modal (if active) */}
          {editingPlay && (
            <div className="p-4 rounded-xl bg-pitch-elevated border border-volt/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-volt">
                  Editar nombre
                </span>
                <button
                  type="button"
                  onClick={() => setEditingPlay(null)}
                  className="text-pitch-muted hover:text-pitch-ink p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={editingTitleText}
                onChange={(e) => setEditingTitleText(e.target.value)}
                maxLength={60}
                className="w-full h-10 px-3 rounded-lg bg-pitch border border-pitch-line text-sm text-pitch-ink focus:outline-none focus:border-volt"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditingPlay(null)}>
                  Cancelar
                </Button>
                <Button variant="volt" size="sm" onClick={handleSaveEditTitle}>
                  Guardar
                </Button>
              </div>
            </div>
          )}

          {/* Empty state (matches reference 1_0134639b.png) */}
          {plays.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-pitch-elevated/60 border border-pitch-line space-y-4 my-auto">
              <div className="w-14 h-14 mx-auto rounded-full bg-pitch border border-pitch-line flex items-center justify-center text-volt">
                <Film className="w-7 h-7" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-pitch-ink">
                  Todavía no guardaste jugadas
                </h4>
                <p className="text-xs text-pitch-muted mt-1 max-w-xs mx-auto leading-relaxed">
                  Tocá el botón <strong className="text-volt font-semibold">Guardar jugada</strong> cuando veas un momento que quieras conservar y compartir.
                </p>
              </div>
              <Button
                variant="volt"
                size="sm"
                onClick={() => {
                  onClose();
                  onTriggerSavePlay();
                }}
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                <span>Guardar mi primera jugada</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {plays.map((play) => (
                <PlayCard
                  key={play.id}
                  play={play}
                  layout="compact"
                  onPlay={onPlaySelected}
                  onShare={onShareSelected}
                  onDelete={() => setPlayToDelete(play)}
                  onEditTitle={handleStartEditTitle}
                />
              ))}
            </div>
          )}

          {/* Guest Cloud Save Banner (matches reference 1_0134639b.png & 7_fa7d0ba7.png) */}
          {authMode === 'guest' && !emailSentSuccess && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-pitch-elevated to-pitch border border-volt/20 space-y-3 mt-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-volt shrink-0" aria-hidden="true" />
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-pitch-ink">
                  Guardá tus jugadas en la nube
                </h4>
              </div>
              <p className="text-xs text-pitch-muted leading-relaxed">
                Ingresá tu email y te enviamos un enlace para volver a encontrarlas en tu perfil desde cualquier dispositivo.
              </p>
              <form onSubmit={handleMagicLinkSubmit} className="space-y-2">
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Tu email (ej. nombre@correo.com)"
                  className="w-full h-10 px-3 rounded-xl bg-pitch border border-pitch-line text-xs text-pitch-ink placeholder:text-pitch-muted/60 focus:outline-none focus:border-volt"
                />
                <Button
                  type="submit"
                  variant="volt"
                  size="sm"
                  fullWidth
                  disabled={isSendingEmail}
                >
                  {isSendingEmail ? 'Enviando enlace...' : 'Crear mi perfil gratis'}
                </Button>
              </form>
              <p className="text-[10px] text-pitch-muted text-center">
                Te mandamos un link directo sin contraseñas engorrosas.
              </p>
            </div>
          )}

          {/* Registered / synced confirmation */}
          {(authMode === 'registered' || emailSentSuccess) && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Jugadas sincronizadas en tu perfil</span>
              </div>
              <a href="/perfil" className="font-bold underline text-emerald-200 hover:text-white">
                Ver
              </a>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-pitch-line bg-pitch/80 flex items-center gap-3">
          <Button
            variant="volt"
            size="md"
            fullWidth
            onClick={() => {
              onClose();
              onTriggerSavePlay();
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Marcar nueva jugada</span>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeletePlayDialog
        isOpen={Boolean(playToDelete)}
        playTitle={playToDelete?.title || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPlayToDelete(null)}
      />
    </div>
  );
};
