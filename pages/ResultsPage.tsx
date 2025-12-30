
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Poll } from '../types';
import { getPolls } from '../store/pollStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { analyzePollResults } from '../services/geminiService';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4'];

const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const refreshPoll = useCallback(() => {
    const polls = getPolls();
    const found = polls.find(p => p.id === id);
    if (found) {
      setPoll(found);
    }
  }, [id]);

  useEffect(() => {
    refreshPoll();
    // Real-time synchronization within the same browser
    window.addEventListener('pollUpdate', refreshPoll);
    window.addEventListener('storage', refreshPoll);
    return () => {
      window.removeEventListener('pollUpdate', refreshPoll);
      window.removeEventListener('storage', refreshPoll);
    };
  }, [refreshPoll]);

  const handleAnalyze = async () => {
    if (!poll) return;
    setIsAnalyzing(true);
    const result = await analyzePollResults(poll);
    setAnalysis(result || "Analysis failed.");
    setIsAnalyzing(false);
  };

  const copyLink = () => {
    const link = `${window.location.origin}${window.location.pathname}#/vote/${id}`;
    navigator.clipboard.writeText(link);
    alert('Voting link copied!');
  };

  if (!poll) return null;

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <button 
            onClick={() => navigate('/')}
            className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 mb-2 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-900">{poll.question}</h1>
          <p className="text-slate-500 mt-2 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Results — {poll.totalVotes} votes total
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={copyLink}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 px-6 py-3 rounded-xl font-bold transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Share Link
          </button>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || poll.totalVotes === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
          >
            {isAnalyzing ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Insights
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={poll.options} margin={{ left: 100, right: 40, top: 20, bottom: 20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="text" 
                  width={90} 
                  tick={{ fontSize: 14, fill: '#475569', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="votes" radius={[0, 8, 8, 0]} barSize={40}>
                  {poll.options.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <LabelList dataKey="votes" position="right" style={{ fill: '#64748b', fontWeight: 600 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {poll.options.map((opt, i) => (
              <div key={opt.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-sm font-semibold text-slate-500 uppercase">Option {i + 1}</span>
                </div>
                <div className="text-xl font-bold text-slate-900 mb-1">{opt.text}</div>
                <div className="text-3xl font-black text-indigo-600">
                  {poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0}%
                </div>
                <div className="text-sm text-slate-400 mt-1">{opt.votes} votes</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Insights
            </h2>
            {analysis ? (
              <div className="prose prose-slate">
                <p className="text-slate-600 italic leading-relaxed">
                  "{analysis}"
                </p>
                <button 
                  onClick={() => setAnalysis(null)}
                  className="mt-4 text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                >
                  Clear Analysis
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm">Click "AI Insights" to analyze these results.</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
            <h3 className="font-bold text-lg mb-2">Instructions</h3>
            <ul className="space-y-3 text-sm text-indigo-100">
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <span>Copy the share link and send it to your students.</span>
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <span>Watch this screen as results update in real-time.</span>
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <span>Use AI insights once enough votes are in to evaluate understanding.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
