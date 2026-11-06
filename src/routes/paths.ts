/**
 * Definición centralizada de rutas de Canchas3.
 * Modificables desde este único archivo.
 */
export const ROUTES = {
  HOME: '/',
  SEARCH: '/buscar',
  MATCH: '/partido/:matchId',
  PLAY: '/jugada/:playId',
  PROFILE: '/perfil',
} as const;

export function buildMatchPath(matchId: string): string {
  return `/partido/${encodeURIComponent(matchId)}`;
}

export function buildPlayPath(playId: string): string {
  return `/jugada/${encodeURIComponent(playId)}`;
}

export function buildSearchPath(params?: {
  complexId?: string;
  courtId?: string;
  dayId?: string;
  slotId?: string;
}): string {
  if (!params) return ROUTES.SEARCH;
  const searchParams = new URLSearchParams();
  if (params.complexId) searchParams.set('club', params.complexId);
  if (params.courtId) searchParams.set('cancha', params.courtId);
  if (params.dayId) searchParams.set('fecha', params.dayId);
  if (params.slotId) searchParams.set('horario', params.slotId);
  const query = searchParams.toString();
  return query ? `${ROUTES.SEARCH}?${query}` : ROUTES.SEARCH;
}
