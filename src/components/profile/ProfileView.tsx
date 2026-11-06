import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Check,
  Clock,
  MapPin,
  Play,
  Plus,
  Share2,
  Trash2,
  User,
  Video,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlays } from '../../context/PlaysContext';
import { buildMatchPath, buildPlayPath, ROUTES } from '../../routes/paths';
import { matchesService } from '../../services/matchesService';
import { Match } from '../../types/match';
import { SavedPlay } from '../../types/play';
import { formatVideoTime } from '../../utils/sharing';
import { ShareModal } from '../sharing/ShareModal';
import { Button } from '../ui/Button';

export const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { user, authMode, setAuthMode } = useAuth();
  const { savedPlays, savedMatchIds, deletePlay, toggleSaveMatch } = usePlays();

  const [activeTab, setActiveTab] = useState<'plays' | 'matches'>('plays');
  const [loadedMatches, setLoadedMatches] = useState<Match[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  // Sharing state
  const [shareTarget, setShareTarget] = useState<{
    match: Match;
    play?: SavedPlay;
  } | null>(null);

  // Load matches metadata for saved matches
  useEffect(() => {
    let cancelled = false;

    async function loadMatches() {
      if (savedMatchIds.length === 0) {
        setLoadedMatches([]);
        return;
      }
      setIsLoadingMatches(true);
      try {
        const matches = await matchesService.getSavedMatches(savedMatchIds);
        if (!cancelled) {
          setLoadedMatches(matches);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMatches(false);
        }
      }
    }

    loadMatches();
    return () => {
      cancelled = true;
    };
  }, [savedMatchIds]);

  const handleDeletePlay = async (playId: string) => {
    await deletePlay(playId);
  };

  const handleRemoveSavedMatch = async (matchId: string) => {
    await toggleSaveMatch(matchId);
  };

  const handleSharePlay = (play: SavedPlay) => {
    // Find or synthesize match for sharing
    const match = loadedMatches.find((m) => m.id === play.matchId) || {
      id: play.matchId,
      title: play.title,
      clubId: 'estacion-norte',
      clubName: play.clubName,
      courtId: 'en-f5-1',
      courtName: play.courtName,
      dayId: 'hoy',
      dateLabel: play.dateLabel,
      timeSlot: play.timeSlot,
      status: 'available' as const,
      videoSrc: '/assets/aistudio/ref_6fe9ff42.mp4',
      poster: '',
      duration: 60,
      recordedAt: play.createdAt,
    };
    setShareTarget({ match, play });
  };

  const handleShareMatch = (match: Match) => {
    setShareTarget({ match });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* User Header Profile Card */}
      <div className="bg-surface border border-line rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-pitch text-volt font-display text-2xl sm:text-3xl font-extrabold flex items-center justify-center border border-pitch-line shrink-0">
            {user?.avatar || 'MR'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-ink">
                {user?.name || 'Usuario invitado'}
              </h1>
              {authMode === 'registered' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-turf-soft text-turf-ink">
                  <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
                  PERFIL ACTIVO
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-ink-muted">
              {user?.email || 'Sin sesión activa (Modo Invitado)'}
            </p>

            <div className="mt-2.5 flex items-center gap-4 text-xs font-mono text-ink-muted">
              <span>{savedPlays.length} jugadas guardadas</span>
              <span aria-hidden="true">·</span>
              <span>{savedMatchIds.length} partidos guardados</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="volt"
            size="md"
            onClick={() => navigate(ROUTES.SEARCH)}
          >
            <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Buscar otro partido</span>
          </Button>

          {authMode === 'guest' ? (
            <Button
              variant="secondary"
              size="md"
              onClick={() => setAuthMode('registered')}
            >
              <User className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Activar modo registrado</span>
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="md"
              onClick={() => setAuthMode('guest')}
            >
              <span>Cambiar a invitado</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Switcher: Jugadas guardadas vs Partidos guardados */}
      <div className="mt-8 border-b border-line flex items-center gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('plays')}
          className={`pb-3 font-display text-xl font-bold flex items-center gap-2 transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === 'plays'
              ? 'border-turf text-ink'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <Zap className="w-4 h-4 text-turf shrink-0" aria-hidden="true" />
          <span>Mis jugadas guardadas ({savedPlays.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('matches')}
          className={`pb-3 font-display text-xl font-bold flex items-center gap-2 transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === 'matches'
              ? 'border-turf text-ink'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <Video className="w-4 h-4 text-turf shrink-0" aria-hidden="true" />
          <span>Partidos guardados ({savedMatchIds.length})</span>
        </button>
      </div>

      {/* TAB 1: Plays List */}
      {activeTab === 'plays' && (
        <div className="mt-6">
          {savedPlays.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-xl bg-surface border border-line text-center max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-xl bg-surface-muted text-ink-muted flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Todavía no tenés jugadas guardadas
              </h2>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                Cuando estés mirando un partido en el reproductor, hacé clic en{' '}
                <strong>Guardar jugada</strong> para recortar tus mejores momentos y compartirlos.
              </p>
              <div className="mt-6">
                <Button
                  variant="volt"
                  onClick={() => navigate(ROUTES.SEARCH)}
                >
                  Ir a buscar un partido
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedPlays.map((play) => (
                <article
                  key={play.id}
                  className="bg-surface border border-line rounded-xl overflow-hidden flex flex-col justify-between hover:border-line-strong transition-colors"
                >
                  <div className="p-5">
                    {/* Timestamp badge and court info */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono px-2 py-0.5 rounded bg-turf-soft text-turf-ink font-semibold tabular-nums">
                        Minuto {formatVideoTime(play.startTime)}
                      </span>
                      <span className="text-ink-muted font-medium">
                        {play.timeSlot} hs
                      </span>
                    </div>

                    <h3 className="mt-2.5 font-display text-xl font-bold tracking-tight text-ink leading-snug">
                      {play.title}
                    </h3>

                    <p className="mt-1 text-xs text-ink-muted flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-turf shrink-0" aria-hidden="true" />
                      <span>{play.clubName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{play.courtName}</span>
                    </p>
                  </div>

                  <div className="p-4 bg-canvas border-t border-line flex items-center justify-between gap-2">
                    <Button
                      variant="volt"
                      size="sm"
                      onClick={() => navigate(buildPlayPath(play.id))}
                    >
                      <Play className="w-3.5 h-3.5 fill-volt-ink" aria-hidden="true" />
                      <span>Reproducir</span>
                    </Button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSharePlay(play)}
                        aria-label={`Compartir jugada: ${play.title}`}
                        className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg border border-line text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePlay(play.id)}
                        aria-label={`Eliminar jugada: ${play.title}`}
                        className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg border border-line text-alert hover:bg-alert-soft transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Matches List */}
      {activeTab === 'matches' && (
        <div className="mt-6">
          {loadedMatches.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-xl bg-surface border border-line text-center max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-xl bg-surface-muted text-ink-muted flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="font-display text-2xl font-bold text-ink">
                No tenés partidos guardados
              </h2>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                Podés guardar partidos completos para volver a mirarlos o compartirlos con tu equipo cuando quieras.
              </p>
              <div className="mt-6">
                <Button
                  variant="volt"
                  onClick={() => navigate(ROUTES.SEARCH)}
                >
                  Buscar partidos
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {loadedMatches.map((match) => (
                <article
                  key={match.id}
                  className="bg-surface border border-line rounded-xl p-5 sm:p-6 flex flex-col justify-between hover:border-line-strong transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-ink-muted font-medium">
                      <span>{match.tournamentOrCategory || 'Partido grabado'}</span>
                      <span className="font-mono text-ink tabular-nums font-semibold">
                        {match.score ? `Resultado: ${match.score}` : `${match.timeSlot} hs`}
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
                      {match.title}
                    </h3>

                    <div className="mt-2 text-xs text-ink-muted space-y-1">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-turf shrink-0" aria-hidden="true" />
                        <span>{match.clubName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{match.courtName}</span>
                      </p>
                      <p className="flex items-center gap-1.5 font-mono tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />
                        <span>{match.dateLabel}</span>
                        <span aria-hidden="true">·</span>
                        <Clock className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />
                        <span>{match.timeSlot} hs</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-line flex items-center justify-between gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(buildMatchPath(match.id))}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                      <span>Ver partido</span>
                    </Button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleShareMatch(match)}
                        aria-label={`Compartir partido: ${match.title}`}
                        className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg border border-line text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveSavedMatch(match.id)}
                        aria-label={`Quitar partido de guardados: ${match.title}`}
                        className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg border border-line text-alert hover:bg-alert-soft transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Share Modal when triggered from profile */}
      {shareTarget && (
        <ShareModal
          isOpen={Boolean(shareTarget)}
          onClose={() => setShareTarget(null)}
          match={shareTarget.match}
          activePlay={shareTarget.play}
          currentTimestamp={shareTarget.play?.startTime ?? 0}
        />
      )}
    </div>
  );
};
