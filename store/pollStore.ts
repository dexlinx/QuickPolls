
import { Poll, PollOption } from '../types';

// IMPORTANT: Replace this with your actual DreamHost API URL
const API_URL = 'https://yourdomain.com/api.php';

export const getPolls = async (): Promise<Poll[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const getPollById = async (id: string): Promise<Poll | null> => {
  try {
    const response = await fetch(`${API_URL}?id=${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const createPoll = async (question: string, optionTexts: string[]): Promise<Poll> => {
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
  
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPoll)
  });

  return newPoll;
};

export const voteInPoll = async (pollId: string, optionId: string) => {
  await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pollId, optionId })
  });
};

export const deletePoll = async (pollId: string) => {
  await fetch(`${API_URL}?id=${pollId}`, {
    method: 'DELETE'
  });
};
