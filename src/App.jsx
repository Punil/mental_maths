import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/common/Navbar';
import ChildDashboard from './components/child/ChildDashboard';
import AssignmentPlayer from './components/child/AssignmentPlayer';
import CompletionSummary from './components/child/CompletionSummary';
import PracticeMode from './components/child/PracticeMode';
import ParentDashboard from './components/parent/ParentDashboard';
import PinModal from './components/parent/PinModal';
import DevicePairing from './components/parent/DevicePairing';
import { X } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('mm_mode') || 'child';
  });
  const [grade, setGrade] = useState(() => {
    return Number(localStorage.getItem('mm_grade')) || 2;
  });

  const [childProfile] = useState({
    id: 'child-alex',
    name: 'Alex',
    avatar: '🦊',
    grade: 2
  });

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [lastSubmission, setLastSubmission] = useState(null);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);

  const wsRef = useRef(null);

  // Switch role and save to localStorage
  const handleSetMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('mm_mode', newMode);
  };

  const handleSelectGrade = (newGrade) => {
    setGrade(newGrade);
    localStorage.setItem('mm_grade', String(newGrade));
  };

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [resAssignments, resSubmissions, resLive] = await Promise.all([
        fetch('/api/assignments'),
        fetch('/api/submissions'),
        fetch('/api/live-sessions')
      ]);

      if (resAssignments.ok) setAssignments(await resAssignments.json());
      if (resSubmissions.ok) setSubmissions(await resSubmissions.json());
      if (resLive.ok) setLiveSessions(await resLive.json());
    } catch (err) {
      console.error('Initial data fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // WebSocket connection & real-time live sync
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    let socket;

    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        if (mode === 'parent') {
          socket.send(JSON.stringify({ type: 'register_parent' }));
        }
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'live_sessions_sync') {
            setLiveSessions(data.sessions || []);
          } else if (data.type === 'live_session_update') {
            setLiveSessions(prev => {
              const filtered = prev.filter(s => s.childId !== data.session.childId);
              return [...filtered, data.session];
            });
          } else if (data.type === 'live_session_ended') {
            setLiveSessions(prev => prev.filter(s => s.childId !== data.childId));
          } else if (data.type === 'child_submission') {
            setSubmissions(prev => [data.submission, ...prev]);
            setLiveSessions(prev => prev.filter(s => s.childId !== data.submission.childId));
          } else if (data.type === 'assignment_created') {
            setAssignments(prev => [...prev, data.assignment]);
          }
        } catch (e) {
          console.error('Error handling WS message:', e);
        }
      };
    } catch (e) {
      console.error('WebSocket connection failed:', e);
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [mode]);

  // When parent mode is active, register as parent listener on WS
  useEffect(() => {
    if (mode === 'parent' && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'register_parent' }));
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Nunito',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        mode={mode}
        onOpenParentLogin={() => setShowPinModal(true)}
        onSwitchToChild={() => handleSetMode('child')}
        onOpenPairingModal={() => setShowPairingModal(true)}
        childProfile={childProfile}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {mode === 'parent' ? (
          /* Parent Dashboard View */
          <ParentDashboard
            liveSessions={liveSessions}
            submissions={submissions}
            onAssignmentCreated={(newAssignment) => {
              setAssignments(prev => [...prev, newAssignment]);
            }}
            onExitParentMode={() => handleSetMode('child')}
          />
        ) : (
          /* Child View */
          <>
            {lastSubmission ? (
              <CompletionSummary
                submission={lastSubmission}
                onRetry={() => {
                  setLastSubmission(null);
                  // Find assignment or retry
                  const a = assignments.find(item => item.id === lastSubmission.assignmentId);
                  if (a) setActiveAssignment(a);
                }}
                onBackToDashboard={() => {
                  setLastSubmission(null);
                  setActiveAssignment(null);
                  setIsPracticeMode(false);
                }}
                onNextAssignment={() => {
                  setLastSubmission(null);
                  // Find next assignment in sequence
                  const currentIdx = assignments.findIndex(item => item.id === lastSubmission.assignmentId);
                  if (currentIdx !== -1 && currentIdx + 1 < assignments.length) {
                    setActiveAssignment(assignments[currentIdx + 1]);
                  } else {
                    setActiveAssignment(null);
                  }
                }}
              />
            ) : activeAssignment ? (
              <AssignmentPlayer
                assignment={activeAssignment}
                childProfile={childProfile}
                wsClient={wsRef.current}
                onComplete={(submission) => {
                  setLastSubmission(submission);
                  setSubmissions(prev => [submission, ...prev]);
                  setActiveAssignment(null);
                }}
                onCancel={() => {
                  // Notify server to clear live session
                  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({
                      type: 'child_finish',
                      childId: childProfile?.id || 'child-alex'
                    }));
                  }
                  setActiveAssignment(null);
                }}
              />
            ) : isPracticeMode ? (
              <PracticeMode
                onStart={(practiceAssignment) => {
                  setIsPracticeMode(false);
                  setActiveAssignment(practiceAssignment);
                }}
                onBack={() => setIsPracticeMode(false)}
              />
            ) : (
              <ChildDashboard
                grade={grade}
                onSelectGrade={handleSelectGrade}
                assignments={assignments}
                submissions={submissions}
                onStartAssignment={(assignment) => setActiveAssignment(assignment)}
                onStartPractice={() => setIsPracticeMode(true)}
                childProfile={childProfile}
              />
            )}
          </>
        )}
      </main>

      {/* Parent PIN Authentication Modal */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => {
          setShowPinModal(false);
          handleSetMode('parent');
        }}
      />

      {/* Wi-Fi & Tablet Pairing Modal */}
      {showPairingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPairingModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <DevicePairing />
          </div>
        </div>
      )}
    </div>
  );
}
