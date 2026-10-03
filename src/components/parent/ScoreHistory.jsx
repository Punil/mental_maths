import React, { useState } from 'react';
import { Award, Clock, Calendar, CheckCircle2, XCircle, ChevronDown, ChevronUp, AlertTriangle, Zap } from 'lucide-react';

export default function ScoreHistory({ submissions = [] }) {
  const [gradeFilter, setGradeFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = submissions.filter(s => {
    if (gradeFilter === 'all') return true;
    return Number(s.grade) === Number(gradeFilter);
  });

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // Analyze weak spots from missed questions
  const missedQuestions = [];
  submissions.forEach(sub => {
    if (sub.answers) {
      sub.answers.forEach(a => {
        if (!a.isCorrect) {
          missedQuestions.push(a);
        }
      });
    }
  });

  // Calculate missed frequencies
  const missedOpFreq = { '+': 0, '-': 0, '×': 0, '÷': 0 };
  missedQuestions.forEach(q => {
    if (q.operator && missedOpFreq[q.operator] !== undefined) {
      missedOpFreq[q.operator]++;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            📊 Score History & Performance Reports
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Review detailed scores, accuracy, and time spent across all completed 15-question assignments.
          </p>
        </div>

        {/* Grade Filter */}
        <div className="inline-flex p-1 bg-slate-200 rounded-xl self-start sm:self-auto">
          {['all', '2', '3'].map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                gradeFilter === g
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {g === 'all' ? 'All Grades' : `Grade ${g}`}
            </button>
          ))}
        </div>
      </div>

      {/* Weak Spots & Insights Callout */}
      {missedQuestions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-amber-900 text-base">
              Identified Learning Insights
            </h3>
          </div>
          <p className="text-xs text-amber-800 mb-3">
            Across past assignments, {missedQuestions.length} total question(s) were missed. Here is where extra practice helps most:
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(missedOpFreq).map(([op, count]) => {
              if (count === 0) return null;
              const names = { '+': 'Addition (+)', '-': 'Subtraction (-)', '×': 'Multiplication (×)', '÷': 'Division (÷)' };
              return (
                <span
                  key={op}
                  className="bg-white/80 border border-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-xl"
                >
                  {names[op]}: {count} missed
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Submissions List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((sub) => {
            const isExpanded = expandedId === sub.id;
            const dateStr = new Date(sub.completedAt).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={sub.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-200 transition overflow-hidden"
              >
                {/* Summary Row */}
                <div
                  onClick={() => toggleExpand(sub.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
                      🦊
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-slate-800 text-base">
                          {sub.assignmentTitle}
                        </h4>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                          Grade {sub.grade}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {dateStr}
                        </span>
                        <span>•</span>
                        <span>Student: {sub.childName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Badges */}
                  <div className="flex items-center gap-4 self-end md:self-auto">
                    {/* Score */}
                    <div className="text-right">
                      <div className="text-lg font-black text-slate-800">
                        {sub.score} / {sub.totalQuestions}
                      </div>
                      <div
                        className={`text-xs font-bold ${
                          sub.accuracy >= 80 ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {sub.accuracy}% Accuracy
                      </div>
                    </div>

                    {/* Time */}
                    <div className="text-right border-l pl-4 border-slate-200">
                      <div className="text-sm font-extrabold text-slate-700">
                        {sub.totalTimeSeconds}s
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        avg {sub.averageTimePerQuestion}s/q
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Drilldown: 15 Questions */}
                {isExpanded && sub.answers && (
                  <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/60">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 mt-4">
                      Detailed 15-Question Breakdown
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {sub.answers.map((ans, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                            ans.isCorrect
                              ? 'bg-white border-emerald-200 text-slate-800'
                              : 'bg-rose-50 border-rose-200 text-rose-900'
                          }`}
                        >
                          <div>
                            <span className="font-extrabold mr-1">Q{idx + 1}:</span>
                            <span className="font-bold">{ans.prompt}</span>{' '}
                            <span className={ans.isCorrect ? 'text-emerald-600 font-extrabold' : 'text-rose-600 font-extrabold underline'}>
                              {ans.childAnswer}
                            </span>
                            {!ans.isCorrect && (
                              <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                                Correct: {ans.correctAnswer}
                              </div>
                            )}
                          </div>

                          <div className="text-right pl-2">
                            <span className="text-[10px] text-slate-400 font-semibold block">
                              {ans.timeSpentSeconds || 0}s
                            </span>
                            {ans.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-500 inline" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-lg">No submissions yet</h3>
          <p className="text-sm text-slate-400 mt-1">
            When the child completes mental math assignments on the tablet, their score and performance breakdown will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
