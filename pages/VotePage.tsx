
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Poll } from '../types';
import { getPollById, voteInPoll } from '../store/pollStore';

const VotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPoll = async () => {
      if (!id) return;
      const found = await getPollById(id);
      if (!found) {
        navigate('/');
        return;
      }
      setPoll(found);
      setIsLoading(false);
      
      const votedList = JSON.parse(localStorage.getItem('voted_polls') || '[]');
      if (votedList.includes(id)) {
        setHasVoted(true);
      }
    };
    loadPoll();
  }, [id, navigate]);

  const handleVote = async () => {
    if (!id || !selectedOption) return;
    
    await voteInPoll(id, selectedOption);
    
    const votedList = JSON.parse(localStorage.getItem('voted_polls') || '[]');
    localStorage.setItem('voted_polls', JSON.stringify([...votedList, id]));
    
    setHasVoted(true);
    setTimeout(() => {
      navigate(`/results/${id}`);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!poll) return null;

  return (
    <div className="max-w-xl mx-auto py-12 px-4 animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 px-8 py-10 text-white">
          <h1 className="text-2xl font-bold leading-tight">{poll.question}</h1>
          <p className="mt-2 text-indigo-100 text-sm">Select one option below to cast your vote.</p>
        </div>

        <div className="p-8">
          {hasVoted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Vote Recorded!</h2>
              <p className="text-slate-500">Thank you for participating. Redirecting to live results...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {poll.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                    selectedOption === option.id
                      ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50'
                      : 'border-slate-100 hover:border-indigo-200 bg-white'
                  }`}
                >
                  <span className={`text-lg font-medium ${selectedOption === option.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {option.text}
                  </span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedOption === option.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'
                  }`}>
                    {selectedOption === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}

              <button
                onClick={handleVote}
                disabled={!selectedOption}
                className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 transition-all active:scale-95"
              >
                Submit Vote
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotePage;
