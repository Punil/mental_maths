import React, { useState } from 'react';
import { PlusCircle, Sparkles, Check, CheckCircle2 } from 'lucide-react';

export default function AssignmentCreator({ onCreated }) {
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState(2);
  const [operations, setOperations] = useState(['+']);
  const [minNum, setMinNum] = useState(1);
  const [maxNum, setMaxNum] = useState(20);
  const [selectedTables, setSelectedTables] = useState([2, 5, 10]);
  const [questionCount, setQuestionCount] = useState(15);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleOp = (op) => {
    if (operations.includes(op)) {
      if (operations.length > 1) {
        setOperations(operations.filter(o => o !== op));
      }
    } else {
      setOperations([...operations, op]);
    }
  };

  const toggleTable = (num) => {
    if (selectedTables.includes(num)) {
      setSelectedTables(selectedTables.filter(n => n !== num));
    } else {
      setSelectedTables([...selectedTables, num]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: title.trim() || `Custom Grade ${grade} Math Set`,
      grade: Number(grade),
      operations,
      minNum: Number(minNum),
      maxNum: Number(maxNum),
      tables: operations.includes('×') || operations.includes('÷') ? selectedTables : [],
      questionCount: Number(questionCount) || 15,
      timeLimitMinutes: 10
    };

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onCreated) onCreated(data);
      }, 1200);
    } catch (err) {
      console.error('Failed to create assignment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-indigo-600" />
          Create Custom 15-Question Assignment
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Generate an extra personalized assignment tailored to your child's specific practice needs.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          Assignment created successfully! It is now instantly available on the tablet.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
            Assignment Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 7x & 8x Tables Focus or 2-Digit Regrouping"
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-semibold text-slate-800 text-sm"
          />
        </div>

        {/* Target Grade */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
            Target Grade Level
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[2, 3].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={`py-3 px-4 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 transition ${
                  grade === g
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Grade {g}
              </button>
            ))}
          </div>
        </div>

        {/* Operations */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
            Allowed Operations (Select at least one)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { op: '+', label: 'Addition (+)' },
              { op: '-', label: 'Subtraction (-)' },
              { op: '×', label: 'Multiply (×)' },
              { op: '÷', label: 'Divide (÷)' },
            ].map(({ op, label }) => {
              const active = operations.includes(op);
              return (
                <button
                  key={op}
                  type="button"
                  onClick={() => toggleOp(op)}
                  className={`py-2.5 px-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-between transition ${
                    active
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>{label}</span>
                  {active && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Times Tables Filter (if x or ÷ selected) */}
        {(operations.includes('×') || operations.includes('÷')) && (
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Specific Times Tables (Optional Filter)
            </label>
            <div className="flex flex-wrap gap-2">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                const active = selectedTables.includes(num);
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => toggleTable(num)}
                    className={`w-9 h-9 rounded-xl font-black text-xs border transition ${
                      active
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {num}×
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Number Ranges (for addition & subtraction) */}
        {(operations.includes('+') || operations.includes('-')) && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Minimum Number
              </label>
              <input
                type="number"
                value={minNum}
                onChange={(e) => setMinNum(e.target.value)}
                min="0"
                max="1000"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 font-semibold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Maximum Number
              </label>
              <input
                type="number"
                value={maxNum}
                onChange={(e) => setMaxNum(e.target.value)}
                min="1"
                max="1000"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 font-semibold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-md transition touch-btn flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
          {loading ? 'Generating...' : 'Create & Assign to Tablet (15 Questions)'}
        </button>
      </form>
    </div>
  );
}
