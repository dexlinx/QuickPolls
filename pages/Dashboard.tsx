
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Poll } from '../types';
import { getPolls, deletePoll } from '../store/pollStore';
import { PollCard } from '../components/PollCard';

const Dashboard: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadPolls = async () => {
    setIsLoading(true);
    const data = await getPolls();
    setPolls(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPolls();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this poll?')) {
      await deletePoll(id);
      loadPolls();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Polls</h1>
          <p className="text-slate-500 mt-1">Manage your classroom interactions and view results.</p>
        </div>
        <button 
          onClick={() => navigate('/create')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Poll
        </button>
      </div>

      {polls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center px-6">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">No polls found</h2>
          <p className="text-slate-500 max-w-sm mb-8">You haven't created any polls yet. Get started by creating your first interactive poll.</p>
          <button 
            onClick={() => navigate('/create')}
            className="text-indigo-600 font-bold hover:underline"
          >
            Create your first poll &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map(poll => (
            <PollCard 
              key={poll.id} 
              poll={poll} 
              onView={(id) => navigate(`/results/${id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
