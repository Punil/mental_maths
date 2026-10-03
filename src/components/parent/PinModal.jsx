import React, { useState } from 'react';
import { Lock, Delete, X, AlertCircle } from 'lucide-react';
import { playKeyClick } from '../../sounds';

export default function PinModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (d) => {
    playKeyClick();
    if (pin.length < 4) {
      const nextPin = pin + d;
      setPin(nextPin);
      setError(false);
      if (nextPin.length === 4) {
        verify(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    playKeyClick();
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const verify = async (code) => {
    setLoading(true);
    try {
      const res = await fetch('/api/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: code })
      });
      const data = await res.json();
      if (data.valid || code === '1234') {
        setPin('');
        onSuccess();
      } else {
        setError(true);
        setPin('');
      }
    } catch (e) {
      // Local check fallback
      if (code === '1234') {
        setPin('');
        onSuccess();
      } else {
        setError(true);
        setPin('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-2 text-indigo-600">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-800">Parent Access</h3>
          <p className="text-xs text-slate-500 mt-1">
            Enter PIN to access Parent Dashboard (Default: <strong>1234</strong>)
          </p>
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                pin.length > i
                  ? 'bg-indigo-600 border-indigo-600 scale-110'
                  : 'bg-slate-100 border-slate-300'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 text-center text-xs font-bold text-rose-600 flex items-center justify-center gap-1">
            <AlertCircle className="w-4 h-4" /> Incorrect PIN. Try default 1234.
          </div>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto mb-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(String(num))}
              className="h-12 rounded-xl bg-slate-50 hover:bg-indigo-50 active:bg-indigo-100 font-extrabold text-xl text-slate-800 border border-slate-200 shadow-sm touch-btn flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-12 rounded-xl bg-slate-50 hover:bg-indigo-50 active:bg-indigo-100 font-extrabold text-xl text-slate-800 border border-slate-200 shadow-sm touch-btn flex items-center justify-center"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-base border border-slate-200 shadow-sm touch-btn flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
