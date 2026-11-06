import { MOCK_SAVED_PLAYS } from '../data/mockPlays';
import { SavedPlay, SavePlayInput } from '../types/play';

const SIMULATED_LATENCY_MS = 100;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Estado en memoria para la sesión activa
let activePlaysState: SavedPlay[] = [...MOCK_SAVED_PLAYS];

export const playsService = {
  /**
   * Obtiene todas las jugadas guardadas para el usuario o demo.
   */
  async getSavedPlays(userId?: string): Promise<SavedPlay[]> {
    await sleep(SIMULATED_LATENCY_MS);
    if (!userId) return [...activePlaysState];
    return activePlaysState.filter((p) => !p.userId || p.userId === userId);
  },

  /**
   * Obtiene una jugada específica por ID.
   */
  async getPlayById(playId: string): Promise<SavedPlay | null> {
    await sleep(SIMULATED_LATENCY_MS);
    const found = activePlaysState.find((p) => p.id === playId);
    return found ? { ...found } : null;
  },

  /**
   * Obtiene las jugadas pertenecientes a un partido.
   */
  async getPlaysByMatchId(matchId: string): Promise<SavedPlay[]> {
    await sleep(SIMULATED_LATENCY_MS);
    return activePlaysState.filter((p) => p.matchId === matchId);
  },

  /**
   * Guarda una nueva jugada capturada desde el reproductor.
   */
  async savePlay(input: SavePlayInput, userId?: string): Promise<SavedPlay> {
    await sleep(SIMULATED_LATENCY_MS);

    const newPlay: SavedPlay = {
      id: `jugada-${Date.now()}`,
      matchId: input.matchId,
      title: input.title || `Jugada en ${input.courtName}`,
      clubName: input.clubName,
      courtName: input.courtName,
      dateLabel: input.dateLabel,
      timeSlot: input.timeSlot,
      startTime: Math.max(0, Math.floor(input.startTime)),
      endTime: input.endTime ?? Math.floor(input.startTime) + 4,
      thumbnail: input.thumbnail,
      createdAt: new Date().toISOString(),
      userId,
    };

    activePlaysState = [newPlay, ...activePlaysState];
    return newPlay;
  },

  /**
   * Elimina una jugada guardada.
   */
  async deletePlay(playId: string): Promise<boolean> {
    await sleep(SIMULATED_LATENCY_MS);
    const initialLen = activePlaysState.length;
    activePlaysState = activePlaysState.filter((p) => p.id !== playId);
    return activePlaysState.length < initialLen;
  },

  /**
   * Restablece las jugadas a los mocks originales (útil para pruebas).
   */
  async resetPlays(): Promise<void> {
    activePlaysState = [...MOCK_SAVED_PLAYS];
  },
};
