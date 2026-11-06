import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { playsService } from '../services/playsService';
import { SavedPlay, SavePlayInput } from '../types/play';
import { useAuth } from './AuthContext';

interface PlaysContextValue {
  savedPlays: SavedPlay[];
  savedMatchIds: string[];
  isLoading: boolean;
  savePlay: (input: SavePlayInput) => Promise<SavedPlay>;
  deletePlay: (playId: string) => Promise<boolean>;
  toggleSaveMatch: (matchId: string) => Promise<boolean>;
  isMatchSaved: (matchId: string) => boolean;
  refreshPlays: () => Promise<void>;
}

const PlaysContext = createContext<PlaysContextValue | undefined>(undefined);

export const PlaysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [savedPlays, setSavedPlays] = useState<SavedPlay[]>([]);
  const [savedMatchIds, setSavedMatchIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPlaysAndMatches = async () => {
    setIsLoading(true);
    try {
      const plays = await playsService.getSavedPlays(user?.id);
      setSavedPlays(plays);
      setSavedMatchIds(user?.savedMatchIds || ['match-en-f5-1900', 'match-lc-f5-1900']);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaysAndMatches();
  }, [user]);

  const savePlay = async (input: SavePlayInput): Promise<SavedPlay> => {
    const play = await playsService.savePlay(input, user?.id);
    setSavedPlays((prev) => [play, ...prev.filter((p) => p.id !== play.id)]);
    return play;
  };

  const deletePlay = async (playId: string): Promise<boolean> => {
    const success = await playsService.deletePlay(playId);
    if (success) {
      setSavedPlays((prev) => prev.filter((p) => p.id !== playId));
    }
    return success;
  };

  const toggleSaveMatch = async (matchId: string): Promise<boolean> => {
    const { saved, ids } = await authService.toggleSavedMatch(matchId);
    setSavedMatchIds(ids);
    return saved;
  };

  const isMatchSaved = (matchId: string): boolean => {
    return savedMatchIds.includes(matchId);
  };

  return (
    <PlaysContext.Provider
      value={{
        savedPlays,
        savedMatchIds,
        isLoading,
        savePlay,
        deletePlay,
        toggleSaveMatch,
        isMatchSaved,
        refreshPlays: fetchPlaysAndMatches,
      }}
    >
      {children}
    </PlaysContext.Provider>
  );
};

export function usePlays(): PlaysContextValue {
  const ctx = useContext(PlaysContext);
  if (!ctx) {
    throw new Error('usePlays must be used within a PlaysProvider');
  }
  return ctx;
}
