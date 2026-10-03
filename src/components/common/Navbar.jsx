import React, { useState } from 'react';
import { Volume2, VolumeX, Shield, Tablet, Wifi, QrCode } from 'lucide-react';
import { isSoundEnabled, toggleSound } from '../../sounds';

export default function Navbar({
  mode,
  onOpenParentLogin,
  onSwitchToChild,
  onOpenPairingModal,
  childProfile
}) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xl shadow-sm text-white">
            🧮
          </div>
          <div>
            <div className="font-black text-lg sm:text-xl text-slate-800 tracking-tight leading-none">
              Mental<span className="text-indigo-600">Maths</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-0.5">
              Grade 2 & Grade 3
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition touch-btn flex items-center gap-1.5 text-xs font-bold"
            title={soundOn ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="hidden md:inline">{soundOn ? 'Sound On' : 'Muted'}</span>
          </button>

          {/* Wi-Fi / QR Pairing Button */}
          <button
            onClick={onOpenPairingModal}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition touch-btn flex items-center gap-1.5 text-xs font-bold"
            title="Wi-Fi Pairing & QR Code"
          >
            <QrCode className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Connect Tablet</span>
          </button>

          {/* Role Switcher */}
          {mode === 'child' ? (
            <button
              onClick={onOpenParentLogin}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-sm transition touch-btn"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Parent Mode</span>
            </button>
          ) : (
            <button
              onClick={onSwitchToChild}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-extrabold border border-indigo-200 transition touch-btn"
            >
              <span>{childProfile?.avatar || '🦊'} Child View</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
