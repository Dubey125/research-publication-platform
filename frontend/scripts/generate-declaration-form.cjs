/**
 * Generates the IJTSE Declaration Form PDF from the uploaded images.
 */
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, '..', 'public', 'IJTSE-Declaration-Form.pdf');
const artifactsDir = 'C:\\Users\\yadav\\.gemini\\antigravity\\brain\\dd46ea1b-62fe-4def-a3b1-f8388445c66c';

// The prefix corresponding to the recently uploaded form images
const files = fs.readdirSync(artifactsDir)
  .filter(f => f.startsWith('media__17755779') && f.endsWith('.jpg'))
  .sort()
  .map(f => path.join(artifactsDir, f));

console.log('Found images for PDF:', files);

if (files.length === 0) {
  console.error("No images found to generate the PDF.");
  process.exit(1);
}

// A4 dimensions: 595.28 x 841.89
const doc = new PDFDocument({ size: 'A4', autoFirstPage: false, margin: 0 });
const ws = fs.createWriteStream(outPath);
doc.pipe(ws);

files.forEach(img => {
  doc.addPage({ size: 'A4', margin: 0 });
  // Make the image cover the A4 page (fit/cover depending on what looks best, usually the form scans are A4)
  doc.image(img, 0, 0, { width: 595.28, height: 841.89 });
});

doc.end();

ws.on('finish', () => {
  console.log('✅ Generated Declaration Form PDF:', outPath);
});
