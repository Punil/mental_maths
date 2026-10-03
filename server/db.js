import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateGrade2Curriculum, generateGrade3Curriculum } from './curriculumGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let store = null;

function loadStore() {
  if (store) return store;

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      store = JSON.parse(raw);
    } catch (err) {
      console.error('Error reading store.json, reinitializing:', err);
    }
  }

  if (!store || !store.assignments || store.assignments.length === 0) {
    console.log('Seeding Grade 2 (50 assignments) and Grade 3 (50 assignments)...');
    const g2 = generateGrade2Curriculum();
    const g3 = generateGrade3Curriculum();

    store = {
      parentPin: '1234',
      profiles: [
        { id: 'p1', name: 'Alex', role: 'child', grade: 2, avatar: '🦊' },
        { id: 'p2', name: 'Sam', role: 'child', grade: 3, avatar: '🚀' },
        { id: 'p-parent', name: 'Parent', role: 'parent', avatar: '👑' }
      ],
      assignments: [...g2, ...g3],
      submissions: [],
      liveSessions: {}
    };

    saveStore();
  }

  return store;
}

function saveStore() {
  if (!store) return;
  try {
    const tmpFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(store, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.error('Failed to save store atomically:', err);
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
  }
}

export const db = {
  getProfiles() {
    return loadStore().profiles;
  },

  verifyParentPin(inputPin) {
    return (loadStore().parentPin || '1234') === String(inputPin).trim();
  },

  setParentPin(newPin) {
    const s = loadStore();
    s.parentPin = String(newPin).trim();
    saveStore();
    return true;
  },

  getAssignments(grade) {
    const assignments = loadStore().assignments;
    if (grade) {
      return assignments.filter(a => Number(a.grade) === Number(grade));
    }
    return assignments;
  },

  getAssignmentById(id) {
    return loadStore().assignments.find(a => a.id === id) || null;
  },

  addAssignment(assignment) {
    const s = loadStore();
    s.assignments.push(assignment);
    saveStore();
    return assignment;
  },

  deleteAssignment(id) {
    const s = loadStore();
    const idx = s.assignments.findIndex(a => a.id === id);
    if (idx !== -1) {
      const removed = s.assignments.splice(idx, 1)[0];
      saveStore();
      return removed;
    }
    return null;
  },

  getSubmissions(childId, grade) {
    const s = loadStore();
    let subs = s.submissions || [];
    if (childId) {
      subs = subs.filter(sub => sub.childId === childId);
    }
    if (grade) {
      subs = subs.filter(sub => Number(sub.grade) === Number(grade));
    }
    // Return latest first
    return subs.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  },

  addSubmission(submission) {
    const s = loadStore();
    if (!s.submissions) s.submissions = [];
    s.submissions.push(submission);
    saveStore();
    return submission;
  },

  updateLiveSession(session) {
    const s = loadStore();
    if (!s.liveSessions) s.liveSessions = {};
    s.liveSessions[session.childId] = {
      ...session,
      updatedAt: new Date().toISOString()
    };
    return s.liveSessions[session.childId];
  },

  clearLiveSession(childId) {
    const s = loadStore();
    if (s.liveSessions && s.liveSessions[childId]) {
      delete s.liveSessions[childId];
    }
  },

  getLiveSessions() {
    return Object.values(loadStore().liveSessions || {});
  }
};
