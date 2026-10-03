import { generateGrade2Curriculum, generateGrade3Curriculum } from './server/curriculumGenerator.js';
import { db } from './server/db.js';

console.log('--- Testing Grade 2 Curriculum ---');
const g2 = generateGrade2Curriculum();
console.log(`Grade 2 Assignments Count: ${g2.length}`);
if (g2.length !== 50) throw new Error(`Expected 50 Grade 2 assignments, got ${g2.length}`);

let g2TotalQuestions = 0;
g2.forEach((a, idx) => {
  if (a.questions.length !== 15) {
    throw new Error(`Assignment ${a.id} has ${a.questions.length} questions, expected 15!`);
  }
  g2TotalQuestions += a.questions.length;
  a.questions.forEach((q) => {
    let expected;
    if (q.operator === '+') expected = q.operand1 + q.operand2;
    else if (q.operator === '-') expected = q.operand1 - q.operand2;
    else if (q.operator === '×') expected = q.operand1 * q.operand2;
    else if (q.operator === '÷') expected = q.operand1 / q.operand2;
    if (expected !== q.answer) {
      throw new Error(`Math error in ${q.id}: ${q.operand1} ${q.operator} ${q.operand2} != ${q.answer} (got ${expected})`);
    }
  });
});
console.log(`Grade 2 Math Verified: 50 assignments, ${g2TotalQuestions} questions, all 100% correct!`);

console.log('\n--- Testing Grade 3 Curriculum ---');
const g3 = generateGrade3Curriculum();
console.log(`Grade 3 Assignments Count: ${g3.length}`);
if (g3.length !== 50) throw new Error(`Expected 50 Grade 3 assignments, got ${g3.length}`);

let g3TotalQuestions = 0;
g3.forEach((a, idx) => {
  if (a.questions.length !== 15) {
    throw new Error(`Assignment ${a.id} has ${a.questions.length} questions, expected 15!`);
  }
  g3TotalQuestions += a.questions.length;
  a.questions.forEach((q) => {
    let expected;
    if (q.operator === '+') expected = q.operand1 + q.operand2;
    else if (q.operator === '-') expected = q.operand1 - q.operand2;
    else if (q.operator === '×') expected = q.operand1 * q.operand2;
    else if (q.operator === '÷') expected = q.operand1 / q.operand2;
    if (expected !== q.answer) {
      throw new Error(`Math error in ${q.id}: ${q.operand1} ${q.operator} ${q.operand2} != ${q.answer} (got ${expected})`);
    }
  });
});
console.log(`Grade 3 Math Verified: 50 assignments, ${g3TotalQuestions} questions, all 100% correct!`);

console.log('\n--- Testing Datastore Seeding ---');
const allAssignments = db.getAssignments();
console.log(`Total seeded in DB: ${allAssignments.length}`);
const g2InDb = db.getAssignments(2);
const g3InDb = db.getAssignments(3);
console.log(`Grade 2 in DB: ${g2InDb.length}`);
console.log(`Grade 3 in DB: ${g3InDb.length}`);

if (allAssignments.length < 100) {
  throw new Error(`Database seeding failed: expected >= 100 assignments, found ${allAssignments.length}`);
}

console.log('\n✅ ALL VERIFICATION CHECKS PASSED PERFECTLY!');
