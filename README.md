# 🧮 Mental Maths - Multi-Device Tablet & Parent Web App

A modern, responsive web application designed for family mental mathematics practice. The child uses an iPad or Android tablet to complete assignments with a touch-friendly on-screen keypad and rough work scratchpad, while the parent monitors live test progress, accuracy, and detailed question breakdowns on their phone, laptop, or desktop.

---

## 🌟 Key Features

### 🎓 Grade 2 & Grade 3 Curriculum (100 Assignments, 15 Questions Each)
- **1,500 Total Questions Pre-Seeded & Ready**:
  - **Grade 2 (50 Assignments × 15 Questions = 750 Questions)**:
    - Assignments 1–10: Addition & Subtraction within 20 (making 10, doubles, near doubles)
    - Assignments 11–20: Mental addition & subtraction adding multiples of 10 and 1-digit numbers
    - Assignments 21–30: 2-digit addition and subtraction without regrouping
    - Assignments 31–40: 2-digit mental addition and subtraction with regrouping (carrying & borrowing)
    - Assignments 41–50: Skip counting, early multiplication (2s, 3s, 5s, 10s), and Grade 2 champion challenges
  - **Grade 3 (50 Assignments × 15 Questions = 750 Questions)**:
    - Assignments 1–10: Times tables (2×, 5×, 10×) and related division facts
    - Assignments 11–20: Times tables (3×, 4×, 6×) and mental division
    - Assignments 21–30: Times tables (7×, 8×, 9×, 11×, 12×) fluency
    - Assignments 31–40: Mental division sprint & 3-digit mental addition/subtraction
    - Assignments 41–50: Grade 3 champion challenges with mixed mental arithmetic

### 📱 Tablet-First Child Experience
- **Touch-Friendly On-Screen Keypad**: Custom numeric buttons (0–9, Clear, Backspace, Submit) designed specifically for tablets so virtual keyboards never jump around or obstruct the questions. (Physical keyboards also fully supported).
- **Interactive Scratchpad**: An integrated HTML5 canvas with pen, eraser, colors, and line thickness allowing the child to carry numbers, doodle, or work out partial steps directly on the tablet screen with their finger or stylus.
- **Audio Feedback**: Instant joyful Web Audio chimes for correct answers, gentle boops for misses, and completion fanfares (with a one-tap mute toggle).
- **Celebration & Review**: Confetti animation, star awards, total time, and an instant question-by-question breakdown showing correct answers and time spent on each question.
- **Free Practice Mode**: Children can configure and practice custom mental math sprints anytime.

### 👑 Parent Control Center & Live Monitor
- **Real-Time Live Monitor**: Watch live progress via WebSockets as your child answers each question on the tablet (shows current question prompt, time elapsed, correct/missed count live).
- **PIN Protection**: Secure parent dashboard with default PIN `1234` so children cannot alter settings or view answer keys.
- **Score History & Detailed Reports**: Complete log of every submitted assignment with accuracy %, average time per question, and a drill-down into every individual answer.
- **Weak-Spot Insights**: Automatically detects patterns in missed questions (e.g. struggles on 7×/8× tables or subtraction with borrowing) to guide targeted practice.
- **Custom Assignment Creator**: Easily create additional custom 15-question sets with selectable operations (+, -, ×, ÷), specific times tables (e.g. practice 6x, 7x, 8x only), and custom number ranges.

---

## 🚀 How to Run & Connect from Multiple Devices

### 1. Start the Server
Double-click `start-mental-maths.bat` or run:
```bash
npm start
```

### 2. Access on Any Device on the Same Wi-Fi
- **From this computer**: Open [http://localhost:3000](http://localhost:3000)
- **From child's tablet or parent's phone**:
  - Open Safari, Chrome, or any browser and go to:
    ```
    http://192.168.32.8:3000
    ```
  - **Or simply scan the QR code** shown in the terminal or in the app's **"Tablet QR & Setup"** tab with your tablet's camera!

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, Web Audio API synthesis
- **Backend**: Node.js, Express, WebSockets (`ws`), QRCode generator
- **Storage**: Persistent file-backed JSON store with atomic file writes (`server/data/store.json`)
