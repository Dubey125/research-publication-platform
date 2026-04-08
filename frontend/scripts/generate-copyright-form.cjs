// generate-copyright-form.cjs
// Generates a high‑resolution Copyright Transfer Form PDF with the journal logo.
// Run with: node scripts/generate-copyright-form.cjs

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Output path (public folder)
const out = path.join(__dirname, '..', 'public', 'copyright-transfer-form.pdf');

// Colors and layout constants
const C = {
  navy: '#1B3A5C',
  gold: '#D4A843',
  white: '#FFFFFF',
  dark: '#333333',
  light: '#999999',
  border: '#CCCCCC',
};
const MARGIN = 50;
const PAGE_WIDTH = 595.28; // A4 width in points
const PAGE_HEIGHT = 841.89; // A4 height
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const doc = new PDFDocument({ size: 'A4', margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } });
const ws = fs.createWriteStream(out);

doc.pipe(ws);

// Header with logo
function header(d) {
  // Background bar
  d.save()
    .rect(MARGIN, MARGIN - 20, CONTENT_WIDTH, 30)
    .fill(C.navy)
    .restore();
  // Journal title
  d.font('Helvetica-Bold')
    .fontSize(12)
    .fillColor(C.white)
    .text('International Journal of Transdisciplinary Science and Engineering', MARGIN + 5, MARGIN - 15, { lineBreak: false });
  // Logo (if exists)
  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
  if (fs.existsSync(logoPath)) {
    d.image(logoPath, PAGE_WIDTH - MARGIN - 45, MARGIN - 18, { width: 40 });
  }
  d.moveDown();
}

function footer(d, pageNum) {
  const y = PAGE_HEIGHT - MARGIN + 10;
  d.font('Helvetica')
    .fontSize(8)
    .fillColor(C.light)
    .text(`© IJTSE – Page ${pageNum}`, MARGIN, y, { align: 'center', width: CONTENT_WIDTH });
}

function addLabel(d, label, y) {
  d.font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(C.dark)
    .text(label, MARGIN, y);
}

function addField(d, placeholder, y) {
  d.font('Helvetica')
    .fontSize(10)
    .fillColor(C.dark)
    .text(placeholder, MARGIN, y);
  // underline for signature fields
  d.moveTo(MARGIN, y + 12)
    .lineTo(PAGE_WIDTH - MARGIN, y + 12)
    .strokeColor(C.border)
    .lineWidth(0.5)
    .stroke();
}

// Build page
let yPos = MARGIN + 30; // after header bar
header(doc);

yPos += 20;
addLabel(doc, 'Copyright Transfer Form', yPos);
yPos += 20;
addField(doc, 'Author Name: _______________________________________________', yPos);
yPos += 20;
addField(doc, 'Paper Title: _________________________________________________', yPos);
yPos += 20;
addField(doc, 'Corresponding Author Email: ___________________________________', yPos);
yPos += 30;
addLabel(doc, 'Declaration', yPos);
yPos += 15;
addField(doc, 'I hereby confirm that this manuscript is original and has not been submitted elsewhere.', yPos);
yPos += 20;
addField(doc, 'I agree to transfer publication rights to the journal for print and digital dissemination.', yPos);

yPos += 20;
addField(doc, 'All co‑authors have approved this submission and declaration.', yPos);

yPos += 30;
addLabel(doc, 'Signature', yPos);
addField(doc, 'Signature: ________________________', yPos);
yPos += 20;
addField(doc, 'Date: _______________', yPos);
yPos += 20;
addField(doc, 'Place: ____________________________', yPos);

footer(doc, 1);

doc.end();

ws.on('finish', () => {
  const stats = fs.statSync(out);
  console.log('✅ Generated copyright-transfer-form.pdf');
  console.log('   Size:', (stats.size / 1024).toFixed(1), 'KB');
});
