
export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: number;
  isActive: boolean;
  totalVotes: number;
}

export type PollAction = 
  | { type: 'CREATE_POLL'; payload: Poll }
  | { type: 'VOTE'; payload: { pollId: string; optionId: string } }
  | { type: 'CLOSE_POLL'; payload: string }
  | { type: 'DELETE_POLL'; payload: string };

export interface AppState {
  polls: Poll[];
}
