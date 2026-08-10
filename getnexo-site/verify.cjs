const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'src/components/ChatInterface.jsx'), 'utf-8');

if (content.includes('aria-label="Voltar para contatos"')) {
    console.log('Test passed: aria-label added successfully!');
    process.exit(0);
} else {
    console.error('Test failed: aria-label missing!');
    process.exit(1);
}
