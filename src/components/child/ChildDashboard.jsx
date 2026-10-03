import React, { useState } from 'react';
import { Play, CheckCircle, Award, Star, BookOpen, Sparkles, Filter, ChevronRight } from 'lucide-react';

export default function ChildDashboard({
  grade,
  onSelectGrade,
  assignments,
  submissions,
  onStartAssignment,
  onStartPractice,
  childProfile
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'completed' | 'pending'
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter assignments for the selected grade
  const currentGradeAssignments = assignments.filter(a => Number(a.grade) === Number(grade));

  // Map submissions to assignments for quick lookup
  const submissionMap = {};
  submissions.forEach(sub => {
    // Keep best or latest submission
    if (!submissionMap[sub.assignmentId] || sub.score > submissionMap[sub.assignmentId].score) {
      submissionMap[sub.assignmentId] = sub;
    }
  });

  const completedCount = currentGradeAssignments.filter(a => submissionMap[a.id]).length;
  const totalCount = currentGradeAssignments.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Unique categories for filtering
  const categories = ['all', ...Array.from(new Set(currentGradeAssignments.map(a => a.category)))];

  const filteredAssignments = currentGradeAssignments.filter(a => {
    const isCompleted = !!submissionMap[a.id];
    if (filter === 'completed' && !isCompleted) return false;
    if (filter === 'pending' && isCompleted) return false;
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Welcome Banner & Stats */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{childProfile?.avatar || '🦊'}</span>
              <span className="text-white/80 font-bold text-sm tracking-wider uppercase">
                Welcome back, {childProfile?.name || 'Champ'}!
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Grade {grade} Mental Maths Hub
            </h1>
            <p className="text-white/80 text-sm sm:text-base mt-1 max-w-xl">
              Complete each 15-question assignment to earn stars and level up your mental speed!
            </p>
          </div>

          {/* Quick Stats Box */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 self-start md:self-auto">
            <div className="text-center px-2">
              <div className="text-3xl font-black text-amber-300 flex items-center justify-center gap-1">
                <Star className="w-6 h-6 fill-amber-300" />
                {completedCount * 3}
              </div>
              <div className="text-xs text-white/80 font-medium">Stars Earned</div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center px-2">
              <div className="text-3xl font-black text-emerald-300">
                {completedCount} / {totalCount}
              </div>
              <div className="text-xs text-white/80 font-medium">Completed</div>
            </div>
          </div>
        </div>

        {/* Overall Grade Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/15">
          <div className="flex items-center justify-between text-xs text-white/90 font-bold mb-2">
            <span>Overall Grade {grade} Progress</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="bg-white/20 h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grade Selector & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        {/* Grade 2 vs Grade 3 Toggle Tabs */}
        <div className="inline-flex p-1.5 bg-slate-200 rounded-2xl">
          <button
            onClick={() => onSelectGrade(2)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm sm:text-base transition ${
              Number(grade) === 2
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎒 Grade 2 (50 Sets)
          </button>
          <button
            onClick={() => onSelectGrade(3)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm sm:text-base transition ${
              Number(grade) === 3
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🚀 Grade 3 (50 Sets)
          </button>
        </div>

        {/* Free Practice Button */}
        <button
          onClick={onStartPractice}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl shadow-sm transition touch-btn text-sm"
        >
          <Sparkles className="w-4 h-4" /> Free Practice Mode
        </button>
      </div>

      {/* Secondary Category / Status Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'pending' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            To Do ({totalCount - completedCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'completed' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Category dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Topics' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAssignments.map((assignment) => {
          const sub = submissionMap[assignment.id];
          const isDone = !!sub;

          return (
            <div
              key={assignment.id}
              className={`bg-white rounded-3xl p-5 border-2 transition-all flex flex-col justify-between hover:shadow-md ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    #{assignment.assignmentNumber || assignment.id}
                  </span>
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {sub.score}/{sub.totalQuestions} ({sub.accuracy}%)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      15 Questions
                    </span>
                  )}
                </div>

                {/* Assignment Title */}
                <h3 className="font-extrabold text-slate-800 text-base mb-1 line-clamp-1">
                  {assignment.title}
                </h3>

                {/* Category & Description */}
                <p className="text-xs font-semibold text-indigo-600 mb-1">
                  {assignment.category}
                </p>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                  {assignment.description}
                </p>
              </div>

              {/* Action Button */}
              <div>
                {isDone ? (
                  <button
                    onClick={() => onStartAssignment(assignment)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold rounded-2xl border border-emerald-300 transition touch-btn text-xs sm:text-sm"
                  >
                    <span>Practice Again</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => onStartAssignment(assignment)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-sm transition touch-btn text-xs sm:text-sm"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Test</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-lg">No assignments found</h3>
          <p className="text-sm text-slate-400 mt-1">Try resetting the filter to see more assignments.</p>
        </div>
      )}
    </div>
  );
}
