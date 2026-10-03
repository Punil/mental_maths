import React from 'react';
import { Activity, Clock, CheckCircle2, XCircle, Tablet, Wifi, Sparkles } from 'lucide-react';

export default function LiveMonitor({ liveSessions = [], onOpenPairing }) {
  const hasActiveSession = liveSessions.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            Real-Time Live Monitor
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Watch your child's assignment progress in real-time as they solve problems on their tablet.
          </p>
        </div>

        <button
          onClick={onOpenPairing}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs sm:text-sm border border-indigo-200 transition touch-btn self-start sm:self-auto"
        >
          <Tablet className="w-4 h-4" /> Tablet QR Code & URL
        </button>
      </div>

      {hasActiveSession ? (
        <div className="grid grid-cols-1 gap-6">
          {liveSessions.map((session) => {
            const progress = Math.round(((session.currentIndex || 1) / (session.totalQuestions || 15)) * 100);
            return (
              <div
                key={session.childId}
                className="bg-white rounded-3xl p-6 shadow-md border-2 border-indigo-200 relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl shadow-inner">
                      🦊
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-extrabold text-slate-800">
                          {session.childName || 'Child'}
                        </h3>
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          Grade {session.grade || 2}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full animate-pulse">
                          ● Solving Now
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-500 mt-0.5">
                        {session.assignmentTitle || 'Mental Math Assignment'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 self-start md:self-auto">
                    <div className="flex items-center gap-1.5 text-slate-700 text-sm font-bold">
                      <Clock className="w-4 h-4 text-slate-500" />
                      {Math.floor((session.timeElapsedSeconds || 0) / 60)}:
                      {String((session.timeElapsedSeconds || 0) % 60).padStart(2, '0')}
                    </div>
                    <div className="h-4 w-px bg-slate-300" />
                    <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      {session.correctCount || 0} Correct
                    </div>
                    {session.wrongCount > 0 && (
                      <>
                        <div className="h-4 w-px bg-slate-300" />
                        <div className="flex items-center gap-1.5 text-rose-500 text-sm font-bold">
                          <XCircle className="w-4 h-4" />
                          {session.wrongCount} Missed
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                    <span>
                      Progress: Question {session.currentIndex || 1} of {session.totalQuestions || 15}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Live Question Card Preview */}
                {session.currentQuestionText && (
                  <div className="mt-5 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-4 text-white flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest">
                        Child's Screen Currently Displaying:
                      </div>
                      <div className="text-2xl font-black font-['Fredoka',sans-serif] mt-1 text-amber-300">
                        {session.currentQuestionText} <span className="text-white/60">[ ? ]</span>
                      </div>
                    </div>
                    <div className="text-xs text-indigo-200 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                      Awaiting child's answer...
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Wifi className="w-8 h-8 animate-pulse text-indigo-500" />
          </div>
          <h3 className="text-lg font-black text-slate-800">
            Listening for active tablet sessions...
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            When your child opens an assignment on their tablet, their live question progress, score, and elapsed time will appear here automatically.
          </p>
          <button
            onClick={onOpenPairing}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-sm text-sm transition touch-btn"
          >
            <Tablet className="w-4 h-4" /> Connect Tablet Now
          </button>
        </div>
      )}
    </div>
  );
}
