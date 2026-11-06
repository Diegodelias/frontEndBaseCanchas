export type AuthMode = 'registered' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  joinedAt: string;
  savedMatchIds: string[];
}
