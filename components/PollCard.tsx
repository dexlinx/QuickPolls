
import React from 'react';
import { Poll } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PollCardProps {
  poll: Poll;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

export const PollCard: React.FC<PollCardProps> = ({ poll, onView, onDelete }) => {
  const shareLink = `${window.location.origin}${window.location.pathname}#/vote/${poll.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-slate-800 line-clamp-2">{poll.question}</h3>
        <button 
          onClick={() => onDelete(poll.id)}
          className="text-slate-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="h-40 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={poll.options}>
            <XAxis dataKey="text" hide />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
              {poll.options.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{poll.totalVotes} total votes</span>
          <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onView(poll.id)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
          >
            Live Results
          </button>
          <button 
            onClick={copyLink}
            className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg transition-colors"
            title="Copy Share Link"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
