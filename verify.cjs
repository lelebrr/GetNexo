const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, 'getnexo-site', 'src', 'components', 'MeetingScheduler.jsx');
const content = fs.readFileSync(targetFilePath, 'utf8');

const expectedCode = `aria-label="Fechar" className="text-gray-500 hover:text-white transition-colors text-2xl focus-visible:ring-2 focus-visible:outline-none rounded">✕</button>`;

if (content.includes(expectedCode)) {
  console.log('✅ MeetingScheduler.jsx has the correct aria-label and focus classes.');
  process.exit(0);
} else {
  console.error('❌ Error: Expected code not found in MeetingScheduler.jsx.');
  console.error('Expected to find:');
  console.error(expectedCode);
  process.exit(1);
}
