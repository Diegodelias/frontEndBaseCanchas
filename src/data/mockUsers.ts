import { UserProfile } from '../types/user';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user-matias-01',
    name: 'Matías Rossi',
    email: 'matias.rossi@canchas3.com.ar',
    avatar: 'MR',
    role: 'Jugador habitual',
    joinedAt: 'Marzo 2026',
    savedMatchIds: ['match-en-f5-1900', 'match-lc-f5-1900'],
  },
];

export const DEMO_REGISTERED_USER = MOCK_USERS[0];
