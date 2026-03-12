const fs = require('fs');

function checkFile(filePath, componentName) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if the file contains the aria-label
    if (!content.includes('aria-label=')) {
        console.error(`❌ ${componentName}: Missing aria-label`);
        process.exit(1);
    }

    // Check if the file contains focus-visible
    if (!content.includes('focus-visible:ring-2')) {
        console.error(`❌ ${componentName}: Missing focus styles`);
        process.exit(1);
    }

    console.log(`✅ ${componentName} looks good!`);
}

checkFile('src/components/MeetingScheduler.jsx', 'MeetingScheduler');
checkFile('src/components/KanbanBoard.jsx', 'KanbanBoard');

console.log('All checks passed!');
