
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPoll } from '../store/pollStore';
import { generatePollSuggestions } from '../services/geminiService';

const CreatePoll: React.FC = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || options.filter(o => o.trim()).length < 2) {
      alert('Please enter a question and at least two options.');
      return;
    }
    const newPoll = createPoll(question, options);
    navigate(`/results/${newPoll.id}`);
  };

  const handleAISuggest = async () => {
    if (!topic.trim()) {
      alert('Enter a topic for AI suggestions (e.g., "Web Development", "World War II")');
      return;
    }
    setIsGenerating(true);
    const suggestion = await generatePollSuggestions(topic);
    if (suggestion) {
      setQuestion(suggestion.question);
      setOptions(suggestion.options);
    }
    setIsGenerating(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create New Poll</h1>
        <p className="text-slate-500 mt-2">Design your question and provide multiple-choice options.</p>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Magic Assistant
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Topic (e.g. React Fundamentals)"
            className="flex-1 bg-white border border-indigo-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            onClick={handleAISuggest}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
          >
            {isGenerating ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Suggest'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Question</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl px-4 py-4 text-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300"
            placeholder="What would you like to ask?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Options</label>
          {options.map((option, index) => (
            <div key={index} className="flex gap-2 group">
              <input
                type="text"
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="p-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOption}
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add another option
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all"
          >
            Create Poll
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-4 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePoll;
