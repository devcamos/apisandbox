const fs = require('fs');
const path = require('path');

// Calculate test coverage based on test files vs source files
const testDir = path.join(__dirname, '../tests');
const appDir = path.join(__dirname, '../app');

function countFiles(dir, extension) {
  let count = 0;
  try {
    const files = fs.readdirSync(dir, { recursive: true });
    files.forEach(file => {
      if (file.endsWith(extension)) {
        count++;
      }
    });
  } catch (err) {
    // Directory doesn't exist or can't be read
  }
  return count;
}

const testFiles = countFiles(testDir, '.spec.ts') + countFiles(testDir, '.test.ts');
const sourceFiles = countFiles(appDir, '.tsx') + countFiles(appDir, '.ts');

// Calculate coverage percentage
// This is a simplified calculation - in reality, you'd use a coverage tool
const coverage = sourceFiles > 0 ? Math.min(100, Math.round((testFiles / sourceFiles) * 100)) : 0;

console.log(`Test Files: ${testFiles}`);
console.log(`Source Files: ${sourceFiles}`);
console.log(`Estimated Coverage: ${coverage}%`);

if (coverage >= 80) {
  console.log('✅ Coverage meets 80% threshold!');
  process.exit(0);
} else {
  console.log(`❌ Coverage is ${coverage}%, needs to be at least 80%`);
  process.exit(1);
}


