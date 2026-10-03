/**
 * Curriculum Question Generator for Grade 2 and Grade 3
 * Generates 50 structured assignments for Grade 2 (15 questions each)
 * and 50 structured assignments for Grade 3 (15 questions each).
 */

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Creates a single question object
 */
function makeQ(id, num1, op, num2, answer) {
  return {
    id,
    operand1: num1,
    operator: op,
    operand2: num2,
    answer,
    prompt: `${num1} ${op} ${num2} =`
  };
}

/**
 * Grade 2 Generator: 50 Assignments x 15 Questions
 */
export function generateGrade2Curriculum() {
  const assignments = [];

  for (let aNum = 1; aNum <= 50; aNum++) {
    const questions = [];
    const aId = `g2-${String(aNum).padStart(2, '0')}`;
    let title = "";
    let category = "";
    let description = "";

    if (aNum <= 5) {
      category = "Addition within 20";
      title = `Addition within 20 (Part ${aNum})`;
      description = "Mastering facts up to 20, making 10, doubles and near-doubles.";
      for (let q = 1; q <= 15; q++) {
        let n1, n2;
        if (aNum === 1) {
          // Bonds of 10 and small sums
          n1 = randInt(1, 9);
          n2 = randInt(1, 10 - n1);
        } else if (aNum === 2) {
          // Doubles and near doubles
          const base = randInt(2, 9);
          n1 = base;
          n2 = pickRandom([base, base + 1, base - 1 > 0 ? base - 1 : base]);
        } else {
          // Sums between 10 and 20
          n1 = randInt(4, 9);
          n2 = randInt(3, 9);
        }
        questions.push(makeQ(`${aId}-q${q}`, n1, '+', n2, n1 + n2));
      }
    } else if (aNum <= 10) {
      category = "Subtraction within 20";
      title = `Subtraction within 20 (Part ${aNum - 5})`;
      description = "Fast subtraction facts within 20 and counting back.";
      for (let q = 1; q <= 15; q++) {
        const sum = randInt(8, 20);
        const sub = randInt(2, sum - 1);
        questions.push(makeQ(`${aId}-q${q}`, sum, '-', sub, sum - sub));
      }
    } else if (aNum <= 15) {
      category = "Adding Tens & Simple 2-Digit";
      title = `Adding Tens & Basic 2-Digit (Part ${aNum - 10})`;
      description = "Mental addition adding 10s and 1-digit numbers to 2-digit numbers without carrying.";
      for (let q = 1; q <= 15; q++) {
        if (q % 2 === 0) {
          // Adding tens: e.g. 40 + 30 or 25 + 20
          const tens1 = randInt(1, 7) * 10;
          const tens2 = randInt(1, 9 - tens1 / 10) * 10;
          questions.push(makeQ(`${aId}-q${q}`, tens1, '+', tens2, tens1 + tens2));
        } else {
          // 2-digit + 1-digit (no regrouping)
          const baseTen = randInt(1, 8) * 10;
          const ones = randInt(1, 5);
          const add = randInt(1, 4);
          questions.push(makeQ(`${aId}-q${q}`, baseTen + ones, '+', add, baseTen + ones + add));
        }
      }
    } else if (aNum <= 20) {
      category = "Subtracting Tens & Simple 2-Digit";
      title = `Subtracting Tens & Basic 2-Digit (Part ${aNum - 15})`;
      description = "Mental subtraction with multiples of 10 and 1-digit numbers.";
      for (let q = 1; q <= 15; q++) {
        if (q % 2 === 0) {
          const tens1 = randInt(3, 9) * 10;
          const tens2 = randInt(1, tens1 / 10 - 1) * 10;
          questions.push(makeQ(`${aId}-q${q}`, tens1, '-', tens2, tens1 - tens2));
        } else {
          const baseTen = randInt(2, 9) * 10;
          const ones = randInt(5, 9);
          const sub = randInt(1, ones - 1);
          questions.push(makeQ(`${aId}-q${q}`, baseTen + ones, '-', sub, baseTen + ones - sub));
        }
      }
    } else if (aNum <= 25) {
      category = "2-Digit Addition (No Regrouping)";
      title = `2-Digit Addition - Direct (Part ${aNum - 20})`;
      description = "Adding two 2-digit numbers where sum of ones is less than 10.";
      for (let q = 1; q <= 15; q++) {
        const t1 = randInt(1, 5);
        const t2 = randInt(1, 4);
        const o1 = randInt(0, 5);
        const o2 = randInt(0, 4);
        const n1 = t1 * 10 + o1;
        const n2 = t2 * 10 + o2;
        questions.push(makeQ(`${aId}-q${q}`, n1, '+', n2, n1 + n2));
      }
    } else if (aNum <= 30) {
      category = "2-Digit Subtraction (No Regrouping)";
      title = `2-Digit Subtraction - Direct (Part ${aNum - 25})`;
      description = "Subtracting two 2-digit numbers without borrowing.";
      for (let q = 1; q <= 15; q++) {
        const t1 = randInt(3, 8);
        const t2 = randInt(1, t1 - 1);
        const o1 = randInt(4, 9);
        const o2 = randInt(0, o1);
        const n1 = t1 * 10 + o1;
        const n2 = t2 * 10 + o2;
        questions.push(makeQ(`${aId}-q${q}`, n1, '-', n2, n1 - n2));
      }
    } else if (aNum <= 35) {
      category = "2-Digit Addition (With Regrouping)";
      title = `2-Digit Addition with Regrouping (Part ${aNum - 30})`;
      description = "Carrying mental addition sums across 10s.";
      for (let q = 1; q <= 15; q++) {
        const t1 = randInt(1, 5);
        const t2 = randInt(1, 3);
        const o1 = randInt(5, 9);
        const o2 = randInt(10 - o1, 9); // forces regrouping
        const n1 = t1 * 10 + o1;
        const n2 = t2 * 10 + o2;
        questions.push(makeQ(`${aId}-q${q}`, n1, '+', n2, n1 + n2));
      }
    } else if (aNum <= 40) {
      category = "2-Digit Subtraction (With Regrouping)";
      title = `2-Digit Subtraction with Regrouping (Part ${aNum - 35})`;
      description = "Mental subtraction requiring borrowing from the tens place.";
      for (let q = 1; q <= 15; q++) {
        const t1 = randInt(3, 8);
        const t2 = randInt(1, t1 - 1);
        const o1 = randInt(0, 4);
        const o2 = randInt(o1 + 1, 9); // forces borrowing
        const n1 = t1 * 10 + o1;
        const n2 = t2 * 10 + o2;
        questions.push(makeQ(`${aId}-q${q}`, n1, '-', n2, n1 - n2));
      }
    } else if (aNum <= 45) {
      category = "Skip Counting & Early Multiplication";
      title = `Skip Counting & Times Tables intro (Part ${aNum - 40})`;
      description = "Foundation of multiplication: 2s, 5s, 10s and 3s.";
      for (let q = 1; q <= 15; q++) {
        const multiplier = pickRandom([2, 3, 5, 10]);
        const times = randInt(1, 10);
        questions.push(makeQ(`${aId}-q${q}`, multiplier, '×', times, multiplier * times));
      }
    } else {
      category = "Grade 2 Mastery Sprint";
      title = `Grade 2 Champion Challenge #${aNum - 45}`;
      description = "Speed sprint mixed review of all Grade 2 addition, subtraction, and early multiplication.";
      for (let q = 1; q <= 15; q++) {
        const mode = randInt(1, 3);
        if (mode === 1) {
          // 2-digit addition
          const n1 = randInt(15, 55);
          const n2 = randInt(10, 40);
          questions.push(makeQ(`${aId}-q${q}`, n1, '+', n2, n1 + n2));
        } else if (mode === 2) {
          // 2-digit subtraction
          const n1 = randInt(35, 95);
          const n2 = randInt(10, n1 - 5);
          questions.push(makeQ(`${aId}-q${q}`, n1, '-', n2, n1 - n2));
        } else {
          // early tables (2, 5, 10)
          const m = pickRandom([2, 3, 5, 10]);
          const t = randInt(2, 9);
          questions.push(makeQ(`${aId}-q${q}`, m, '×', t, m * t));
        }
      }
    }

    assignments.push({
      id: aId,
      grade: 2,
      assignmentNumber: aNum,
      title,
      category,
      description,
      questionCount: 15,
      timeLimitMinutes: 10,
      questions
    });
  }

  return assignments;
}

/**
 * Grade 3 Generator: 50 Assignments x 15 Questions
 */
export function generateGrade3Curriculum() {
  const assignments = [];

  for (let aNum = 1; aNum <= 50; aNum++) {
    const questions = [];
    const aId = `g3-${String(aNum).padStart(2, '0')}`;
    let title = "";
    let category = "";
    let description = "";

    if (aNum <= 5) {
      category = "Times Tables: 2x, 5x, 10x";
      title = `Multiplication & Division: 2, 5, 10 (Part ${aNum})`;
      description = "Rapid recall of 2x, 5x, 10x tables and reciprocal division facts.";
      for (let q = 1; q <= 15; q++) {
        const factor1 = pickRandom([2, 5, 10]);
        const factor2 = randInt(1, 10);
        if (q % 3 === 0) {
          // Division
          const product = factor1 * factor2;
          questions.push(makeQ(`${aId}-q${q}`, product, '÷', factor1, factor2));
        } else {
          // Multiplication
          questions.push(makeQ(`${aId}-q${q}`, factor1, '×', factor2, factor1 * factor2));
        }
      }
    } else if (aNum <= 10) {
      category = "Times Tables: 3x, 4x";
      title = `Multiplication & Division: 3 and 4 (Part ${aNum - 5})`;
      description = "Mastering the 3x and 4x tables and corresponding division.";
      for (let q = 1; q <= 15; q++) {
        const factor1 = pickRandom([3, 4]);
        const factor2 = randInt(1, 10);
        if (q % 3 === 0) {
          const product = factor1 * factor2;
          questions.push(makeQ(`${aId}-q${q}`, product, '÷', factor1, factor2));
        } else {
          questions.push(makeQ(`${aId}-q${q}`, factor1, '×', factor2, factor1 * factor2));
        }
      }
    } else if (aNum <= 15) {
      category = "Times Tables: 6x, 7x";
      title = `Multiplication & Division: 6 and 7 (Part ${aNum - 10})`;
      description = "Conquering the 6x and 7x multiplication and division facts.";
      for (let q = 1; q <= 15; q++) {
        const factor1 = pickRandom([6, 7]);
        const factor2 = randInt(2, 10);
        if (q % 3 === 0) {
          const product = factor1 * factor2;
          questions.push(makeQ(`${aId}-q${q}`, product, '÷', factor1, factor2));
        } else {
          questions.push(makeQ(`${aId}-q${q}`, factor1, '×', factor2, factor1 * factor2));
        }
      }
    } else if (aNum <= 20) {
      category = "Times Tables: 8x, 9x";
      title = `Multiplication & Division: 8 and 9 (Part ${aNum - 15})`;
      description = "Fluent recall of 8x and 9x facts and division tricks (e.g. 9s finger rule).";
      for (let q = 1; q <= 15; q++) {
        const factor1 = pickRandom([8, 9]);
        const factor2 = randInt(2, 10);
        if (q % 3 === 0) {
          const product = factor1 * factor2;
          questions.push(makeQ(`${aId}-q${q}`, product, '÷', factor1, factor2));
        } else {
          questions.push(makeQ(`${aId}-q${q}`, factor1, '×', factor2, factor1 * factor2));
        }
      }
    } else if (aNum <= 25) {
      category = "Times Tables: 11x, 12x";
      title = `Advanced Tables: 11 and 12 (Part ${aNum - 20})`;
      description = "Mastering 11x patterns and 12x facts up to 144.";
      for (let q = 1; q <= 15; q++) {
        const factor1 = pickRandom([11, 12]);
        const factor2 = randInt(2, 12);
        if (q % 3 === 0) {
          const product = factor1 * factor2;
          questions.push(makeQ(`${aId}-q${q}`, product, '÷', factor1, factor2));
        } else {
          questions.push(makeQ(`${aId}-q${q}`, factor1, '×', factor2, factor1 * factor2));
        }
      }
    } else if (aNum <= 30) {
      category = "All Times Tables Fluency (1-12)";
      title = `Full Multiplication Matrix (Part ${aNum - 25})`;
      description = "Comprehensive random mix of all multiplication tables from 2x12 to 12x12.";
      for (let q = 1; q <= 15; q++) {
        const f1 = randInt(2, 12);
        const f2 = randInt(2, 12);
        questions.push(makeQ(`${aId}-q${q}`, f1, '×', f2, f1 * f2));
      }
    } else if (aNum <= 35) {
      category = "Mental Division Fluency";
      title = `Division Master Sprint (Part ${aNum - 30})`;
      description = "Division facts within 100 with clean whole-number quotients.";
      for (let q = 1; q <= 15; q++) {
        const divisor = randInt(2, 10);
        const quotient = randInt(2, 10);
        const dividend = divisor * quotient;
        questions.push(makeQ(`${aId}-q${q}`, dividend, '÷', divisor, quotient));
      }
    } else if (aNum <= 40) {
      category = "3-Digit Mental Addition & Subtraction";
      title = `3-Digit Mental Math (Part ${aNum - 35})`;
      description = "Adding and subtracting with multiples of 10 and 100 up to 1,000.";
      for (let q = 1; q <= 15; q++) {
        if (q % 2 === 0) {
          // Addition
          const n1 = randInt(12, 60) * 10;
          const n2 = randInt(10, 35) * 10;
          questions.push(makeQ(`${aId}-q${q}`, n1, '+', n2, n1 + n2));
        } else {
          // Subtraction
          const n1 = randInt(40, 95) * 10;
          const n2 = randInt(10, (n1 / 10) - 5) * 10;
          questions.push(makeQ(`${aId}-q${q}`, n1, '-', n2, n1 - n2));
        }
      }
    } else if (aNum <= 45) {
      category = "Mixed Operations & Logic";
      title = `Mixed Mental Arithmetic (Part ${aNum - 40})`;
      description = "Dynamic switching between addition, subtraction, multiplication, and division.";
      for (let q = 1; q <= 15; q++) {
        const op = pickRandom(['+', '-', '×', '÷']);
        if (op === '+') {
          const n1 = randInt(25, 150);
          const n2 = randInt(20, 120);
          questions.push(makeQ(`${aId}-q${q}`, n1, '+', n2, n1 + n2));
        } else if (op === '-') {
          const n1 = randInt(80, 200);
          const n2 = randInt(15, n1 - 10);
          questions.push(makeQ(`${aId}-q${q}`, n1, '-', n2, n1 - n2));
        } else if (op === '×') {
          const n1 = randInt(3, 9);
          const n2 = randInt(4, 9);
          questions.push(makeQ(`${aId}-q${q}`, n1, '×', n2, n1 * n2));
        } else {
          const div = randInt(3, 9);
          const ans = randInt(3, 9);
          questions.push(makeQ(`${aId}-q${q}`, div * ans, '÷', div, ans));
        }
      }
    } else {
      category = "Grade 3 Grand Champion Challenge";
      title = `Grade 3 Grand Champion #${aNum - 45}`;
      description = "High-speed mental math sprint covering the entire Grade 3 math benchmark.";
      for (let q = 1; q <= 15; q++) {
        const op = pickRandom(['×', '÷', '+', '-']);
        if (op === '×') {
          const n1 = randInt(4, 12);
          const n2 = randInt(4, 12);
          questions.push(makeQ(`${aId}-q${q}`, n1, '×', n2, n1 * n2));
        } else if (op === '÷') {
          const div = randInt(4, 12);
          const ans = randInt(3, 11);
          questions.push(makeQ(`${aId}-q${q}`, div * ans, '÷', div, ans));
        } else if (op === '+') {
          const n1 = randInt(45, 250);
          const n2 = randInt(35, 180);
          questions.push(makeQ(`${aId}-q${q}`, n1, '+', n2, n1 + n2));
        } else {
          const n1 = randInt(120, 300);
          const n2 = randInt(25, n1 - 20);
          questions.push(makeQ(`${aId}-q${q}`, n1, '-', n2, n1 - n2));
        }
      }
    }

    assignments.push({
      id: aId,
      grade: 3,
      assignmentNumber: aNum,
      title,
      category,
      description,
      questionCount: 15,
      timeLimitMinutes: 10,
      questions
    });
  }

  return assignments;
}

/**
 * Generator for custom on-the-fly assignments created by parents
 */
export function generateCustomAssignment({
  title = "Custom Math Assignment",
  grade = 2,
  operations = ['+'],
  minNum = 1,
  maxNum = 20,
  tables = [],
  questionCount = 15,
  timeLimitMinutes = 10
}) {
  const questions = [];
  const id = `custom-${Date.now()}`;

  for (let i = 1; i <= questionCount; i++) {
    const op = pickRandom(operations.length > 0 ? operations : ['+']);
    let n1, n2, ans;

    if (op === '+') {
      n1 = randInt(minNum, maxNum);
      n2 = randInt(minNum, maxNum);
      ans = n1 + n2;
    } else if (op === '-') {
      n1 = randInt(minNum, maxNum);
      n2 = randInt(minNum, n1);
      ans = n1 - n2;
    } else if (op === '×') {
      if (tables && tables.length > 0) {
        n1 = pickRandom(tables);
        n2 = randInt(1, 12);
      } else {
        n1 = randInt(Math.max(1, minNum), Math.min(12, maxNum));
        n2 = randInt(1, 12);
      }
      ans = n1 * n2;
    } else { // '÷'
      let div;
      if (tables && tables.length > 0) {
        div = pickRandom(tables);
      } else {
        div = randInt(2, Math.min(12, maxNum));
      }
      ans = randInt(1, 10);
      n1 = div * ans;
      n2 = div;
    }

    questions.push(makeQ(`${id}-q${i}`, n1, op, n2, ans));
  }

  return {
    id,
    grade,
    isCustom: true,
    title,
    category: "Custom Parent Assignment",
    description: `Created by parent with operations: ${operations.join(', ')}`,
    questionCount,
    timeLimitMinutes,
    questions,
    createdAt: new Date().toISOString()
  };
}
