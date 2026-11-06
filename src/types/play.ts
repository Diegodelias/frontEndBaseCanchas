export interface SavedPlay {
  id: string;
  matchId: string;
  title: string;
  clubName: string;
  courtName: string;
  dateLabel: string;
  timeSlot: string;
  startTime: number; // in seconds
  endTime: number; // simulated end timestamp in seconds
  thumbnail?: string;
  createdAt: string;
  userId?: string;
}

export interface SavePlayInput {
  matchId: string;
  title?: string;
  clubName: string;
  courtName: string;
  dateLabel: string;
  timeSlot: string;
  startTime: number;
  endTime?: number;
  thumbnail?: string;
}
