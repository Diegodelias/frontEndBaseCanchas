import React, { useState } from 'react';
import { Download, Edit2, Eye, Play, Share2, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { SavedPlay } from '../../types/play';

interface PlayCardProps {
  play: SavedPlay;
  onPlay: (play: SavedPlay) => void;
  onShare: (play: SavedPlay) => void;
  onDelete: (play: SavedPlay) => void;
  onEditTitle?: (play: SavedPlay) => void;
  layout?: 'compact' | 'profile';
}

export const PlayCard: React.FC<PlayCardProps> = ({
  play,
  onPlay,
  onShare,
  onDelete,
  onEditTitle,
  layout = 'compact',
}) => {
  const { showToast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSimulatedDownload = () => {
    setIsDownloading(true);
    showToast({
      type: 'info',
      title: 'Descarga simulada iniciada',
      message: `Preparando archivo MP4 para "${play.title}" (20s).`,
      durationMs: 3500,
    });

    setTimeout(() => {
      setIsDownloading(false);
      showToast({
        type: 'success',
        title: 'Descarga simulada completada',
        message: 'En la versión final, este botón descargará el fragmento en alta calidad.',
        durationMs: 3000,
      });
    }, 1800);
  };

  // Compact layout (used inside the player PlaysPanel)
  if (layout === 'compact') {
    return (
      <div className="group relative flex items-center justify-between gap-3 p-3 rounded-xl bg-pitch-elevated/70 hover:bg-pitch-elevated border border-pitch-line transition-all">
        {/* Thumbnail with Play trigger */}
        <button
          type="button"
          onClick={() => onPlay(play)}
          aria-label={`Ver jugada: ${play.title}`}
          className="relative w-16 h-12 rounded-lg overflow-hidden bg-pitch shrink-0 flex items-center justify-center border border-pitch-line group-hover:border-volt/50 transition-colors cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-volt text-volt-ink flex items-center justify-center shadow-xs">
            <Play className="w-3 h-3 fill-volt-ink ml-0.5" aria-hidden="true" />
          </div>
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {play.category && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-volt/20 text-volt border border-volt/30">
                {play.category}
              </span>
            )}
            <span className="font-mono text-[11px] text-pitch-muted">
              {play.timestampLabel}
            </span>
          </div>

          <h4 className="text-sm font-bold text-pitch-ink truncate mt-0.5 leading-tight">
            {play.title}
          </h4>
          <p className="text-[11px] text-pitch-muted truncate mt-0.5">
            {play.clubName} · {play.courtName}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onPlay(play)}
            aria-label="Ver jugada"
            title="Ver jugada"
            className="p-1.5 rounded-lg text-pitch-muted hover:text-pitch-ink hover:bg-pitch-surface transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" aria-hidden="true" />
          </button>

          {onEditTitle && (
            <button
              type="button"
              onClick={() => onEditTitle(play)}
              aria-label="Editar nombre"
              title="Editar nombre"
              className="p-1.5 rounded-lg text-pitch-muted hover:text-pitch-ink hover:bg-pitch-surface transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            onClick={handleSimulatedDownload}
            aria-label="Descargar jugada (simulada)"
            title="Descargar jugada"
            disabled={isDownloading}
            className="p-1.5 rounded-lg text-pitch-muted hover:text-pitch-ink hover:bg-pitch-surface transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onShare(play)}
            aria-label="Compartir jugada"
            title="Compartir"
            className="p-1.5 rounded-lg text-pitch-muted hover:text-volt hover:bg-pitch-surface transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(play)}
            aria-label="Eliminar jugada"
            title="Eliminar"
            className="p-1.5 rounded-lg text-pitch-muted hover:text-red-400 hover:bg-pitch-surface transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  // Profile layout (matching reference image 8_cac3471b.png)
  return (
    <div className="flex flex-col rounded-2xl bg-surface border border-line overflow-hidden shadow-xs hover:border-line-strong transition-all">
      {/* Video Preview Aspect Ratio with Center Play Button */}
      <div className="relative aspect-video w-full bg-pitch overflow-hidden group">
        {/* Mock Turf Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/40 to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <button
            type="button"
            onClick={() => onPlay(play)}
            aria-label={`Reproducir ${play.title}`}
            className="w-12 h-12 rounded-full bg-black/60 hover:bg-volt hover:text-volt-ink border border-white/20 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg group-hover:scale-110"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" aria-hidden="true" />
          </button>
        </div>

        {/* Timestamp tag */}
        <div className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[11px] font-mono font-semibold text-white border border-white/10">
          {play.timestampLabel}
        </div>

        {play.category && (
          <div className="absolute top-3 right-3 z-20 px-2.5 py-0.5 rounded-md bg-volt text-volt-ink font-display font-bold text-xs uppercase tracking-wider shadow-xs">
            {play.category}
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-ink leading-tight truncate">
              {play.title}
            </h3>
            {onEditTitle && (
              <button
                type="button"
                onClick={() => onEditTitle(play)}
                aria-label="Editar título de jugada"
                className="text-ink-muted hover:text-ink p-1 rounded transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
          <p className="text-xs text-ink-muted mt-1 truncate">
            {play.clubName} · {play.courtName}
          </p>
          <p className="text-[11px] text-ink-muted/80 mt-0.5">
            {play.dateLabel} · {play.timeSlot}
          </p>
        </div>

        {/* Actions Bar matching 8_cac3471b.png */}
        <div className="mt-4 pt-3 border-t border-line flex items-center gap-2">
          <button
            type="button"
            onClick={() => onShare(play)}
            className="flex-1 min-h-[40px] px-3 rounded-xl bg-volt hover:bg-volt-hover text-volt-ink font-display font-bold text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Compartir</span>
          </button>

          <button
            type="button"
            onClick={handleSimulatedDownload}
            disabled={isDownloading}
            aria-label="Descargar jugada (simulada)"
            title="Descargar"
            className="w-10 h-10 rounded-xl border border-line bg-surface hover:bg-surface-muted text-ink flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(play)}
            aria-label="Eliminar jugada"
            title="Eliminar"
            className="w-10 h-10 rounded-xl border border-line bg-surface hover:bg-red-500/10 hover:text-red-500 text-ink-muted flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
