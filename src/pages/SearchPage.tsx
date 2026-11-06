import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Play,
  RotateCcw,
  Search,
  Video,
  Zap,
} from 'lucide-react';
import { DemoBar } from '../components/auth/DemoBar';
import { Navbar } from '../components/layout/Navbar';
import { MatchCascadingSelector } from '../components/match/MatchCascadingSelector';
import { Button } from '../components/ui/Button';
import { buildMatchPath } from '../routes/paths';
import { matchesService } from '../services/matchesService';
import { Match } from '../types/match';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read URL query parameters if coming from hero or external link
  const initialClub = searchParams.get('club') || '';
  const initialCancha = searchParams.get('cancha') || '';
  const initialFecha = searchParams.get('fecha') || '';
  const initialHorario = searchParams.get('horario') || '';

  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function loadRecent() {
      setIsLoadingMatches(true);
      try {
        const matches = await matchesService.getMatches();
        if (!cancelled) {
          setRecentMatches(matches);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMatches(false);
        }
      }
    }

    loadRecent();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <DemoBar />
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Title */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-turf-ink mb-1.5">
              <Video className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Grabaciones y repeticiones</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">
              Buscá tu partido grabado
            </h1>
            <p className="mt-2 text-sm sm:text-base text-ink-muted leading-relaxed">
              Elegí el complejo, la cancha, el día y el horario para acceder al reproductor en pantalla completa y guardar tus mejores jugadas.
            </p>
          </div>

          {/* Cascading Selector Card */}
          <div className="mt-8">
            <MatchCascadingSelector
              variant="page"
              initialClubId={initialClub}
              initialCourtId={initialCancha}
              initialDayId={initialFecha}
              initialSlotId={initialHorario}
            />
          </div>

          {/* Suggested / Available Recorded Matches Grid */}
          <div className="mt-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-line">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                  Partidos recientes con cámara
                </h2>
                <p className="text-xs sm:text-sm text-ink-muted">
                  Acceso directo a grabaciones procesadas para probar el reproductor
                </p>
              </div>

              <span className="text-xs font-mono text-ink-muted">
                {recentMatches.length} partidos cargados
              </span>
            </div>

            {isLoadingMatches ? (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="p-5 rounded-xl bg-surface border border-line animate-pulse space-y-3"
                  >
                    <div className="h-4 w-28 bg-surface-muted rounded" />
                    <div className="h-6 w-48 bg-surface-muted rounded" />
                    <div className="h-4 w-36 bg-surface-muted rounded" />
                    <div className="h-9 w-24 bg-surface-muted rounded-lg pt-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recentMatches.map((match) => {
                  const isAvailable = match.status === 'available';
                  const isProcessing = match.status === 'processing';

                  return (
                    <article
                      key={match.id}
                      className="bg-surface border border-line rounded-xl p-5 flex flex-col justify-between hover:border-line-strong transition-colors"
                    >
                      <div>
                        {/* Status Tag */}
                        <div className="flex items-center justify-between gap-2 text-xs">
                          {isAvailable ? (
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-turf-ink px-2 py-0.5 rounded bg-turf-soft">
                              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                              HD DISPONIBLE
                            </span>
                          ) : isProcessing ? (
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-warning px-2 py-0.5 rounded bg-warning-soft">
                              <Clock className="w-3 h-3" aria-hidden="true" />
                              PROCESANDO
                            </span>
                          ) : (
                            <span className="font-mono text-[11px] text-ink-muted px-2 py-0.5 rounded bg-surface-muted">
                              SIN CÁMARA
                            </span>
                          )}

                          <span className="font-mono text-xs text-ink-muted tabular-nums">
                            {match.timeSlot} hs
                          </span>
                        </div>

                        <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-ink leading-snug">
                          {match.title}
                        </h3>

                        <div className="mt-2 text-xs text-ink-muted space-y-1">
                          <p className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-turf shrink-0" aria-hidden="true" />
                            <span className="truncate">{match.clubName}</span>
                            <span aria-hidden="true">·</span>
                            <span className="truncate">{match.courtName}</span>
                          </p>
                          <p className="flex items-center gap-1.5 font-mono tabular-nums">
                            <Calendar className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />
                            <span>{match.dateLabel}</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-line flex items-center justify-between gap-3">
                        <Button
                          variant={isAvailable ? 'volt' : 'secondary'}
                          size="sm"
                          onClick={() => navigate(buildMatchPath(match.id))}
                          className="w-full"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                          <span>{isAvailable ? 'Ver partido' : 'Ver detalle'}</span>
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
