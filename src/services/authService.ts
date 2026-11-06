import { DEMO_REGISTERED_USER } from '../data/mockUsers';
import { AuthMode, UserProfile } from '../types/user';

const SIMULATED_LATENCY_MS = 120;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let activeUser: UserProfile = { ...DEMO_REGISTERED_USER };

export const authService = {
  /**
   * Obtiene el perfil del usuario actual según el modo de demostración.
   */
  async getCurrentUser(mode: AuthMode): Promise<UserProfile | null> {
    await sleep(SIMULATED_LATENCY_MS);
    if (mode === 'guest') return null;
    return { ...activeUser };
  },

  /**
   * Simula el envío de un enlace mágico de acceso al email.
   */
  async sendMagicLink(
    email: string
  ): Promise<{ success: boolean; message: string; email: string }> {
    await sleep(SIMULATED_LATENCY_MS * 1.5);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new Error('Ingresá un correo electrónico válido');
    }

    return {
      success: true,
      message: 'Revisá tu email. Te enviamos un enlace para ingresar a tus partidos y jugadas.',
      email: email.trim(),
    };
  },

  /**
   * Alterna el guardado de un partido para el usuario registrado.
   */
  async toggleSavedMatch(matchId: string): Promise<{ saved: boolean; ids: string[] }> {
    await sleep(SIMULATED_LATENCY_MS);
    const exists = activeUser.savedMatchIds.includes(matchId);
    if (exists) {
      activeUser.savedMatchIds = activeUser.savedMatchIds.filter((id) => id !== matchId);
    } else {
      activeUser.savedMatchIds = [matchId, ...activeUser.savedMatchIds];
    }
    return {
      saved: !exists,
      ids: [...activeUser.savedMatchIds],
    };
  },

  /**
   * Actualiza el perfil activo tras iniciar sesión simulada.
   */
  async loginWithEmail(email: string): Promise<UserProfile> {
    await sleep(SIMULATED_LATENCY_MS);
    activeUser = {
      ...DEMO_REGISTERED_USER,
      email: email.trim(),
    };
    return { ...activeUser };
  },
};
