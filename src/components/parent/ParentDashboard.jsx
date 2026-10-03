import React, { useState } from 'react';
import { Activity, History, PlusCircle, Tablet, Shield, LogOut } from 'lucide-react';
import LiveMonitor from './LiveMonitor';
import ScoreHistory from './ScoreHistory';
import AssignmentCreator from './AssignmentCreator';
import DevicePairing from './DevicePairing';

export default function ParentDashboard({
  liveSessions = [],
  submissions = [],
  onAssignmentCreated,
  onExitParentMode
}) {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'history' | 'create' | 'pairing'

  const hasLiveSession = liveSessions.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center text-2xl shadow-md">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                Parent Control Center
              </h1>
              <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                Admin
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              Live monitoring, score tracking, assignment customization, and device pairing
            </p>
          </div>
        </div>

        <button
          onClick={onExitParentMode}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition touch-btn self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" /> Switch to Child View
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200 no-scrollbar">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition relative whitespace-nowrap ${
            activeTab === 'live'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Live Monitor</span>
          {hasLiveSession && (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute top-2 right-2" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Score History ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition whitespace-nowrap ${
            activeTab === 'create'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Custom Test</span>
        </button>

        <button
          onClick={() => setActiveTab('pairing')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition whitespace-nowrap ${
            activeTab === 'pairing'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Tablet className="w-4 h-4" />
          <span>Tablet QR & Setup</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'live' && (
        <LiveMonitor
          liveSessions={liveSessions}
          onOpenPairing={() => setActiveTab('pairing')}
        />
      )}

      {activeTab === 'history' && (
        <ScoreHistory submissions={submissions} />
      )}

      {activeTab === 'create' && (
        <AssignmentCreator
          onCreated={(newAssignment) => {
            if (onAssignmentCreated) onAssignmentCreated(newAssignment);
            setActiveTab('history');
          }}
        />
      )}

      {activeTab === 'pairing' && (
        <DevicePairing />
      )}
    </div>
  );
}
