const fs = require('fs');

const files = [
  'src/components/modals/ChatModal.astro',
  'src/components/modals/DemoModal.astro',
  'src/components/modals/InteractiveModal.astro'
];

let allPassed = true;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`Verifying ${file}...`);

  const hasCloseChar = content.includes('✕');
  const hasOldCloseChar = content.includes('×') || content.includes('&times;');
  const hasAriaLabel = content.includes('aria-label="Fechar');
  const hasFocusClasses = content.includes('focus-visible:ring-2 focus-visible:outline-none rounded');

  if (!hasCloseChar) {
    console.error(`❌ ${file} is missing the correct close character (✕)`);
    allPassed = false;
  }
  if (hasOldCloseChar) {
    console.error(`❌ ${file} still contains an old close character (× or &times;)`);
    allPassed = false;
  }
  if (!hasAriaLabel) {
    console.error(`❌ ${file} is missing an aria-label for closing`);
    allPassed = false;
  }
  if (!hasFocusClasses) {
    console.error(`❌ ${file} is missing the correct focus classes`);
    allPassed = false;
  }

  if (hasCloseChar && !hasOldCloseChar && hasAriaLabel && hasFocusClasses) {
    console.log(`✅ ${file} passed all checks.`);
  }
});

if (allPassed) {
  console.log('\\nAll files verified successfully!');
} else {
  console.error('\\nSome files failed verification.');
  process.exit(1);
}
