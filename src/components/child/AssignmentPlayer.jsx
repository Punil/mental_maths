import React, { useState, useEffect, useRef } from 'react';
import { Clock, Flame, Delete, CornerDownLeft, ArrowLeft, Edit3, X, Sparkles } from 'lucide-react';
import Scratchpad from './Scratchpad';
import { playKeyClick, playCorrect, playIncorrect } from '../../sounds';

export default function AssignmentPlayer({
  assignment,
  childProfile,
  onComplete,
  onCancel,
  wsClient
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [answers, setAnswers] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [sessionStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' animation flash

  const questions = assignment.questions || [];
  const currentQ = questions[currentIndex] || {};
  const totalQuestions = questions.length;

  // Global elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Broadcast live progress to parent via WebSocket
  const broadcastProgress = (newAnswers = answers, activeIndex = currentIndex) => {
    if (!wsClient || wsClient.readyState !== WebSocket.OPEN) return;

    let correct = 0;
    let wrong = 0;
    newAnswers.forEach(a => {
      if (a.isCorrect) correct++;
      else wrong++;
    });

    try {
      wsClient.send(JSON.stringify({
        type: 'child_progress',
        childId: childProfile?.id || 'child-alex',
        childName: childProfile?.name || 'Alex',
        grade: assignment.grade,
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        currentIndex: activeIndex + 1,
        totalQuestions,
        currentQuestionText: questions[activeIndex]?.prompt || '',
        correctCount: correct,
        wrongCount: wrong,
        timeElapsedSeconds: Math.floor((Date.now() - sessionStartTime) / 1000)
      }));
    } catch (e) {
      console.error('Failed to broadcast progress:', e);
    }
  };

  // Broadcast when current question changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
    broadcastProgress(answers, currentIndex);
  }, [currentIndex]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmitAnswer();
      } else if (e.key === 'Escape') {
        setCurrentInput('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleDigit = (digit) => {
    playKeyClick();
    if (currentInput.length >= 6) return; // Prevent excessive inputs
    setCurrentInput(prev => prev + digit);
  };

  const handleBackspace = () => {
    playKeyClick();
    setCurrentInput(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    playKeyClick();
    setCurrentInput('');
  };

  const handleSubmitAnswer = async () => {
    if (currentInput.trim() === '') return;

    const childAns = parseInt(currentInput.trim(), 10);
    const correctAns = currentQ.answer;
    const isCorrect = childAns === correctAns;
    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));

    if (isCorrect) {
      playCorrect();
      setStreak(s => s + 1);
      setFeedback('correct');
    } else {
      playIncorrect();
      setStreak(0);
      setFeedback('wrong');
    }

    const recordedAnswer = {
      questionId: currentQ.id,
      prompt: currentQ.prompt,
      operand1: currentQ.operand1,
      operator: currentQ.operator,
      operand2: currentQ.operand2,
      correctAnswer: correctAns,
      childAnswer: childAns,
      isCorrect,
      timeSpentSeconds: timeSpent
    };

    const newAnswers = [...answers, recordedAnswer];
    setAnswers(newAnswers);
    setCurrentInput('');

    // Clear feedback flash after short delay
    setTimeout(() => setFeedback(null), 600);

    // If more questions exist, proceed to next
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(prev => prev + 1);
      broadcastProgress(newAnswers, currentIndex + 1);
    } else {
      // Completed all 15 questions!
      const totalTimeSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
      broadcastProgress(newAnswers, totalQuestions);

      // Save submission to server
      try {
        const res = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assignmentId: assignment.id,
            assignmentTitle: assignment.title,
            grade: assignment.grade,
            childId: childProfile?.id || 'child-alex',
            childName: childProfile?.name || 'Alex',
            answers: newAnswers,
            totalTimeSeconds
          })
        });
        const submission = await res.json();
        onComplete(submission);
      } catch (err) {
        console.error('Failed to submit assignment:', err);
        // Fallback local submission object
        let correctCount = 0;
        newAnswers.forEach(a => { if (a.isCorrect) correctCount++; });
        onComplete({
          assignmentId: assignment.id,
          assignmentTitle: assignment.title,
          grade: assignment.grade,
          childId: childProfile?.id || 'child-alex',
          childName: childProfile?.name || 'Alex',
          answers: newAnswers,
          score: correctCount,
          totalQuestions,
          accuracy: Math.round((correctCount / totalQuestions) * 100),
          totalTimeSeconds,
          averageTimePerQuestion: Math.round((totalTimeSeconds / totalQuestions) * 10) / 10
        });
      }
    }
  };

  const progressPct = Math.round(((currentIndex) / totalQuestions) * 100);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 flex flex-col min-h-[calc(100vh-80px)]">
      {/* Top Header / Progress bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>

          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            {streak > 1 && (
              <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full animate-bounce">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                {streak} Streak!
              </span>
            )}

            {/* Timer */}
            <span className="flex items-center gap-1 bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 text-slate-500" />
              {Math.floor(elapsedSeconds / 60)}:
              {String(elapsedSeconds % 60).padStart(2, '0')}
            </span>

            {/* Scratchpad Toggle Button */}
            <button
              onClick={() => setShowScratchpad(v => !v)}
              className={`flex items-center gap-1 text-xs sm:text-sm font-bold px-3 py-1 rounded-full border transition touch-btn ${
                showScratchpad
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Scratchpad</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-slate-600 whitespace-nowrap">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Main Layout: Question + Keypad + (Optional Scratchpad) */}
      <div className={`grid gap-4 flex-1 ${showScratchpad ? 'lg:grid-cols-12' : 'max-w-2xl mx-auto w-full'}`}>
        
        {/* Math Question & Touch Keypad Column */}
        <div className={`flex flex-col gap-4 ${showScratchpad ? 'lg:col-span-7' : 'w-full'}`}>
          {/* Question Display Card */}
          <div
            className={`bg-white rounded-3xl p-6 sm:p-8 text-center shadow-sm border-2 transition-all relative overflow-hidden flex flex-col justify-center items-center min-h-[170px] ${
              feedback === 'correct'
                ? 'border-emerald-400 bg-emerald-50/40 ring-4 ring-emerald-100'
                : feedback === 'wrong'
                ? 'border-rose-400 bg-rose-50/40 ring-4 ring-rose-100'
                : 'border-slate-200'
            }`}
          >
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Question {currentIndex + 1}
            </span>

            <div className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-800 tracking-wide font-['Fredoka',sans-serif] flex items-center justify-center gap-3">
              <span>{currentQ.operand1}</span>
              <span className="text-indigo-600">{currentQ.operator}</span>
              <span>{currentQ.operand2}</span>
              <span className="text-slate-400">=</span>
              <div className="min-w-[90px] h-[64px] border-b-4 border-indigo-500 bg-indigo-50/50 rounded-xl flex items-center justify-center px-3 text-indigo-700 font-extrabold">
                {currentInput || <span className="text-slate-300 animate-pulse">?</span>}
              </div>
            </div>

            {feedback === 'correct' && (
              <span className="absolute bottom-2 font-bold text-emerald-600 text-sm animate-bounce flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Great Job!
              </span>
            )}
            {feedback === 'wrong' && (
              <span className="absolute bottom-2 font-bold text-rose-600 text-sm animate-pulse">
                Keep going! Next one!
              </span>
            )}
          </div>

          {/* Touch-Friendly Numeric Keypad */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200 flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-md mx-auto w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleDigit(String(num))}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-100 hover:bg-indigo-50 active:bg-indigo-100 text-slate-800 font-extrabold text-2xl sm:text-3xl border border-slate-200 shadow-sm touch-btn flex items-center justify-center"
                >
                  {num}
                </button>
              ))}

              {/* Clear button */}
              <button
                type="button"
                onClick={handleClear}
                className="h-14 sm:h-16 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm sm:text-base border border-rose-200 shadow-sm touch-btn flex items-center justify-center uppercase tracking-wider"
              >
                Clear
              </button>

              {/* Zero */}
              <button
                type="button"
                onClick={() => handleDigit('0')}
                className="h-14 sm:h-16 rounded-2xl bg-slate-100 hover:bg-indigo-50 active:bg-indigo-100 text-slate-800 font-extrabold text-2xl sm:text-3xl border border-slate-200 shadow-sm touch-btn flex items-center justify-center"
              >
                0
              </button>

              {/* Backspace */}
              <button
                type="button"
                onClick={handleBackspace}
                className="h-14 sm:h-16 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xl border border-slate-200 shadow-sm touch-btn flex items-center justify-center"
                title="Backspace"
              >
                <Delete className="w-6 h-6" />
              </button>
            </div>

            {/* Giant Submit Button */}
            <div className="max-w-md mx-auto w-full mt-3">
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={currentInput.trim() === ''}
                className={`w-full h-14 sm:h-16 rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center gap-2 shadow-md transition touch-btn ${
                  currentInput.trim() !== ''
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 ring-2 ring-emerald-400 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Submit Answer
                <CornerDownLeft className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Scratchpad Column (Tablet Friendly) */}
        {showScratchpad && (
          <div className="lg:col-span-5 h-[340px] lg:h-auto min-h-[300px]">
            <Scratchpad isOpen={showScratchpad} onClose={() => setShowScratchpad(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
