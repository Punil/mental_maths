import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle, XCircle, Clock, Zap, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { playFanfare } from '../../sounds';

export default function CompletionSummary({ submission, onRetry, onBackToDashboard, onNextAssignment }) {
  const { score, totalQuestions, accuracy, totalTimeSeconds, averageTimePerQuestion, answers, assignmentTitle } = submission;

  useEffect(() => {
    playFanfare();
    // Confetti burst
    const end = Date.now() + 2 * 1000;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const getPraise = () => {
    if (accuracy === 100) return { title: 'Perfect Score! 🌟🏆', desc: 'Incredible mental maths skills! You answered every question correctly!' };
    if (accuracy >= 80) return { title: 'Awesome Job! 🚀🎉', desc: 'Fantastic work! You are really mastering these mental math facts!' };
    if (accuracy >= 60) return { title: 'Good Effort! 👍✨', desc: 'Nice practice! Review the missed questions below to level up even higher.' };
    return { title: 'Keep Practicing! 💪', desc: 'Every practice session makes your brain sharper! Let us try again!' };
  };

  const praise = getPraise();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl p-6 sm:p-8 text-white text-center shadow-xl mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-3 shadow-inner">
            <Trophy className="w-12 h-12 text-amber-300 animate-bounce" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">{praise.title}</h1>
          <p className="text-white/90 text-sm sm:text-base max-w-md mx-auto mb-6">{praise.desc}</p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20">
              <div className="text-2xl sm:text-3xl font-extrabold">{score} / {totalQuestions}</div>
              <div className="text-xs text-white/80 font-medium uppercase tracking-wider">Score</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20">
              <div className="text-2xl sm:text-3xl font-extrabold">{accuracy}%</div>
              <div className="text-xs text-white/80 font-medium uppercase tracking-wider">Accuracy</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20">
              <div className="text-2xl sm:text-3xl font-extrabold">{totalTimeSeconds}s</div>
              <div className="text-xs text-white/80 font-medium uppercase tracking-wider">Total Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl shadow-md transition touch-btn text-base"
        >
          <Home className="w-5 h-5" />
          All Assignments
        </button>

        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-md transition touch-btn text-base"
        >
          <RotateCcw className="w-5 h-5" />
          Try Again
        </button>

        {onNextAssignment && (
          <button
            onClick={onNextAssignment}
            className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition touch-btn text-base"
          >
            Next Assignment
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Question by Question Review */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            📝 Question Breakdown ({assignmentTitle})
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Avg {averageTimePerQuestion}s / question
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {answers && answers.map((ans, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                ans.isCorrect
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/70 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-slate-400">Q{idx + 1}</span>
                {ans.isCorrect ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    <CheckCircle className="w-3.5 h-3.5" /> Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                    <XCircle className="w-3.5 h-3.5" /> Missed
                  </span>
                )}
              </div>

              {/* Math prompt */}
              <div className="my-2 text-center">
                <div className="text-lg font-extrabold text-slate-800">
                  {ans.prompt || `${ans.operand1} ${ans.operator} ${ans.operand2} =`} <span className={ans.isCorrect ? 'text-emerald-600' : 'text-rose-600 underline'}>{ans.childAnswer}</span>
                </div>
                {!ans.isCorrect && (
                  <div className="text-xs font-bold text-emerald-700 mt-1">
                    Correct answer: <span className="text-sm font-extrabold">{ans.correctAnswer}</span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200/50 pt-1.5 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {ans.timeSpentSeconds || 0}s
                </span>
                <span>{ans.isCorrect ? '+1 Pt' : '0 Pts'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
