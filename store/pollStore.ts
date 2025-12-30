
import { Poll, PollOption } from '../types';

const STORAGE_KEY = 'quickpoll_data_v1';

export const getPolls = (): Poll[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePolls = (polls: Poll[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(polls));
  // Dispatch custom event for real-time sync across components in the same window
  window.dispatchEvent(new Event('pollUpdate'));
};

export const createPoll = (question: string, optionTexts: string[]): Poll => {
  const newPoll: Poll = {
    id: Math.random().toString(36).substr(2, 9),
    question,
    options: optionTexts.filter(t => t.trim() !== '').map(text => ({
      id: Math.random().toString(36).substr(2, 9),
      text,
      votes: 0
    })),
    createdAt: Date.now(),
    isActive: true,
    totalVotes: 0
  };
  
  const polls = getPolls();
  savePolls([newPoll, ...polls]);
  return newPoll;
};

export const voteInPoll = (pollId: string, optionId: string) => {
  const polls = getPolls();
  const updatedPolls = polls.map(poll => {
    if (poll.id === pollId) {
      const updatedOptions = poll.options.map(opt => 
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      );
      return { 
        ...poll, 
        options: updatedOptions, 
        totalVotes: poll.totalVotes + 1 
      };
    }
    return poll;
  });
  savePolls(updatedPolls);
};

export const deletePoll = (pollId: string) => {
  const polls = getPolls();
  savePolls(polls.filter(p => p.id !== pollId));
};
