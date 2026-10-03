import React, { useState } from 'react';
import { ArrowLeft, Play, Sparkles, Check } from 'lucide-react';

export default function PracticeMode({ onStart, onBack }) {
  const [selectedOps, setSelectedOps] = useState(['+']);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(15);

  const toggleOp = (op) => {
    if (selectedOps.includes(op)) {
      if (selectedOps.length > 1) {
        setSelectedOps(selectedOps.filter(o => o !== op));
      }
    } else {
      setSelectedOps([...selectedOps, op]);
    }
  };

  const handleBegin = () => {
    let minNum = 1;
    let maxNum = 20;

    if (difficulty === 'easy') {
      minNum = 1;
      maxNum = 10;
    } else if (difficulty === 'medium') {
      minNum = 5;
      maxNum = 50;
    } else {
      minNum = 10;
      maxNum = 100;
    }

    // Generate questions locally
    const questions = [];
    for (let i = 1; i <= questionCount; i++) {
      const op = selectedOps[Math.floor(Math.random() * selectedOps.length)];
      let n1, n2, ans;

      if (op === '+') {
        n1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        n2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        ans = n1 + n2;
      } else if (op === '-') {
        n1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        n2 = Math.floor(Math.random() * (n1 - minNum + 1)) + minNum;
        ans = n1 - n2;
      } else if (op === '×') {
        n1 = Math.floor(Math.random() * 10) + 2;
        n2 = Math.floor(Math.random() * 10) + 1;
        ans = n1 * n2;
      } else {
        const div = Math.floor(Math.random() * 9) + 2;
        ans = Math.floor(Math.random() * 9) + 1;
        n1 = div * ans;
        n2 = div;
      }

      questions.push({
        id: `practice-q${i}`,
        operand1: n1,
        operator: op,
        operand2: n2,
        answer: ans,
        prompt: `${n1} ${op} ${n2} =`
      });
    }

    onStart({
      id: `practice-${Date.now()}`,
      title: 'Free Practice Sprint',
      category: 'Practice Mode',
      grade: difficulty === 'easy' ? 2 : 3,
      questionCount,
      questions
    });
  };

  const opButtons = [
    { op: '+', label: 'Addition (+)', color: 'from-blue-500 to-indigo-600' },
    { op: '-', label: 'Subtraction (-)', color: 'from-emerald-500 to-teal-600' },
    { op: '×', label: 'Multiplication (×)', color: 'from-purple-500 to-pink-600' },
    { op: '÷', label: 'Division (÷)', color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assignments
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-700 shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black text-slate-800">Free Practice Mode</h2>
          <p className="text-slate-500 text-sm mt-1">
            Pick your operations, difficulty, and jump into quick mental math practice!
          </p>
        </div>

        {/* 1. Pick Operations */}
        <div className="mb-6">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            1. Select Operations (Pick at least one)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {opButtons.map(({ op, label }) => {
              const active = selectedOps.includes(op);
              return (
                <button
                  key={op}
                  type="button"
                  onClick={() => toggleOp(op)}
                  className={`p-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-between border-2 transition touch-btn ${
                    active
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>{label}</span>
                  {active && <Check className="w-5 h-5 text-indigo-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Difficulty */}
        <div className="mb-6">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            2. Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'easy', label: 'Easy', desc: '1 to 10' },
              { id: 'medium', label: 'Medium', desc: 'Up to 50' },
              { id: 'hard', label: 'Challenging', desc: 'Up to 100' },
            ].map(({ id, label, desc }) => (
              <button
                key={id}
                type="button"
                onClick={() => setDifficulty(id)}
                className={`p-3 rounded-2xl border-2 text-center transition touch-btn ${
                  difficulty === id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-extrabold text-sm">{label}</div>
                <div className="text-[11px] text-slate-400">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Number of Questions */}
        <div className="mb-8">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            3. Number of Questions
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[10, 15, 20].map(count => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                className={`p-3 rounded-2xl border-2 font-black text-center transition touch-btn ${
                  questionCount === count
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {count} Questions
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleBegin}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xl flex items-center justify-center gap-2 shadow-lg transition touch-btn"
        >
          <Play className="w-5 h-5 fill-white" />
          Start Practice Now
        </button>
      </div>
    </div>
  );
}
